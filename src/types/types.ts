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
