import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Request,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  PageDTO,
  LimitDTO,
  infinityPagination,
} from 'src/utils/infinity-pagination';
import { Video } from './entities/video.entity';
import { VideosService } from './videos.service';
import { ShareVideoDto } from './dto/share-video.dto';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';

@ApiTags('Videos')
@Controller({
  path: 'videos',
})
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Request() request: { user: any },
    @Body() shareVideoDto: ShareVideoDto,
  ): Promise<Video> {
    const videoUrl = new URL(shareVideoDto.videoUrl);
    const videoId = videoUrl.searchParams.get('v');
    if (!videoId) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            videoUrl: 'missingVideoId',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.videosService.create(videoId, request.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'listing video' })
  @ApiQuery({ name: 'page', type: PageDTO })
  @ApiQuery({ name: 'limit', type: LimitDTO })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<InfinityPaginationResultType<Video>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.videosService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }
}
