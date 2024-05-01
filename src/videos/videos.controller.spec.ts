import { Test } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const videosResult: any[] = [
  {
    id: 9,
    createdAt: '2024-05-01T18:31:07.042Z',
    updatedAt: '2024-05-01T18:31:07.042Z',
    createdBy: null,
    updatedBy: null,
    videoId: 'PyNtlJJfC98',
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
    url: 'https://www.youtube.com/watch?v=PyNtlJJfC98',
    title: 'Giải Billiards Pool 9 Bi HBSF I Cúp Min Table năm 2024',
    channel: 'Liên đoàn Billiards & Snooker TPHCM (HBSF)',
    description: 'Giải Billiards Pool 9 Bi HBSF I Cúp Min Table năm 2024 diễn ra từ ngày 09 đến 14/04/2024',
    thumbnail: 'https://i.ytimg.com/vi/PyNtlJJfC98/sddefault.jpg',
  },
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
const requestUser = { id: 1 };
const shareVideoUrl = 'https://www.youtube.com/watch?v=TdEB_fXm8Jc';

describe('VideosController', () => {
  let videosService: VideosService;
  let videosController: VideosController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        {
          provide: VideosService,
          useValue: {
            findManyWithPagination: jest.fn().mockResolvedValue(videosResult),
            create: jest.fn().mockResolvedValue(videosResult[0]),
          },
        },
      ],
    }).compile();
    videosService = moduleRef.get<VideosService>(VideosService);
    videosController = moduleRef.get<VideosController>(VideosController);
  });

  it('videosController should be defined', () => {
    expect(videosController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      const received = await videosController.findAll();
      expect(received.data).toStrictEqual(videosResult);
    });

    it('should return an empty array', async () => {
      jest.spyOn(videosService, 'findManyWithPagination').mockImplementation(() => Promise.resolve([]));
      const received = await videosController.findAll();
      expect(received.data).toStrictEqual([]);
    });

    it('should return hasNextPage is true', async () => {
      const received = await videosController.findAll(1, videosResult.length);
      expect(received.hasNextPage).toBeTruthy();
    });

    it('should return hasNextPage is false', async () => {
      const received = await videosController.findAll(1, videosResult.length + 1);
      expect(received.hasNextPage).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should return a created video', async () => {
      const received = await videosController.create({ user: requestUser }, { videoUrl: shareVideoUrl });
      expect(received).toStrictEqual(videosResult[0]);
    });

    it('should return missingVideoId error', async () => {
      try {
        await videosController.create({ user: requestUser }, { videoUrl: 'https://www.youtube.com' });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(err.response.errors.videoUrl).toEqual('missingVideoId');
      }
    });

    it('should return invalidVideoId error', async () => {
      jest.spyOn(videosService, 'create').mockImplementation(() => {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              data: 'invalidVideoId',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });

      try {
        await videosController.create({ user: requestUser }, { videoUrl: shareVideoUrl });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(err.response.errors.data).toEqual('invalidVideoId');
      }
    });
  });
});
