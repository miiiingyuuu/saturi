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