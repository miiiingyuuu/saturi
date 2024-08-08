"use client"

import { useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation"
import { Backdrop, CircularProgress } from "@mui/material";

export default function App() {
  const router = useRouter()

  useEffect(() => {
    api.post("/game/room/in", {
      locationId: 2
    })
      .then(response => {
        router.push(`game/in-queue/${response.data.roomId}`);
      })
  }, []);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}