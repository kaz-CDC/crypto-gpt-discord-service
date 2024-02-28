export interface CryptoGptResponse {
  message: string;
}

export interface LastRequestTimes {
  [userId: string]: number;
}
