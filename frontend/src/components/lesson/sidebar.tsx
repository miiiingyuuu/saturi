import Image from "next/image";
import Link from "next/link";

interface SideNavbarProps {
  location: number | null;
}
// default 1, 경상도 2, 경기도 3
export default function SideNavbar({ location }: SideNavbarProps) {
  const categories = [
    [],
    [{ id: 1, name: "일상", tag: "Daily" },
      { id: 2, name: "드라마", tag: "Drama" },
      { id: 3, name: "영화", tag: "Movie" },
      { id: 4, name: "밈", tag: "Meme" }],
    [
      { id: 1, name: "일상", tag: "Daily" },
      { id: 2, name: "드라마", tag: "Drama" },
      { id: 3, name: "영화", tag: "Movie" },
      { id: 4, name: "밈", tag: "Meme" },
    ],
    [
      { id: 1, name: "일상", tag: "Daily" },
      { id: 2, name: "드라마", tag: "Drama" },
      { id: 3, name: "영화", tag: "Movie" },
      { id: 5, name: "뉴스", tag: "News" },
    ],
  ];

  const selectedCategories =
    location !== null && location > 0 && location < categories.length
      ? categories[location]
      : categories[2];

  return (
    <div className="flex flex-col items-center">
      <ol className="grid grid-cols-1 gap-4 m-0 p-0">
      {selectedCategories.map((category) => ( 
        <ul key={category.id} className="p-0">
        <Link href={`/lesson/${location}/${category.id}`}>
          <li className="flex justify-center">
            <Image
              src={`/MainPage/learnButton${category.id}.png`}
              alt=""
              width={100}
              height={100}
            />
          </li>
        </Link>
        </ul>
        ))}


        
      </ol>
    </div>
  );
}
