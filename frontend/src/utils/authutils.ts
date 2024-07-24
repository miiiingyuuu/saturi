// authUtils.ts
import api from "@/lib/axios";
import { FormEvent } from "react";

interface IHandleLogin {
  event: FormEvent
  email: string
  password: string
  router: any
}

export async function handleLogin({ event, email, password, router }: IHandleLogin) {
  event.preventDefault();

  api.post("/user/auth/login", {
    email,
    password,
    userType: "NORMAL",
  })
    .then((response) => {
      console.log(response)
      router.push("/")
    })
    .catch((error) => {
      console.log(error)
    })
}