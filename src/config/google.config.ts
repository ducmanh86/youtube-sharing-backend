import { registerAs } from '@nestjs/config';
import { GoogleConfig } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  GOOGLE_API_KEY: string;
}

export default registerAs<GoogleConfig>('google', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.GOOGLE_API_KEY,
    youtubeUrl:
      process.env.YOUTUBE_URL_WITHOUT_ID || 'https://www.youtube.com/watch?v=',
  };
});
