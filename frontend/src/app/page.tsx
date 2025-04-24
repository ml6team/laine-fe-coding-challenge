"use client"; // Add this directive for client-side hooks

import type React from "react"; // Add React import
import { useState, useEffect } from "react";
import CommentSection from "@/components/CommentSection"; // Import the component

// Define an interface for the file structure
interface File {
  id: string;
  name: string;
  uploadDate: string;
  filename: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]); // Use the File interface
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null); // State for selected file ID
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [pdfURL, setPdfURL] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingFiles(true);
    setErrorFiles(null);
    fetch("http://localhost:3001/api/files") // Adjust URL if needed
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch files");
        }
        return res.json();
      })
      .then((data: File[]) => {
        setFiles(data);
      })
      .catch((err) => {
        console.error("Error fetching files:", err);
        setErrorFiles(err.message || "Could not load files.");
      })
      .finally(() => {
        setIsLoadingFiles(false);
      });
  }, []);



  const loadFilePreview = (fileId: string) => {
    setPreviewContent("");
    setPdfURL(null);
    setIsLoadingPreview(true);
      fetch(`http://localhost:3001/api/files/${fileId}/content`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch files");
        }

        return res.json();
      })
      .then((data: any) => {
        console.log("html", data);
        setPreviewContent(data.html);
      })
      .catch((err) => {

      })
      .finally( ()=> {
        setIsLoadingPreview(false);
      });
  }

  const loadPdfPreview = (fileId: string) => {
    setPreviewContent("");
    setPdfURL(`http://localhost:3001/api/files/${fileId}/view`);
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);

    //get the file selected
    const selectedFile = files.find(item => {
      return item.id == fileId;
    })

    const filenameComps = selectedFile?.filename.split('.') || [];
    const ext = (filenameComps[filenameComps?.length - 1]).toLowerCase();
    if(ext == "docx") {
      loadFilePreview(fileId);
    } else if (ext == "pdf") {
      loadPdfPreview(fileId);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    fileId: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Prevent default space bar scroll
      handleFileSelect(fileId);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-8 md:p-16 lg:p-24 bg-gray-50 text-gray-900">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">File Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* File List Section */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Files</h2>
            {isLoadingFiles && <p>Loading files...</p>}
            {errorFiles && <p className="text-red-500">Error: {errorFiles}</p>}
            {!isLoadingFiles && !errorFiles && (
              <ul className="space-y-2 list-none p-0 m-0">
                {files.map((file) => (
                  <li key={file.id}>
                    <button
                      type="button"
                      onClick={() => handleFileSelect(file.id)}
                      onKeyDown={(e) => handleKeyDown(e, file.id)}
                      aria-pressed={selectedFileId === file.id}
                      className={`w-full text-left p-3 rounded border cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedFileId === file.id
                          ? "bg-blue-100 font-semibold border-blue-300"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {file.uploadDate}
                      </p>
                    </button>
                  </li>
                ))}
                {files.length === 0 && !isLoadingFiles && (
                  <li className="text-gray-500 italic">No files found.</li>
                )}
              </ul>
            )}
          </div>


          {/* File preview section */}
          <div>
            { isLoadingPreview ? <p>Loading Preview</p> : ""}
            <div dangerouslySetInnerHTML={{__html: previewContent}}></div>
            
            { pdfURL ? <iframe src={pdfURL} width={window.innerWidth / 2} height={700}></iframe> : "" }
          </div>

          {/* Comment Section */}
          <div className="md:col-span-2">
            <CommentSection fileId={selectedFileId} />
          </div>
        </div>
      </div>
    </main>
  );
}
