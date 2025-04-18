"use client"; // Component uses client-side hooks

import React, { useState, useEffect } from "react";

// Define interfaces for comment structure
interface Comment {
  id: string;
  author: string;
  text: string;
}

interface CommentSectionProps {
  fileId: string | null; // fileId can be null if no file is selected
}

function CommentSection({ fileId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fileId) {
      setIsLoading(true);
      setError(null);
      fetch(`http://localhost:3001/api/files/${fileId}/comments`) // Adjust URL if needed
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch comments");
          }
          return res.json();
        })
        .then((data: Comment[]) => {
          setComments(data);
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setError(err.message || "Could not load comments.");
          setComments([]); // Clear comments on error
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setComments([]); // Clear comments if no file is selected
    }
  }, [fileId]);

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !fileId) return; // Prevent empty comments or adding without fileId

    setIsLoading(true); // Indicate loading state for adding comment
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/files/${fileId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newCommentText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment: Comment = await response.json();
      setComments((prevComments) => [...prevComments, newComment]);
      setNewCommentText(""); // Clear input field
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
      <h2 className="text-xl font-semibold mb-3">Comments</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && fileId && comments.length === 0 && (
        <p>No comments yet for this file.</p>
      )}
      {!fileId && <p>Select a file to view comments.</p>}
      {fileId &&
        comments.map((comment) => (
          <div key={comment.id} className="mb-2 p-2 border rounded bg-gray-50">
            <p>
              <strong>{comment.author}:</strong> {comment.text}
            </p>
          </div>
        ))}

      {fileId && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Add New Comment</h3>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={3}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Your comment..."
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddComment}
            disabled={isLoading || !newCommentText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? "Adding..." : "Add Comment"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
