"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SideNavbar from "../../../../../components/lesson/sidebar";
import Puzzle from "../../../../../components/lesson/puzzle";
import PuzzleInfo from "../../../../../components/lesson/puzzleInfo";

export default function CategorySelectPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [locationId, setLocationId] = useState<number | null>(0);
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const selectedLocation = parseInt(
      pathSegments[pathSegments.length - 2],
      10,
    );

    if (selectedLocation !== 1 && selectedLocation !== 2) {
      router.push("/lesson/1/daily");
    } else {
      setLocationId(selectedLocation);
    }
  }, [pathname, router]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="flex w-full max-w-screen-lg h-5/6 items-center ">
        <div className="w-1/5 bg-gray-100 p-4">
          <SideNavbar location={locationId} />
        </div>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          {locationId && (
            <Puzzle id={locationId} onSelect={setSelectedPuzzle} />
          )}
        </div>
        <div className="w-1/5 p-4 flex items-center">
          {selectedPuzzle !== null && (
            <PuzzleInfo locationId={locationId} id={selectedPuzzle} />
          )}
        </div>
      </div>
    </div>
  );
}
