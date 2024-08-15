import Image from "next/image";
import Link from "next/link";
import { Box, Card, ToggleButton, Typography } from "@mui/material";
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





    <Card
      className="leftpartofjigsaw"
      sx={{
        display:"flex", 
        flexDirection: "column", 
        alignItems:"center", 
        width:"10vw",
        height:"50vh",
        minWidth:"300px",           
        minHeight:"500px",
        padding:"20px",
        border:"6px solid #4b2921",
        borderRadius: "30px",
    }}>
      <Typography 
        sx={{ 
          fontSize: { xs:25, sm:28, md:32}, 
          fontWeight: "bold",
          height:"20%",
        }}>학습 
      </Typography>
      
      <ol
        style={{
          height:"80%",
          display:"flex",
          flexDirection:"column",
          justifyContent:"space-between",
          paddingBottom:"30px",
          paddingTop:"30px",
      }}>
        {selectedCategories.map((category) => (
          <ul key={category.id}>
            <Link href={`/lesson/${location}/${category.id}`}>
              <li className="flex justify-center">                
                <ToggleButton
                  value={category.id}
                  sx={{
                    height: "70px",
                    borderRadius:"35px",
                    padding: 0,
                    border: category.id === categoryId ? '5px solid #84d8ff' : '5px solid transparent', // 테두리 색상 조건부 적용
                  }}
                >
                  <img
                    src={`/MainPage/learnButtonLong${category.id}.png`}
                    alt="Learn Button"
                    style={{
                      height: "65px",
                    }}
                  />
                </ToggleButton>
              </li>
            </Link>
          </ul>
        ))}
      </ol>      
    </Card>
  );
}
