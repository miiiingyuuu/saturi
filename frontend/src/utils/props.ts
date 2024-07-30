// auth-util
export interface IHandleLogin {
  email: string
  password: string
  router: any
  goTo: string
}

// util
export interface IPasswordProps {
  password: string
  passwordConf: string
}