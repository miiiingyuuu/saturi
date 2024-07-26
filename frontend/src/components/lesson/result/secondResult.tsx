import { Progress, Button } from "@nextui-org/react";
import Image from "next/image";

export default function FirstResult() {
  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center m-5">
        <Image
          src="/images/Alopias.jpg"
          alt="티어 이미지"
          width={80}
          height={80}
          className="object-contain rounded-full"
        />
        <Progress
          value={60}
          max={100}
          color="warning"
          status="primary"
          striped
          animated
          className="px-4 flex-grow"
        />
      </div>
      <div className="flex justify-center mx-24 py-4">
        <Button className="bg-green-500 text-white px-8 py-4 rounded-lg mx-2">
          이전 조각
        </Button>
        <Button className="bg-green-500 text-white px-8 py-4 rounded-lg mx-2">
          다시하기
        </Button>
        <Button className="bg-green-500 text-white px-8 py-4 rounded-lg mx-2">
          다음 조각
        </Button>
      </div>
      <div className="flex justify-center mx-24 py-4">
        <Button className="w-full bg-green-500 text-white px-8 py-4 rounded-lg">
          Home
        </Button>
      </div>
    </div>
  );
}
