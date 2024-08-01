import axios from "axios";
import api from "@/lib/axios";
import { FormEvent } from "react";

export function createInfo(event: FormEvent) {
  event.preventDefault();
  const formData = new FormData();
  axios
    .post("admin/lesson", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(response => {
      console.log(response);
    });
}

export function handleAdminLogin(value: string, router: any) {
  if (value === process.env.NEXT_PUBLIC_ADMIN_PASS) {
    sessionStorage.setItem("adminToken", "good");
    router.push("/admin");
  } else {
    alert("비밀번호를 확인해주세요.");
  }
}

export function getInfo() {
  api.get("admin/lesson/lesson-group").then(response => {
    console.log(response);
  });
}
