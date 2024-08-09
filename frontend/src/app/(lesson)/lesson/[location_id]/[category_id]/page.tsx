"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Card, Container, Typography, ToggleButton } from "@mui/material";
import api from "@/lib/axios";
import SideNavbar from "../../../../../components/lesson/sidebar";
import Puzzle from "../../../../../components/lesson/puzzle";
import PuzzleInfo from "../../../../../components/lesson/puzzleInfo";

export default function CategorySelectPage() {
  interface Lesson {
    lessonId: number;
    sampleVoicePath: string;
    sampleVoiceName: string; // Updated field name
    script: string;
    lastUpdateDt: string;
    isDeleted: boolean;
  }

  interface LessonGroup {
    lessonGroupId: number;
    locationName: string;
    lessonCategoryName: string;
    name: string;
    lessons: Lesson[];
  }

  const pathname = usePathname();
  const router = useRouter();
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string>("not yet");
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<number | null>(null);
  const [selectedPuzzleAccuracy, setSelectedPuzzleAccuracy] = useState<
    number | null
  >(null);
  const [categoryProgress, setCategoryProgress] = useState<number>(0);
  const [lessonGroup, setLessonGroup] = useState<LessonGroup[]>([]);
  const dummyProgressdata = [
    {
      lessonGroupId: 1,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 2,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 3,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 4,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 5,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 6,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 7,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 8,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
    {
      lessonGroupId: 9,
      lessonGroupName: "미상",
      groupProgress: 0,
      avgAccuracy: 0,
    },
  ];
  const [progressData, setProgressData] = useState<
    {
      lessonGroupId: number;
      lessonGroupName: string;
      groupProgress: number;
      avgAccuracy: number;
    }[]
  >(dummyProgressdata);
  // 선택된 지역, 카테고리 할당
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/");
      const selectedLocation = parseInt(
        pathSegments[pathSegments.length - 2],
        10,
      );
      const selectedCategory = parseInt(
        pathSegments[pathSegments.length - 1],
        10,
      );

      if (
        ![1, 2, 3].includes(selectedLocation) ||
        Number.isNaN(selectedCategory)
      ) {
        router.push("/lesson/2/2");
      } else {
        setLocationId(selectedLocation);
        setCategoryId(selectedCategory);
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    if (locationId !== null && categoryId !== null) {
      // 카테고리별 진척도, 레슨그룹 당 opover 에 표시할 lessonGroupId, groupProgress, avgAcuuracy 가져오기
      console.log(locationId, categoryId);
      // 레슨 그룹들의 정보를 받아오기
      api
        .get(
          `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`,
        )
        .then(response => {
          if (response.status === 200) {
            setLessonGroup(response.data);
            console.log(response.data);
          }
        })
        .catch(err=>{
          console.log(err)
        });
        
      api
        .get(
          `learn/lesson-group/progress?locationId=${locationId}&categoryId=${categoryId}`,
        )
        .then(response => {
          if (response.status === 200) {
            if (response.data.length > 0) {
              setCategoryProgress(response.data.progress);
              if (response.data.lessonGroup !== null){
                setProgressData(response.data.lessonGroup);
              } 
              console.log(progressData);
              console.log(response);
            }
          }
        })
        .catch(error => {
          console.error("progress API 요청 중 오류 발생:", error);
          console.log(progressData);
          setCategoryProgress(0);
        });

    }
  }, [locationId, categoryId]);

  // 새로운 onSelect 함수 구현
  const handlePuzzleSelect = (pieceId: number, avgAccuracy: number) => {
    setSelectedPuzzleId(pieceId);
    setSelectedPuzzleAccuracy(avgAccuracy);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{
        height: "90vh",    
        minHeight: "700px",
        display:"flex",
        alignItems:"center",        
    }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "560px",
        }}
      >
        {/* 맨 왼쪽 */}
        <Card
          sx={{
            width: "25%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px groove",
            borderRadius: "8px",
          }}
        >
          {/* <h2>locationID = {locationId}</h2>
          <h2>CategoryName = {categoryName}</h2> */}
          <SideNavbar location={locationId} categoryId={categoryId} />
        </Card>

        {/* 중간 */}
        <Card
          sx={{
            width: "45%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px groove",
            borderRadius: "8px",
          }}
        >
          {locationId && (
            <Puzzle
              id={locationId}
              totalProgress={categoryProgress}
              onSelect={handlePuzzleSelect} // 새로운 onSelect 핸들러 사용
              lessonGroup={lessonGroup}
              progressData={progressData}
            />
          )}
        </Card>

        {/* 맨 오른쪽 */}
        <Card
          sx={{
            width: "25%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px groove",
            borderRadius: "8px",
          }}
        >
          {selectedPuzzleId == null && (
            <Typography> 퍼즐을 선택하세요. </Typography>
          )}

          <Box>
            {selectedPuzzleId !== null && selectedPuzzleAccuracy !== null && (
              <PuzzleInfo
                locationId={locationId}
                id={selectedPuzzleId}
                avgAccuracy={selectedPuzzleAccuracy} // avgAccuracy 전달
              />
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
