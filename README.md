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
3. **Implement File Previews (DOCX and PDF):**

   * **Backend Task (DOCX Conversion):**
     * Add a Node.js library capable of converting `.docx` files to HTML to the backend project (e.g., `mammoth`). Install it using `npm install mammoth` in the `backend` directory.
     * Create a new API endpoint in `backend/server.js`, for example: `GET /api/files/:fileId/content`.
     * This endpoint should:
       * Find the file metadata in `data.json` using the `:fileId`.
       * Check if the `filename` ends with `.docx`.
       * If it's a `.docx` file, read the file from the `backend/data` directory using its `filename`.
       * Use the chosen library (e.g., `mammoth.convertToHtml()`) to convert the `.docx` file buffer/content into an HTML string.
       * Handle potential errors during conversion.
       * Send the resulting HTML string back as the response (e.g., `res.send(result.value)`).
       * If the file is *not* a `.docx` file, proceed to the next check (or respond appropriately if no other preview type is supported).
   * **Backend Task (PDF Serving):**
     * Create another API endpoint (or modify the previous one) specifically for serving files suitable for browser viewing, e.g., `GET /api/files/:fileId/view`.
     * This endpoint should:
       * Find the file metadata in `data.json` using `:fileId`.
       * Get the `filename` (e.g., "contract.pdf").
       * Construct the full path to the file in `backend/data`.
       * Check if the file exists.
       * If the file is a `.pdf`, set the response header `Content-Type` to `application/pdf`.
       * Read the PDF file and send its contents in the response. **Do not** set the `Content-Disposition: attachment` header. (Using `res.sendFile()` in Express is recommended).
       * If the file is not a PDF (and wasn't handled by DOCX conversion), respond with an appropriate error (e.g., 400 or `{ message: 'Preview not supported' }`).
   * **Frontend Task (Conditional Rendering):**
     * Modify the frontend (`page.tsx` or a new detail component) to determine the selected file's type based on its `filename` (you may need to ensure the `filename` is available in the frontend state when a file is selected).
     * When a `.docx` file is selected:
       * Call the `/api/files/:fileId/content` endpoint.
       * Display a loading state.
       * Render the fetched HTML using `dangerouslySetInnerHTML` in a designated area. (Acknowledge security implications for the challenge).
       * Handle errors.
     * When a `.pdf` file is selected:
       * Render an `<iframe>` element.
       * Set the `src` attribute to the PDF viewing endpoint (e.g., `/api/files/:fileId/view`).
       * Set appropriate `width`, `height`, and `title` attributes for the iframe.
     * For any other file types, display a message like "Preview not available for this file type."
     * Ensure the Comment section is still accessible, perhaps alongside or below the preview area.
4. **(Optional) Enhance File Details Display:**

   * Display the selected file's details (name, upload date) more prominently when selected, perhaps above the preview/comment area.
5. **(Optional) Refine Styling:**

   * Improve the visual presentation, especially the layout of the file list, selected file details, preview area (iframe/HTML content), and comments.
6. **(Optional) Enhance Error Handling & Loading States:**

   * Add more specific user feedback for loading states (e.g., when converting/fetching DOCX, loading PDF iframe) and error scenarios.
