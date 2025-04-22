
"use client"; // Component uses client-side hooks

import React, { useState, useEffect } from "react";

interface FileContentProps {
  fileId: string | null;
  filename: string | null;
}

function FileContent({ fileId, filename }: FileContentProps) {
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fileId && filename) {
      handleLoadFileContent({fileId, filename});
    } else {
      setFileContent('');
    }
  }, [fileId]);

  const handleLoadFileContent = async ({fileId, filename} : FileContentProps) => {
    const extension = filename?.split(".").pop();
    try {
      setIsLoading(true);
      setError(null);
      let apiUrl = '';
      if (extension == 'docx') {
        apiUrl = `http://localhost:3001/api/files/${fileId}/content`;
      } else if (extension == 'pdf') {
        apiUrl = `http://localhost:3001/api/files/${fileId}/view`;
      } else {
        setError("Unsupported file type");
      }

      await fetch(apiUrl, { method: "GET" }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch file content.");
        }

        if (extension == 'docx') {
          return res.json();
        } else if (extension == 'pdf') {
          return res.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            const html = `<iframe src="${url}" width="100%" height="600px"></iframe>`;
            return { html };
          });
        } else {
          setError("Unsupported file type");
        }
      })
      .then((data) => {
        setFileContent(data.html);
      })
      .catch((err) => {
        console.error("Error fetching file content:", err);
        setError(err.message || "Could not load file content.");
        setFileContent('');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      // Type assertion for error message access
      const errorMessage =
        err instanceof Error ? err.message : "Could not add comment.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-semibold mb-3">File Details</h2>
      {fileId && (
        <div className="mb-4">
          <div contentEditable='true' dangerouslySetInnerHTML={{ __html: fileContent }}></div>
        </div>
      )}
    </div>
  );
}

export default FileContent;