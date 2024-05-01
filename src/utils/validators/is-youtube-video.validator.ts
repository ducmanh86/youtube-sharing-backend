import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';

@Injectable()
@ValidatorConstraint({ name: 'IsYoutubeVideo', async: true })
export class IsYoutubeVideo implements ValidatorConstraintInterface {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  validate(value: string) {
    return (
      !!value &&
      value.startsWith(
        this.configService.getOrThrow('google.youtubeUrl', {
          infer: true,
        }),
      )
    );
  }
}
