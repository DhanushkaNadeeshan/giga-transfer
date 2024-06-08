"use client";
import React, { useState, ChangeEvent } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<string>("0%");

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(`${percentCompleted}%`);
          console.log(percentCompleted);
        },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage("File upload failed");
    }
  };

  return (
    <div className="bg-gray-300 p-4 w-2/4 mx-auto rounded">
      {progress != "0%" && (
        <div className="p-4">
          <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: progress }}
            >
              {progress}
            </div>
          </div>
        </div>
      )}
      <input
        type="file"
        className="w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-green-200 file:hover:bg-green-300 file:text-green-700 rounded"
        onChange={onFileChange}
      />
      <div className="mx-auto flex p-4">
        <button
          onClick={onFileUpload}
          className="bg-green-100 text-green-800  hover:bg-green-300 text-sm px-4 py-1 rounded-full border border-green-500 mx-auto"
        >
          Upload
        </button>
      </div>
      <p className="text-slate-600 text-center">{message}</p>
    </div>
  );
};

export default FileUpload;
