// auth-util
import * as React from "react";

export interface HandleLoginProps {
  email: string;
  password: string;
  router: any;
  goTo: string;
}

export interface PasswordConfirmProps {
  email: string;
  password: string;
}

// util
export interface PasswordProps {
  password: string;
  passwordConf: string;
}

// component
export interface CustomAccordionItemProps {
  primaryText: string;
  items: string[];
  icon: React.ReactElement;
  paths: string[];
  basePath: string;
}

//admin-utils
export interface ILocationProps {
  locationId: number
  name: string
}

export interface ILessonCategoryProps {
  lessonCategoryId: number
  name: string
}


export interface LessonGroup {
  lessonGroupId: string;
  locationName: string;
  lessonCategoryName: string;
  name: string;
  lessons: object;
}

export interface LessonProps {
  lessonId: number;
  lessonGroupId: number;
  lessonGroupName: string;
  sampleVoicePath: string;
  script: string;
  lastUpdateDt: string;
}

// game
export interface QuizProps {
  quizId: number
  locationId: number
  question: string
  creationDt: string
  isObjective: boolean
}

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