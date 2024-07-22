"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <>
      {!session ? (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      ) : (
        <>
          Signed in as {session.user?.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  )
}
