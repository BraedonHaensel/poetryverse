# ngrok Setup

- Install ngrok:
  - npm install ngrok -g
  - Create ngrok account and get authtoken from the dashboard:
    - https://dashboard.ngrok.com/get-started/your-authtoken
  - npm run dev
  - In another terminal:
    - npm run ngrok
    - Copy the URL (ex: https://dendrochronological-shiftily-neomi.ngrok-free.dev/)

- Set up oauth to use the ngrok URL:
  - https://console.cloud.google.com/
  - Select a project > New project > PoetryVerse > Create > Select the project
  - Search "Branding":
    - Get started
    - App name: PoetryVerse
    - User support email: <your email>
    - External
    - Contact Information: <your email>
    - Create
  - Search "Credentials":
    - Create credentials > OAuth client ID
    - Web application
    - Name: PoetryVerse
    - Authorized JavaScript origins:
      - <Add your ngrok URL>
    - Authorized redirect URIs:
      - <Add your ngrok URL>
      - <Add your ngrok URL and append "/api/auth/callback/google" to it. Ex:
        - https://dendrochronological-shiftily-neomi.ngrok-free.dev/api/auth/callback/google
    - Save

- ENV tip: You can redefine env variables for ngrok at the bottom, then you can easily comment them out to revert to the default env values (the furthest down env redefinition is the one that takes over when running the app)

- In the apps/web .env file:
  - Update the GOOGLE_CLIENT_ID for your credentials
  - Update the GOOGLE_CLIENT_SECRET for your credentials
  - Update the NEXTAUTH_URL to the ngrok URL
  - Rerun "npm run dev" to pull in the new env vars

- _Backend support_ In the apps/api .env file:
  - Update NEXT_PUBLIC_FRONTEND_URL for your ngrok URL

- Wait 5 minutes, then the ngrok URL should now work with Google OAuth from your phone :D
  - Message Braedon if you have any questions or need help

- After the initial setup, for future runs of ngrok remember to update:
  - NEXTAUTH_URL=<ngrok_url>
  - https://console.cloud.google.com/
    - Update the Credentials > Authorized JavaScript origins and the two redirect URIs
  - Rerun "npm run dev" to pull in the new env vars

# PowerShell Aliases

Create the config file:

- New-Item -Path $PROFILE -ItemType File -Force

Open the file in an editor:

- notepad $PROFILE

// Add your aliases, then exit the editor...

Apply the changes:

- . $PROFILE

Reset your PowerShell terminals to ensure they load the new command aliases.

# PowerShell Aliases Example File

```
# To apply these changes run this command:
# . $PROFILE

function up {
  docker compose up --build --watch
}

function down {
  docker compose down -v
}

function seed {
  docker compose run --rm migrate npm run db:seed --workspace=packages/database
}

# Reset then seed
function rseed {
  docker compose run --rm migrate npm run db:migrate:reset --workspace=packages/database
  docker compose run --rm migrate npm run db:seed --workspace=packages/database
}

function prseed {
  docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate npm run db:migrate:reset --workspace=packages/database
  docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate npm run db:seed --workspace=packages/database
}

function pup {
  docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up --build
}

function pdown {
  docker compose -f docker-compose.yml -f docker-compose.prod.yml down
}
```
