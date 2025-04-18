# Laine FE Coding Challenge

This project provides a basic scaffold for a file management application with a Next.js frontend and an Express backend.

## Running the Application

1. **Backend:**

   ```bash
   cd backend
   npm install
   node server.js
   ```

   The backend server will run on `http://localhost:3001`.
2. **Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend development server will run on `http://localhost:3000`.

## Challenge Instructions for the Candidate

**Goal:** Enhance the file listing application to allow users to view file details, add comments, and render the content of specific file types directly in the browser.

**Instructions:**

1. **Understand the Existing Code:**

   * Familiarize yourself with the provided Next.js frontend (`frontend/src`) and Express backend (`backend`).
   * Review the data structure in `backend/data/data.json` (note the new `filename` property) and the API endpoints in `backend/server.js`.
   * Examine `frontend/src/app/page.tsx` and `frontend/src/components/CommentSection.tsx`. Understand state management, data fetching, and component interaction.
2. **Verify Core Functionality:**

   * Run both servers and confirm the file list loads, selection works, and basic commenting is functional.
3. **Implement Server-Side DOCX Rendering:**

   * **Backend Task:**
     * Add a Node.js library capable of converting `.docx` files to HTML to the backend project (e.g., `mammoth`). Install it using `npm install mammoth` in the `backend` directory.
     * Create a new API endpoint in `backend/server.js`, for example: `GET /api/files/:fileId/content`.
     * This endpoint should:
       * Find the file metadata in `data.json` using the `:fileId`.
       * Check if the `filename` ends with `.docx`.
       * If it's a `.docx` file, read the file from the `backend/data` directory using its `filename`.
       * Use the chosen library (e.g., `mammoth.convertToHtml()`) to convert the `.docx` file buffer/content into an HTML string.
       * Handle potential errors during conversion.
       * Send the resulting HTML string back as the response (e.g., `res.send(result.value)`).
       * If the file is *not* a `.docx` file, respond with an appropriate message or status code (e.g., 400 Bad Request or `{ message: 'Content rendering not supported for this file type' }`).
   * **Frontend Task:**
     * Modify the frontend (`page.tsx` or a new detail component) so that when a `.docx` file is selected:
       * It calls the new `/api/files/:fileId/content` endpoint to fetch the HTML content.
       * Display a loading state while fetching.
       * Display the fetched HTML content within a designated area on the page.
       * **Important:** Use `dangerouslySetInnerHTML` to render the HTML. Be aware of the security implications - for this challenge, direct rendering is acceptable, but in a real application, you would typically sanitize the HTML first using a library like `DOMPurify` to prevent XSS attacks.
       * Handle potential errors during fetching (e.g., display an error message if the backend fails to convert or return the content).
     * For non-`.docx` files (like the PDF), you can either show a message like "Preview not available" or implement the download functionality described previously as an alternative.
4. **(Optional) Enhance File Details Display:**

   * Display the selected file's details (name, upload date) more prominently when selected.
5. **(Optional) Refine Styling:**

   * Improve the visual presentation, especially the layout of the file list, selected file details, rendered content area, and comments.
6. **(Optional) Enhance Error Handling & Loading States:**

   * Add more specific user feedback for loading states (e.g., when converting/fetching DOCX content) and error scenarios.
