import { LinearProgress, Button, Box } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface LessonGroupResultProps {
  lessonGroupId: number;
  lessonGroupName: string;
  avgAccuracy: number;
  avgSimilarity: number;
  startDt: string;
  endDt: string | null;
  isCompleted: boolean;
}

export default function SecondResult(lessonGroupResult: LessonGroupResultProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [locationId, setLocationId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [currentLessonGroupId, setCurrentLessonGroupId] = useState<number>(
    lessonGroupResult.lessonGroupId
  );
  const [currentCategory, setCurrentCategory] = useState<LessonGroupResultProps[]>([]);

  // State to track if buttons should be disabled
  const [isPrevDisabled, setIsPrevDisabled] = useState<boolean>(true);
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);

  // Parse URL to get locationId and categoryId
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/");
      const selectedLocation = parseInt(
        pathSegments[pathSegments.length - 4],
        10
      );
      const selectedCategory = parseInt(
        pathSegments[pathSegments.length - 3],
        10
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

  // Fetch current category data
  useEffect(() => {
    if (locationId !== null && categoryId !== null && currentLessonGroupId !== undefined) {
      api
        .get(
          `learn/lesson-group?locationId=${locationId}&categoryId=${categoryId}`
        )
        .then((response) => {
          if (response.status === 200) {
            setCurrentCategory(response.data);
            console.log(locationId, categoryId, currentLessonGroupId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [locationId, categoryId, currentLessonGroupId]);

  // Check for previous and next lesson groups
  useEffect(() => {
    if (currentLessonGroupId !== null) {
      const hasPrev = currentCategory.some(
        (group) => group.lessonGroupId === currentLessonGroupId - 1
      );
      const hasNext = currentCategory.some(
        (group) => group.lessonGroupId === currentLessonGroupId + 1
      );

      setIsPrevDisabled(!hasPrev);
      setIsNextDisabled(!hasNext);
    }
  }, [currentCategory, currentLessonGroupId]);

  // Event handlers for button clicks
  const handlePrevClick = () => {
    if (!isPrevDisabled && locationId !== null && categoryId !== null) {
      router.push(`/lesson/${locationId}/${categoryId}/${currentLessonGroupId - 1}`);
    }
  };

  const handleNextClick = () => {
    if (!isNextDisabled && locationId !== null && categoryId !== null) {
      router.push(`/lesson/${locationId}/${categoryId}/${currentLessonGroupId + 1}`);
    }
  };

  const handleHome = () => {
    router.push("/main")
  }

  const handleAgain = () => {
    if (locationId !== null && categoryId !== null) {
      console.log()
      router.push(`/lesson/${locationId}/${categoryId}/${currentLessonGroupId}`);
    }
  };

  return (
    <Box className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6">
      <Box className="flex items-center m-5">
        <Image
          src="/images/Alopias.jpg"
          alt="티어 이미지"
          width={80}
          height={80}
          className="object-contain rounded-full"
        />
        <Box className="px-4 flex-grow">
          <LinearProgress
            variant="determinate"
            value={60}
            color="warning"
            className="w-full"
          />
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
        <Button variant="contained" color="success" className="mx-2" onClick={handleAgain}>
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
        <Button variant="contained" color="success" className="w-full" onClick={handleHome}>
          Home
        </Button>
      </Box>
    </Box>
  );
}
