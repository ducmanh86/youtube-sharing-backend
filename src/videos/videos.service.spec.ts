import { Test } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { ConfigService } from '@nestjs/config';
import { AppGateway } from '../websocket/app.gateway';
import * as Youtube from '../utils/youtube';

const videosResult: any[] = [
  {
    id: 8,
    createdAt: '2024-05-01T17:23:43.880Z',
    updatedAt: '2024-05-01T17:23:43.880Z',
    createdBy: null,
    updatedBy: null,
    videoId: '9JXHdwskAAs',
    shareBy: {
      id: 1,
      createdAt: '2024-04-29T00:16:13.273Z',
      updatedAt: '2024-04-29T00:16:13.273Z',
      createdBy: null,
      updatedBy: null,
      email: 'admin@gmail.com',
      firstName: 'Admin',
      lastName: 'Youtube',
      status: {
        id: 1,
        name: 'Active',
        __entity: 'Status',
      },
      __entity: 'User',
      fullName: 'Admin Youtube',
    },
    __entity: 'Video',
    url: 'https://www.youtube.com/watch?v=9JXHdwskAAs',
    title: 'GIẢI BILLIARDS SCOTTISH OPEN 2024',
    channel: 'WEB THE THAO',
    description: '🛑 TRỰC TIẾP | DƯƠNG QUỐC HOÀNG vs KO PING HAN | GIẢI BILLIARDS SCOTTISH OPEN 2024',
    thumbnail: 'https://i.ytimg.com/vi/9JXHdwskAAs/sddefault.jpg',
  },
  {
    id: 6,
    createdAt: '2024-04-30T09:03:04.407Z',
    updatedAt: '2024-04-30T09:03:04.407Z',
    createdBy: null,
    updatedBy: null,
    videoId: 'vIu-y8Ka9oY',
    shareBy: {
      id: 3,
      createdAt: '2024-04-30T09:02:50.492Z',
      updatedAt: '2024-04-30T09:02:50.492Z',
      createdBy: null,
      updatedBy: null,
      email: 'lyu65698@zslsz.com',
      firstName: 'A',
      lastName: 'A',
      status: {
        id: 2,
        name: 'Inactive',
        __entity: 'Status',
      },
      __entity: 'User',
      fullName: 'A A',
    },
    __entity: 'Video',
    url: 'https://www.youtube.com/watch?v=vIu-y8Ka9oY',
    title: 'Đợi Nụ Cười Em - Khoai - Official Music Video',
    channel: 'Khoai Lang Thang',
    description: 'Khoai chỉ "Đợi Nụ Cười Em" | Travel MV | Hà Giang Việt Nam',
    thumbnail: 'https://i.ytimg.com/vi/vIu-y8Ka9oY/sddefault.jpg',
  },
];
const youtubeResponse = {
  kind: 'youtube#video',
  etag: 'FulfXFiZZzsmMhhx1gKoXqlN7ps',
  id: 'TdEB_fXm8Jc',
  snippet: {
    publishedAt: '2024-04-21T11:30:07Z',
    channelId: 'UCXtlD2njsXWo2HoPfSC-rsQ',
    title: 'TRẬN ĐẤU NGHẸT THỞ ĐẾN PHÚT CUỐI CÙNG CỦA HOÀNG SAO',
    description: 'TRẬN ĐẤU NGHẸT THỞ ĐẾN PHÚT CUỐI CÙNG CỦA HOÀNG SAO',
    thumbnails: {
      default: {
        url: 'https://i.ytimg.com/vi/TdEB_fXm8Jc/default.jpg',
        width: 120,
        height: 90,
      },
      medium: {
        url: 'https://i.ytimg.com/vi/TdEB_fXm8Jc/mqdefault.jpg',
        width: 320,
        height: 180,
      },
      high: {
        url: 'https://i.ytimg.com/vi/TdEB_fXm8Jc/hqdefault.jpg',
        width: 480,
        height: 360,
      },
      standard: {
        url: 'https://i.ytimg.com/vi/TdEB_fXm8Jc/sddefault.jpg',
        width: 640,
        height: 480,
      },
      maxres: {
        url: 'https://i.ytimg.com/vi/TdEB_fXm8Jc/maxresdefault.jpg',
        width: 1280,
        height: 720,
      },
    },
    channelTitle: 'WEB THE THAO',
    tags: ['thể thao', 'tin tức thể thao', 'thể thao tổng hợp', 'web thể thao'],
    categoryId: '17',
    liveBroadcastContent: 'none',
    defaultLanguage: 'vi',
    localized: {
      title: 'TRẬN ĐẤU NGHẸT THỞ ĐẾN PHÚT CUỐI CÙNG CỦA HOÀNG SAO',
      description: 'TRẬN ĐẤU NGHẸT THỞ ĐẾN PHÚT CUỐI CÙNG CỦA HOÀNG SAO',
    },
    defaultAudioLanguage: 'vi',
  },
};

describe('VideosService', () => {
  let videosService: VideosService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Video),
          useValue: {
            find: jest.fn().mockResolvedValue(videosResult),
            findOne: jest.fn().mockResolvedValue(videosResult[0]),
            create: jest.fn().mockResolvedValue(videosResult[0]),
            save: jest.fn().mockResolvedValue(videosResult[0]),
          },
        },
        {
          provide: 'IsYoutubeVideo',
          useValue: {
            validate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => key),
          },
        },
        {
          provide: AppGateway,
          useValue: {
            server: { emit: jest.fn() },
          },
        },
        VideosService,
      ],
    }).compile();

    videosService = moduleRef.get<VideosService>(VideosService);
    jest.spyOn(Youtube, 'getYoutubeVideoList').mockImplementation(() => {
      return Promise.resolve([youtubeResponse]);
    });
  });

  it('videosService should be defined', () => {
    expect(videosService).toBeDefined();
  });

  describe('findManyWithPagination', () => {
    it('should return an array of videos', async () => {
      const received = await videosService.findManyWithPagination({ page: 1, limit: 3 });
      expect(received[0].id).toEqual(videosResult[0].id);
      expect(received.length).toEqual(videosResult.length);
    });
  });

  describe('create', () => {
    it('should return a created video', async () => {
      const received = await videosService.create(youtubeResponse.id, 1);
      expect(received.id).toEqual(videosResult[0].id);
    });
  });
});
