import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddVideo = () => {
  const [videoName, setVideoName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleAddVideo = async () => {
    if (videoName !== "" && videoFile && !isUploading) {
      setIsUploading(true);
      const s3UrlResponse = await axios.post<{ url: string; msg: string }>(
        import.meta.env.VITE_APP_API_URL + "/videos/upload",
        {
          filename: videoFile.name,
          contentType: videoFile.type,
        }
      );

      if (s3UrlResponse.data) {
        await axios.put(s3UrlResponse.data.url, videoFile, {
          headers: {
            "Content-Type": videoFile.type,
          },
        });

        await axios.post(import.meta.env.VITE_APP_API_URL + "/videos", {
          name: videoFile.name,
          url:
            "https://" +
            import.meta.env.VITE_APP_VIDEO_DOMAIN_NAME +
            "/" +
            s3UrlResponse.data.url.split("?")[0].split("s3.amazonaws.com/")[1],
          key: videoFile.name,
        });

        alert("Video uploaded successfully");

        navigate("/");

        setIsUploading(false);
      }
    }
  };

  return (
    <div className='w-full h-full flex flex-row items-center justify-center'>
      <div className='max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mb-4'>
        <h2 className='text-xl font-semibold mb-4'>Add New Video</h2>
        <div className='mb-4'>
          <label className='block text-gray-700'>Video Name</label>
          <input
            type='text'
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
            placeholder='Enter video name'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Upload Video</label>
          <input
            type='file'
            accept='video/*'
            onChange={(e) => {
              const file = e.target.files && e.target.files.item(0);
              if (file) {
                setVideoFile(file);
              }
            }}
            className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          />
        </div>
        <button
          onClick={handleAddVideo}
          disabled={isUploading}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
        >
          {isUploading ? "Uploading..." : "Add Video"}
        </button>
      </div>
    </div>
  );
};
