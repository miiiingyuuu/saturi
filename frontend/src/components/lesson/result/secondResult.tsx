"use client";

import { LinearProgress, Button, Box, Typography } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import "../../../styles/home/main/mainPage.css";
import CountUp from "react-countup";

interface LessonGroupResultProps {
  lessonGroupId: number;
  lessonGroupName: string;
  avgAccuracy: number;
  avgSimilarity: number;
  startDt: string;
  endDt: string | null;
  isCompleted: boolean;
  lessons?: {
    // Assuming this is the shape of lessons
    lessonId: number;
    lessonName: string;
  }[];
}

interface UserInfo {
  currentExp: number;
  earnExp: number;
  resultExp: number;
}

interface SecondResultProps {
  lessonGroupResult: LessonGroupResultProps;
  userInfo: UserInfo;
  currentStep: number;
  beforestep: any;
}

export default function SecondResult({
  lessonGroupResult,
  userInfo,
  currentStep,
  beforestep,
}: SecondResultProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [currentLessonGroupId, setCurrentLessonGroupId] = useState<number>(
    lessonGroupResult.lessonGroupId,
  );
  const [currentCategory, setCurrentCategory] = useState<
    LessonGroupResultProps[]
  >([]);
  const [progress, setProgress] = useState<number>(0);
  const [isPrevDisabled, setIsPrevDisabled] = useState<boolean>(true);
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);

  // 이미지 경로가 public 폴더 아래에 있어야 함
  const tierImages = {
    stone: "/tier/stone1.gif",
    bronze: "/tier/bronze1.gif",
    silver: "/tier/silver1.gif",
    gold: "/tier/gold1.gif",
    sapphire: "/tier/sapphire1.gif",
    platinum: "/tier/platinum1.gif",
    diamond: "/tier/diamond1.gif",
  };

  type TierKey = keyof typeof tierImages;

  const getTierFromExp = (exp: number): TierKey => {
    if (exp === 0) return "stone";
    if (exp < 100) return "bronze";
    if (exp < 500) return "silver";
    if (exp < 1500) return "gold";
    if (exp < 3000) return "platinum";
    if (exp < 5000) return "sapphire";
    return "diamond";
  };

  const tierKey = getTierFromExp(userInfo.resultExp);
  const imageSrc = tierImages[tierKey];

  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/");
      const selectedLocation = parseInt(
        pathSegments[pathSegments.length - 4],
        10,
      );
      const selectedCategory = parseInt(
        pathSegments[pathSegments.length - 3],
        10,
      );
      if (
        ![1, 2, 3].includes(selectedLocation) ||
        Number.isNaN(selectedCategory)
      ) {
        router.push("/lesson/2/1");
      } else {
        setLocationId(selectedLocation);
        setCategoryId(selectedCategory);
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    if (
      locationId !== null &&
      categoryId !== null &&
      currentLessonGroupId !== undefined
    ) {
      api
        .get(
          `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`,
        )
        .then(response => {
          if (response.status === 200) {
            setCurrentCategory(response.data);
            console.log(locationId, categoryId, currentLessonGroupId);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [locationId, categoryId, currentLessonGroupId]);

  useEffect(() => {
    if (currentLessonGroupId !== null) {
      // Check if there is a previous lesson group
      const hasPrev = currentCategory.some(
        group => group.lessonGroupId === currentLessonGroupId - 1,
      );

      // Check if there is a next lesson group with lessons
      const hasNext = currentCategory.some(group => {
        return (
          group.lessonGroupId === currentLessonGroupId + 1 &&
          group.lessons &&
          group.lessons.length > 0
        );
      });

      setIsPrevDisabled(!hasPrev);
      setIsNextDisabled(!hasNext);
    }
  }, [currentCategory, currentLessonGroupId]);

  // Animate progress from 0 to earnExp
  useEffect(() => {
    setProgress(0); // Reset progress on remount

    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= userInfo.earnExp) {
          clearInterval(timer);
          return userInfo.earnExp;
        }
        return Math.min(oldProgress + 1, userInfo.earnExp);
      });
    }, 20); // Adjust the speed of the animation

    return () => {
      clearInterval(timer);
    };
  }, [userInfo.earnExp]); // Dependency on earnExp to reset on changes

  const handlePrevClick = () => {
    if (!isPrevDisabled && locationId !== null && categoryId !== null) {
      router.push(
        `/lesson/${locationId}/${categoryId}/${currentLessonGroupId - 1}`,
      );
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled && locationId !== null && categoryId !== null) {
      router.push(
        `/lesson/${locationId}/${categoryId}/${currentLessonGroupId + 1}`,
      );
    }
  };

  const handleHome = () => {
    router.push(`/lesson/${locationId}/${categoryId}`);
  };

  const handleAgain = () => {
    if (locationId !== null && categoryId !== null) {
      console.log();
      router.push(
        `/lesson/${locationId}/${categoryId}/${currentLessonGroupId}`,
      );
    }
  };

  return (
    <Box
      className="tmp2"
      style={{
        width: "100%",
        left: (() => {
          if (currentStep === 1) {
            return "150%";
          }
          if (currentStep === 2) {
            return "50%";
          }
          return "0%";
        })(),
      }}
    >
      <Box
        className="bg-white w-full max-w-4xl mx-auto p-6"
        sx={{
          border: "6px solid #4b2921",
          borderRadius: "30px",
        }}
      >
        <Box className="flex items-center m-5">
          <Image
            src={imageSrc}
            alt="티어 이미지"
            width={80}
            height={80}
            className="object-contain rounded-full"
          />
          <Box className="px-4 flex-grow">
            <LinearProgress
              variant="determinate"
              value={progress}
              color="primary"
              className="w-full"
            />
          </Box>
          <Box className="flex flex-col items-center justify-center text-center">
            <Typography variant="h6" className="text-center">
              + {userInfo.earnExp} exp
            </Typography>
            <Typography variant="subtitle2" className="text-center">
              <CountUp start={userInfo.currentExp} end={userInfo.resultExp} duration={6} />
            </Typography>
          </Box>
        </Box>
        <Box className="flex justify-center mx-24 py-4">
          <Button
            variant="contained"
            color="success"
            className="mx-2"
            onClick={handlePrevClick}
            disabled={isPrevDisabled}
          >
            이전 조각
          </Button>
          <Button
            variant="contained"
            color="success"
            className="mx-2"
            onClick={handleAgain}
          >
            다시하기
          </Button>
          <Button
            variant="contained"
            color="success"
            className="mx-2"
            onClick={handleNextClick}
            disabled={isNextDisabled}
          >
            다음 조각
          </Button>
        </Box>
        <Box className="flex justify-center mx-24 py-4">
          <Button
            variant="contained"
            color="success"
            className="w-full"
            onClick={handleHome}
          >
            Home
          </Button>
        </Box>
      </Box>
      <Box className="flex justify-center mx-24 py-2">
        <Button
          className="mt-4 text-white px-8 py-4 rounded"
          variant="contained"
          sx={{
            backgroundColor: "success.light",
            "&:hover": { backgroundColor: "green" },
            "&:active": { backgroundColor: "green" },
            "&:focus": { backgroundColor: "success" },
          }}
          onClick={beforestep}
        >
          이전
        </Button>
      </Box>
    </Box>
  );
}
