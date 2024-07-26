import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Button,
} from "@nextui-org/react";

export default function FirstResult() {
  // texts 정보는 받아와야함 지금은 더미데이터
  const texts = [
    {
      id:1,
      text: "마 니 국밥 무봤나",
      progress: { pronunciation: 60, intonation: 50 },
    },
    { id:2,text: "마 니 자신있나", progress: { pronunciation: 90, intonation: 80 } },
    { id:3,text: "맛이 깔끼하네", progress: { pronunciation: 70, intonation: 65 } },
    {
      id:4,
      text: "블루베리 스무디",
      progress: { pronunciation: 80, intonation: 75 },
    },
    {
      id:5,
      text: "이거 어디까지 올라가는 거에요?",
      progress: { pronunciation: 0, intonation: 0 },
    },
  ];
  return (
    <div className="flex bg-white rounded-lg shadow-lg w-full max-w-4xl">
      <div className="flex flex-col w-3/4 p-4">
        {texts.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            <div>
              <h1
                className={`text-xl font-bold ${index === 0 ? "text-black" : "text-gray-500"}`}
              >
                {item.text}
              </h1>
              <h2 className="text-gray-400">{item.text}</h2>
            </div>
            <Popover placement="right">
              <PopoverTrigger>
                <Button className="bg-gray-200 text-black">
                  +
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-24 h-24">
                <h1>Chart img</h1>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-1/4 p-4 bg-gray-50 rounded-r-lg">
        <div className="flex justify-between w-full mb-2">
          <h2 className="text-lg font-bold w-1/2 text-center">발음</h2>
          <h2 className="text-lg font-bold w-1/2 text-center">억양</h2>
        </div>
        {texts.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center w-full mb-4"
          >
            <div className="w-1/2 pr-2">
              <Progress
                value={item.progress.pronunciation}
                max={100}
                color="warning"
                status="primary"
                striped
                animated
              />
              <div className="text-center text-lg font-bold text-orange-500 mt-2">
                {item.progress.pronunciation}%
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <Progress
                value={item.progress.intonation}
                max={100}
                color="warning"
                status="primary"
                striped
                animated
              />
              <div className="text-center text-lg font-bold text-orange-500 mt-2">
                {item.progress.intonation}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
