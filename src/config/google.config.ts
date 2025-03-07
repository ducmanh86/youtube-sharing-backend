import { registerAs } from '@nestjs/config';
import { GoogleConfig } from './config.type';
import { IsNotEmpty, IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  GOOGLE_API_KEY: string;
}

export default registerAs<GoogleConfig>('google', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.GOOGLE_API_KEY,
    youtubeUrl: process.env.YOUTUBE_URL_WITHOUT_ID || 'https://www.youtube.com/watch?v=',
  };
});
