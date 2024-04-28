import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { SocketModule } from '@nestjs/websockets/socket-module';
import { AppGateway } from '../websocket/app.gateway';
import { IsYoutubeVideo } from '../utils/validators/is-youtube-video.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), ConfigModule, SocketModule],
  controllers: [VideosController],
  providers: [IsYoutubeVideo, VideosService, AppGateway],
  exports: [VideosService],
})
export class VideosModule {}
