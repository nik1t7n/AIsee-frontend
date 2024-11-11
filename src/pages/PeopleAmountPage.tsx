import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';

const PeopleAmountPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uniquePeopleCount, setUniquePeopleCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (videoFile) {
      const formData = new FormData();
      formData.append('video_file', videoFile, videoFile.name);

      try {
        const response = await axios.post('http://127.0.0.1:8000/analyze-people-amount', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setUniquePeopleCount(response.data.unique_people_count);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-[#333333]">Analyze People Amount</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="video_file" className="block text-sm font-medium text-[#333333]">
              Select Video
            </label>
            <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-[#333333] border-dashed rounded-md hover:border-[#666666] focus-within:border-[#666666] focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#666666]">
              {videoFile ? (
                <div className="text-center">
                  <MdCheckCircle className="mx-auto h-12 w-12 text-[#4bb543]" />
                  <p className="mt-2 text-sm text-[#333333]">{videoFile.name}</p>
                </div>
              ) : (
                <label
                  htmlFor="video_file"
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#666666]"
                >
                  <div className="space-y-1 text-center">
                    {isLoading ? (
                      <VscLoading className="mx-auto h-12 w-12 text-[#666666] animate-spin" />
                    ) : (
                      <FaCloudUploadAlt className="mx-auto h-12 w-12 text-[#666666]" />
                    )}
                    <div className="flex text-sm text-[#666666]">
                      <span>Upload a video</span>
                    </div>
                  </div>
                </label>
              )}
            </div>
            <input
              type="file"
              id="video_file"
              accept="video/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#333333] border border-[#333333] rounded-md shadow-sm hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#333333] animate-fade-in"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <VscLoading className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </div>
            ) : (
              'Analyze'
            )}
          </button>
        </form>
        {uniquePeopleCount !== null && (
          <div className="mt-6 text-center text-2xl font-bold text-[#333333] animate-fade-in">
            Unique People: {uniquePeopleCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleAmountPage;