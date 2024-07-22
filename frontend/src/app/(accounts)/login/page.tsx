"use client"

import {EyeFilledIcon} from "@/components/icons/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/components/icons/EyeSlashFilledIcon";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { Input, button } from "@nextui-org/react";

export default function Page() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  
  if (status === "loading") {
    return <div>Loading...</div>
  }

  function toggleVisibility () {
    setIsVisible((prev) => !prev)
  }
  console.log(session)

  return (
    <>
      {!session ? (
        <>
          Not signed in <br />
          
          <form action="">
            <Input
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
            />
          </form>
          

        </>
      ) : null}
    </>
  )
}
