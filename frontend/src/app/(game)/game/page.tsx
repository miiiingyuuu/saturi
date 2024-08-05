"use client"

import { useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation"

export default function App() {
  const router = useRouter()

  useEffect(() => {
    api.post("/game/room/in", {
      locationId: 1
    })
      .then(response => {
        router.push(`game/in-queue/${response.data.roomId}`);
      })
  }, []);
  return (
    <div>
      ㄱㄷ
    </div>
  )
}