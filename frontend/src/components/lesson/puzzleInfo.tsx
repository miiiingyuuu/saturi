import { useEffect, useState } from "react";

interface PuzzleInfoProps {
  locationId: number | null;
  id: number;
  avgAccuracy: number;
}

export default function PuzzleInfo({ locationId, id, avgAccuracy }: PuzzleInfoProps) {
  const locations = ["","경상도 사투리", "표준어"];
  const [location, setLocation] = useState("표준어");

  useEffect(() => {
    console.log(locationId);
    if (
      locationId !== null &&
      locationId >= 0 &&
      locationId < locations.length
    ) {
      setLocation(locations[locationId - 1]);
    }
  }, [locationId]);

  return (
    <div className="bg-white p-12 rounded shadow">
      <h1 className="text-xl font-bold whitespace-nowrap">
        {location} 퍼즐 조각
      </h1>
      <p className="whitespace-nowrap">{id}번 퍼즐 조각에 대한 정보</p>
      <p className="whitespace-nowrap">평균 정확도 :  {avgAccuracy}%</p>
      {/* 추가적인 퍼즐 조각 정보를 여기에 추가 */}
    </div>
  );
}
