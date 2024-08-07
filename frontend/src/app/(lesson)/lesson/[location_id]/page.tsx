"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RedirectPage() {
  const pathname = usePathname()
  const router = useRouter();

  // 지역 id에 맞는 URL 로 들어오면 바로 카테고리 1 로 이동
  // 지역 id에 맞지 않는 URL 로 들어오면 loactionId =1 , categoryId = 1 카테고리로 이동 (비정상적인 접근)
  useEffect(() => {
    if (pathname) {
    const paths = pathname.split("/");
    const check = parseInt(paths[paths.length - 1], 10);
    const locations = [1, 2, 3];
    // 2->경상도, 3->경기도
    if (locations.includes(check)) {
      router.push(`${pathname}/1`);
    } else {
      router.push("/lesson/2/1");
    }
    }

  }, [pathname, router]);

  return null;
}
