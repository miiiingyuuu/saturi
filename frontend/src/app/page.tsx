import { redirect } from "next/navigation";

export default function App() {
  if ("로그인이 되어 있으면") {
    redirect("/main");
  } else {
    redirect("/start");
  }
}