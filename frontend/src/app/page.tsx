"use client";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const nickname = getCookie("nickname");

    if (accessToken && nickname) {
      router.push("/main");
    } else if (accessToken && !nickname) {
      router.push("/user/profile");
    } else {
      router.push("/start");
    }
  }, [router]);
  
  return null;
};
