"use client"

import { redirect } from "next/navigation";

export default function App() {
  if (sessionStorage.getItem("accessToken")) {
    redirect("/main");
  } else {
    redirect("/start");
  }
}
