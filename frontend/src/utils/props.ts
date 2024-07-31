// auth-util
import * as React from "react";

export interface HandleLoginProps {
  email: string
  password: string
  router: any
  goTo: string
}

// util
export interface PasswordProps {
  password: string
  passwordConf: string
}


// component
export interface CustomAccordionItemProps {
  primaryText: string;
  items: string[];
  icon: React.ReactElement;
  paths: string[];
  basePath: string;
}