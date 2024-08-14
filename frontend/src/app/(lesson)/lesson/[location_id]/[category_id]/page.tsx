"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Card, Container, Typography } from "@mui/material";
import api from "@/lib/axios";
import SideNavbar from "../../../../../components/lesson/sidebar";
import Puzzle from "../../../../../components/lesson/puzzle";
import PuzzleInfo from "../../../../../components/lesson/puzzleInfo";
import Chatbot from "@/components/chatbot/chatbot";
import "@/styles/home/main/mainPage.css";

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
  const [selectedPuzzleAccuracy, setSelectedPuzzleAccuracy] = useState<number | null>(null);
  const [selectedLessonGroup, setSelectedLessonGroup] = useState<LessonGroup | null>(null);
  const [categoryProgress, setCategoryProgress] = useState<number>(0);
  const [lessonGroup, setLessonGroup] = useState<LessonGroup[]>([]);

  const dummyProgressdata = Array.from({ length: 9 }, (_, i) => ({
    lessonGroupId: i + 1,
    lessonGroupName: "미상",
    groupProgress: 0,
    avgAccuracy: 0,
  }));

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
      const selectedLocation = parseInt(pathSegments[pathSegments.length - 2], 10);
      const selectedCategory = parseInt(pathSegments[pathSegments.length - 1], 10);

      if (![1, 2, 3].includes(selectedLocation) || Number.isNaN(selectedCategory)) {
        router.push("/lesson/2/2");
      } else {
        setLocationId(selectedLocation);
        setCategoryId(selectedCategory);
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (locationId !== null && categoryId !== null) {
          // 레슨 그룹들의 정보를 받아오기
          const lessonGroupResponse = await api.get(
            `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`
          );
          if (lessonGroupResponse.status === 200) {
            setLessonGroup(lessonGroupResponse.data);
            console.log("Lesson Group Data:", lessonGroupResponse.data);
          }

          // Progress API 요청
          const progressResponse = await api.get(
            `learn/lesson-group/progress?locationId=${locationId}&categoryId=${categoryId}`
          );
          if (progressResponse.status === 200) {
            console.log("Progress API Response:", progressResponse.data);

            if (Array.isArray(progressResponse.data) && progressResponse.data.length > 0) {
              setCategoryProgress(progressResponse.data[0].progress);
              if (progressResponse.data[0].lessonGroup !== null) {
                setProgressData(progressResponse.data[0].lessonGroup);
              }
            } else if (progressResponse.data && typeof progressResponse.data === 'object') {
              setCategoryProgress(progressResponse.data.progress || 0);
              if (progressResponse.data.lessonGroup !== null) {
                setProgressData(progressResponse.data.lessonGroup);
              }
            } else {
              setCategoryProgress(0);
            }
          }
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        setCategoryProgress(0);
      }
    };

    fetchData();
  }, [locationId, categoryId]);

  // 새로운 onSelect 함수 구현
  const handlePuzzleSelect = (pieceId: number, avgAccuracy: number) => {
    setSelectedPuzzleId(pieceId);
    setSelectedPuzzleAccuracy(avgAccuracy);

    // Find the selected lesson group by ID
    const selectedGroup = lessonGroup.find(group => group.lessonGroupId === pieceId);
    if (selectedGroup) {
      setSelectedLessonGroup(selectedGroup);
    }
  };

  return (
    <Box 
      className="bg-gray-100"
      sx={{
        width:"100%"
      }}
    >
      <Container       
        maxWidth="lg" 
        sx={{
          height: "90vh",    
          minHeight: "700px",
          display:"flex",
          alignItems:"center",        
      }}>

        {/* 맨 왼쪽 */}
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
            border:"6px solid #4b2921",
            borderRadius: "30px",
          }}
        >
          <SideNavbar location={locationId} categoryId={categoryId} />
        </Card>

        {/* 중간 */}
        <Card
          className="middlepartofjigsaw"
          sx={{
            width: "30%",
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border:"6px solid #4b2921",
            borderRadius: "30px",
          }}
        >
          {locationId && (
            <Puzzle
              id={locationId}
              totalProgress={categoryProgress}
              onSelect={handlePuzzleSelect}
              lessonGroup={lessonGroup}
              progressData={progressData}
            />
          )}
        </Card>

        {/* 맨 오른쪽 */}
        <Card
          className="rightpartofjigsaw"
          sx={{

            display:"flex", 
            flexDirection: "column", 
            alignItems:"center", 
            width:"10vw",
            height:"50vh",
            minWidth:"300px",           
            minHeight:"500px",
            border:"6px solid #4b2921",
            borderRadius: "30px",
            overflowY: "auto", // Allow scrolling if content overflows
            padding: "10px", // Ensure there is padding inside the card
            marginRight:"25px",
          }}
        >
          {selectedPuzzleId == null && (
            <Typography> 퍼즐을 선택하세요. </Typography>
          )}

          {selectedLessonGroup && (
            <PuzzleInfo
              locationId={locationId}
              lessonGroup={selectedLessonGroup}
              avgAccuracy={selectedPuzzleAccuracy ?? 0} // Ensure avgAccuracy is a number
            />
          )}
        </Card>
      </Box>
      <Box>
        <Chatbot />
      </Box>
    </Box>
  );
}
