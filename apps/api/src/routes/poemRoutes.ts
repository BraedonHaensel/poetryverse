import dotenv from "dotenv";
dotenv.config();

import { Router } from 'express'
import { Request,Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { error } from "console";

const router = Router()


// Init Google Gemini Client
const geminiApiKey = process.env["GEMINI_API_KEY"];

if (!geminiApiKey) {
    throw new Error("Gemini API failed to retrieve from env");
}

const geminiClient = new GoogleGenerativeAI(geminiApiKey);

const model = geminiClient.getGenerativeModel({
            model: "gemini-2.5-flash"
        })


/**
 * Generates a poem using AI based on a given prompt and poem type.
 *
 * @param prompt The topic selected used to generate a poem.
 * @param poemType The type/style of poem requested by user (e.g., haiku, sonnet, free verse).
 * @returns The generated poem as a string.
 */
 

interface PoemAIRequest {
    type: string,
    prompt: string
}

interface PoemAIResponse {
    title: string,
    poem: string
}

/*Helper function: Parse AI Response*/
const generateParser = (responseText: string) : PoemAIResponse => {
    const parsedJSON = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(parsedJSON);
}

router.post("/generate", async (req: Request<{},{},PoemAIRequest>, res: Response) => {
    try {
        const {type, prompt} = req.body;

        if (!type || !prompt) {
            return res.status(400).json({error: "type or poem not provided"});
        }

        const geminiPrompt = `Generate a ${type} poem and title based off the following prompt below: \n ${prompt} \n Ensure that only the JSON is returned in the following format \n {"title": "...", "poem": "..."}`
        const result = await model.generateContent(geminiPrompt);
        const responseText = result.response.text();
        const responseJSON: PoemAIResponse = generateParser(responseText)

        return res.status(200).json({data: responseJSON})
    } catch {
        console.error("Error Generating Poem");
        return res.status(500).json({error:"Poem Failed to generate"});
    }
})

export default router
