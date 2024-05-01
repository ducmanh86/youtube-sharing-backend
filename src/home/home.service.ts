import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class HomeService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  appInfo() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require('../../package.json');
    return {
      name: this.configService.get('app.name', { infer: true }),
      version: packageJson.version,
    };
  }
}
