import { Repository } from 'typeorm';
import { youtube } from '@googleapis/youtube';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { Video } from './entities/video.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async create(videoId: string, userId: number): Promise<Video> {
    const throwInvalidVideoIdError = () => {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            videoUrl: 'invalidVideoId',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    };

    try {
      const videos = await youtube({
        auth: this.configService.getOrThrow('google.apiKey', {
          infer: true,
        }),
        version: 'v3',
      }).videos.list({
        id: [videoId],
        part: ['snippet'],
      });
      this.logger.debug(videos.data);
      if (videos.data.items?.length === 0) {
        throwInvalidVideoIdError();
      }
    } catch (err) {
      this.logger.error(err);
      throwInvalidVideoIdError();
    }

    return this.videosRepository.save(
      this.videosRepository.create({ videoId, shareBy: { id: userId } }),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Video[]> {
    return this.videosRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }
}
