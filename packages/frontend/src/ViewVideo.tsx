import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Video } from "./App";
import ReactHlsPlayer from "react-hls-player";

export const ViewVideo = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState<Video | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
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
          <ReactHlsPlayer
            src={videoData.url}
            autoPlay={false}
            controls={true}
            width='80%'
            height='auto'
            hlsConfig={{
              maxLoadingDelay: 4,
              minAutoBitrate: 0,
              lowLatencyMode: true,
            }}
            playerRef={videoRef}
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
