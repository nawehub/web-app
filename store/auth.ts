import {GenderEnum} from "@/store/enums";
import {Role} from "@/types/api-types";

export type UserInfo = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  gender: string
  status: string
  roles: Role[]
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  gender: GenderEnum
  username: string
}

export type RegisterResponse = {
  message: string;
  user: UserInfo;
}

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}