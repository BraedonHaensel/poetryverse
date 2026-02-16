"use client"
import React from 'react'
import { Button } from './ui/button'
import { text } from 'stream/consumers'
import { signOut } from 'next-auth/react'

type Props = {text:string}

const SignOutButton = ({text}: Props) => {
  return (
    <Button onClick = {() => {
        signOut()
    }}>{text}</Button>
  )
}

export default SignOutButton