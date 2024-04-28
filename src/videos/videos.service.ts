import { Repository } from 'typeorm';
import { youtube, youtube_v3 } from '@googleapis/youtube';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { Video } from './entities/video.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { AppGateway } from '../websocket/app.gateway';
import Schema$Video = youtube_v3.Schema$Video;

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private readonly appGateway: AppGateway,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async create(videoId: string, userId: number): Promise<any> {
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

    let videoRespone: any;
    try {
      this.logger.debug(videoId);
      videoRespone = await youtube({
        auth: this.configService.getOrThrow('google.apiKey', {
          infer: true,
        }),
        version: 'v3',
      }).videos.list({
        id: [videoId],
        part: ['snippet'],
      });
    } catch (err) {
      this.logger.error(err);
      throwInvalidVideoIdError();
    }

    const videoData: Schema$Video = videoRespone?.data.items.find(
      (item: Schema$Video) => item.id === videoId,
    );
    this.logger.debug(videoData);
    if (!videoData) {
      throwInvalidVideoIdError();
    }

    return this.videosRepository
      .save(
        this.videosRepository.create({ videoId, shareBy: { id: userId } }),
        { reload: true },
      )
      .then(async (v) => {
        const video = await this.videosRepository.findOne({
          where: { id: v.id },
        });

        const result = {
          ...video?.toJSON(),
          url:
            this.configService.getOrThrow('google.youtubeUrl', {
              infer: true,
            }) + videoId,
          title: videoData.snippet?.title,
          channel: videoData.snippet?.channelTitle,
          description: videoData.snippet?.description,
          thumbnail: videoData.snippet?.thumbnails?.standard?.url,
        };

        // notify the video data to clients
        this.appGateway.server.emit('video', { video: result });

        return result;
      });
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
