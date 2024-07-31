"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RedirectPage() {
  const currentPath = usePathname();
  const router = useRouter();
  const paths = currentPath.split("/");
  const check = parseInt(paths[paths.length - 1], 10);

  // 지역 id에 맞는 URL 로 들어오면 바로 hobby 카테고리로 이동
  // 지역 id에 맞지 않는 URL 로 들어오면 지역id = 1 인 hobby 카테고리로 이동 (비정상적인 접근)
  useEffect(() => {
    const locations = [2,3];
    // 2->표준어, 3->경상도
    if (locations.includes(check)) {
      router.push(`${currentPath}/daily`);
    } else {
      router.push("/lesson/2/daily");
    }
  }, [currentPath]);

  return null;
}
