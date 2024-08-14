import Image from "next/image";
import Link from "next/link";
import { Box, ToggleButton, Typography } from "@mui/material";
import { useEffect } from "react";

interface SideNavbarProps {
  location: number | null;
  categoryId: number | null;
}
// default 1, 경상도 2, 경기도 3
export default function SideNavbar({ location, categoryId }: SideNavbarProps) {
  const categories = [
    [],
    [ { id: 1, name: "일상", tag: "Daily" },
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

  useEffect(() => {

    }, [categoryId])

  return (
    <Box className="flex flex-col items-center" 
      sx={{
        padding:"20px",
    }}>
      <Typography 
        sx={{ 
          fontSize: { xs:25, sm:28, md:32}, 
          fontWeight: "bold",
          height:"15%",
        }}>학습 
      </Typography>
      <ol className="grid grid-cols-1 gap-4 m-0 p-0">
        {selectedCategories.map((category) => (
          <ul key={category.id} className="p-0">
            <Link href={`/lesson/${location}/${category.id}`}>
              <li className="flex justify-center">                
                <ToggleButton
                  value={category.id}
                  sx={{
                    width: "85%",
                    height: "85%",
                    borderRadius:"9px",
                    padding: 0,
                    border: category.id === categoryId ? '3px solid #84d8ff' : 'none', // 테두리 색상 조건부 적용
                  }}
                >
                  <img
                    src={`/MainPage/learnButtonLong${category.id}.png`}
                    alt="Learn Button"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </ToggleButton>
              </li>
            </Link>
          </ul>
        ))}
      </ol>
    </Box>
  );
}
