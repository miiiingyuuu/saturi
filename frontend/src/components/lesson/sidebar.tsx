import Link from "next/link";

interface SideNavbarProps {
  location: number | null;
}

export default function SideNavbar({ location }: SideNavbarProps) {
  const categories = [
    [
      { name: "일상", tag: "Daily" },
      { name: "드라마", tag: "Drama" },
      { name: "영화", tag: "Movie" },
      { name: "뉴스", tag: "News" },
    ],
    [
      { name: "일상", tag: "Daily" },
      { name: "드라마", tag: "Drama" },
      { name: "영화", tag: "Movie" },
      { name: "밈", tag: "Meme" },
    ],
  ];

  // location 값이 유효한 범위 내에 있는지 확인하고, 기본값을 설정합니다.
  const selectedCategories =
    location !== null && location > 0 && location < categories.length
      ? categories[location - 1]
      : categories[1];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sidebar</h1>
      <ol className="space-y-4">
        {selectedCategories.map((category, index) => (
          <li key={index}>
            <p className="flex items-center space-x-2 border border-gray-200 rounded-lg">
              <Link
                href={`/lesson/${location}/${category.tag}`}
                className="text-lg"
              >
                {category.name}
              </Link>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
