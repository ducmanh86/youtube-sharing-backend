import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsYoutubeVideo } from '../../utils/validators/is-youtube-video.validator';

export class ShareVideoDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=AVL-Yeu6TuY',
  })
  @Validate(IsYoutubeVideo, { message: 'Not valid Youtube url!' })
  videoUrl: string;
}
