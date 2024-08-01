export type TError = {
  code: String;
  message: String;
  response: {
    status: Number;
    statusText: String;
  };
};
