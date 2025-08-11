export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IUser extends ILoginDTO {
  _id: string;
}
