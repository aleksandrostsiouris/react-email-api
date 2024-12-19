import * as dotenv from "dotenv"

export type Config = {
  readonly SENDGRID_APIKEY: string;
  readonly API_TOKEN: string;
  readonly PORT: string;
}

export const config = dotenv.config().parsed as Config;
