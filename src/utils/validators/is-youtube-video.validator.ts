import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsYoutubeVideo', async: false })
export class IsYoutubeVideo implements ValidatorConstraintInterface {
  validate(value: string) {
    return !!value && value.startsWith('https://www.youtube.com/watch?v=');
  }
}
