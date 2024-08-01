import { redirect } from "next/navigation";

export default function RedirectPage() {
  // 지역 선택 페이지에서 지역 id 를 넘겨 받고 바로 url로 연결시키면 됨
  // 단순 URL 입력을 통한 연결은 첫번째 지역의 첫번째 주제로 연결되도록 할것

  redirect(`/lesson/1/1`);
  // redirect(`lesson/${id}/hobby`)
}
