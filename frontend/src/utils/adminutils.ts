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
    if (process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    sessionStorage.setItem("adminToken", process.env.NEXT_PUBLIC_ADMIN_TOKEN);
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTURL}/admin`;
    }
  } else {
    alert("비밀번호를 확인해주세요.");
  }
}
// 세개 다 어떻게 사용할 지 솔직히 잘 모르겠음.
export async function getLocation() {
  return api.get("/location")
    .then(response => response.data)
}

export async function getLessonGroup() {
  return api.get("/admin/lesson/lesson-group")
    .then(response => response.data)
}

export async function getLessonCategory() {
  return api.get("/learn/lesson-category")
    .then(response => response.data)
}
