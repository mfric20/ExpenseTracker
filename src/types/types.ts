export type TError = {
  code: string;
  message: string;
  response: {
    status: Number;
    statusText: string;
  };
};

export type credentialsProfile = {
  email: string;
  password: string;
};

export type TUser =
  | {
      id: string;
      name: string | null;
      email: string | null;
      password: string | null;
      emailVerified: boolean | null;
      provider: string | null;
      picture: string | null;
      verificationCode: number | null;
    }
  | undefined;
