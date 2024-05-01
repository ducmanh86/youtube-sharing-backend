import { youtube } from '@googleapis/youtube';

export const getYoutubeVideoList = async (youtubeApiKey: string, videoIds: string[]) => {
  const videoRespone = await youtube({
    auth: youtubeApiKey,
    version: 'v3',
  }).videos.list({
    id: videoIds,
    part: ['snippet'],
  });

  return videoRespone?.data.items;
};
