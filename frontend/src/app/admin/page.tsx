"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation"

export default function App() {
  const router = useRouter()
  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      router.push("/admin/auth")
    }
  },[])

  return (
    <Box>
      여기에 기본 통계 넣으면 될 것 같아요
    </Box>
  );
}
