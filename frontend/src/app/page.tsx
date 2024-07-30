"use client"

import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

export default function App() {
  switch (true) {
    case sessionStorage.getItem("accessToken"):
      redirect("/main")
      break
    case getCookie("nickname"):
      redirect("/user/1/profile")
      break
    default :
      redirect("/start")
      break
  }
}