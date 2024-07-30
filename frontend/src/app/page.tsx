"use client"

import { redirect } from "next/navigation";

export default function App() {
  switch (true) {
    case sessionStorage.getItem("accessToken"):
      redirect("/main")
      break
    // case
  }
  if (sessionStorage.getItem("accessToken")) {
    redirect("/main");
  } else {
    redirect("/start");
  }
}
