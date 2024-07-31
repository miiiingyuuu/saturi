import Image from "next/image";

interface SideNavbarProps {
  location: number | null;
}

export default function SideNavbar({ location }: SideNavbarProps) {
  const categories = [
    [
      { id: 1, name: "일상", tag: "Daily" },
      { id: 2, name: "드라마", tag: "Drama" },
      { id: 3, name: "영화", tag: "Movie" },
      { id: 4, name: "뉴스", tag: "News" },
    ],
    [
      { id: 1, name: "일상", tag: "Daily" },
      { id: 2, name: "드라마", tag: "Drama" },
      { id: 3, name: "영화", tag: "Movie" },
      { id: 4, name: "밈", tag: "Meme" },
    ],
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Sidebar</h1>
      <ol className="grid grid-cols-1 gap-4 m-0 p-0">
        <li className="flex justify-center">
          <Image
            src="/MainPage/learnButton1.png"
            alt=""
            width={100}
            height={100}
          />
        </li>
        <li className="flex justify-center">
          <Image
            src="/MainPage/learnButton2.png"
            alt=""
            width={100}
            height={100}
          />
        </li>
        <li className="flex justify-center">
          <Image
            src="/MainPage/learnButton3.png"
            alt=""
            width={100}
            height={100}
          />
        </li>
        <li className="flex justify-center">
          <Image
            src="/MainPage/learnButton4.png"
            alt=""
            width={100}
            height={100}
          />
        </li>
      </ol>
    </div>
  );
}
