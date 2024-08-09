"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      router.push("/main");
    } else {
      router.push("/start");
    }
  }, [router]);

  return null;
};
