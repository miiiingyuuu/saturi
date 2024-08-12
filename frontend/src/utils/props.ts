// auth-util
import * as React from "react";

export interface PasswordChangeProps {
  currentPassword: string;
  newPassword: string;
}

export interface HandleLoginProps {
  email: string;
  password: string;
  router: any;
  goTo: string;
}

// util
export interface PasswordProps {
  password: string;
  passwordConf: string;
}

// admin-utils

export interface QuizIdProps {
  params: {quizId: number}
}

export interface ILocationProps {
  locationId: number
  name: string
}

export interface ILessonCategoryProps {
  lessonCategoryId: number
  name: string
}

export interface LessonGroup {
  lessonGroupId: number;
  locationName: string;
  lessonCategoryName: string;
  name: string;
  lessons: object;
}

export interface LessonProps {
  lessonId?: number;
  lessonGroupId: number;
  lessonGroupName: string;
  sampleVoicePath: string;
  sampleVoiceName: string;
  sampleVoicePitchX: string | null;
  sampleVoicePitchY: string;
  script: string;
  lastUpdateDt: string
}

// game
export interface TipsProps {
  tipId: number
  content: string
}

export interface RoomIdProps {
  params: {roomId: string}
}

export interface MessagesProps {
  timestamp: string
  nickname: string
  message: string
  chatLogId: number
}

export interface GameQuizChoiceProps {
  choiceId: number;
  choiceText: string;
  isCorrect: boolean;
}

export interface GameQuizProps<T> {
  quizId: number;
  question: string;
  isObjective: boolean;
  quizChoiceList: T[];
}

export interface ParticipantsProps {
  isExited: boolean;
  nickName: string
  birdId: number
  latestMessage?: string
}
// MainPart

export interface LeftPartProps {
  middlePosition: number;
  moveDirection: string;
  selectedRegion: string;
}

export interface MiddlePartProps {
  middlePosition: number;
  mainPageIndicator: string;
  selectedRegion: string;
}

export interface RightPartProps {
  selectedRegion: string;
}

export interface ButtonPartProps {
  onLeftClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRightClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  middleToWhere: number;
  selectedRegion: string;
}

export interface MiddleMapProps {
  left: string;
  onRegionClick: (region: string) => void;
  selectedRegion: string;
  middleToWhere: number;
}
