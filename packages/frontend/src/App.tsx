import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface Video {
  id: string;
  url: string;
  name: string;
  key: string;
}

function App() {
  const [videos, setVideos] = useState<Array<Video>>([]);

  const _fetchVideos = async () => {
    const response = await axios.get<Array<Video>>(
      import.meta.env.VITE_APP_API_URL + "/videos"
    );
    if (response.data) {
      setVideos(response.data);
    }
  };

  const deleteVideo = async (id: string) => {
    await axios.delete(import.meta.env.VITE_APP_API_URL + "/videos/" + id);
    alert("Successfully deleted video");
    _fetchVideos();
  };

  useEffect(() => {
    _fetchVideos();
  }, []);

  return (
    <div className='bg-gray-100 flex items-center justify-center h-screen p-10'>
      <div className='container h-[100%] bg-white shadow-lg rounded-lg p-6'>
        <header className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>StreamBit</h1>
          <Link to={"/add-video"}>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
              Add Video
            </button>
          </Link>
        </header>

        {videos.length > 0 ? (
          <ul>
            {videos.map((video, index) => (
              <Link key={index} to={"/video/" + video.id}>
                <li className='flex justify-between items-center border-b border-gray-300 py-2'>
                  <p className='font-semibold'>{video.name}</p>
                  <p className='font-semibold'>{video.key}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteVideo(video.id);
                    }}
                    className='text-red-500 hover:text-red-600'
                  >
                    Remove
                  </button>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <div>
            <h1>No Videos Found Yet...</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
