import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Video } from "./App";

export const ViewVideo = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState<Video | undefined>(undefined);
  const _fetchVideo = useCallback(async () => {
    const response = await axios.get<Video>(
      import.meta.env.VITE_APP_API_URL + "/videos/" + id
    );
    if (response.data) {
      setVideoData(response.data);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      _fetchVideo();
    }
  }, [_fetchVideo, id]);

  return (
    <div className=' bg-white'>
      {videoData ? (
        <div className='h-auto w-full flex flex-col items-center justify-center'>
          <video
            className='object-cover w-[80%]'
            controls
            src={videoData.url}
          />
          <h2 className='text-xl font-semibold mb-2'>{videoData.name}</h2>
        </div>
      ) : (
        <div className='p-4'>
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
};
