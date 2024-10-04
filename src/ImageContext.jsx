// ImageContext.js
import React, { createContext, useState } from "react";

// Create the context
export const ImageContext = createContext();

// Create the provider component
export const ImageProvider = ({ children }) => {
  const [canvasDrawingUrl, setCanvasDrawingUrl] = useState(null); // Store canvas drawing URL
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Store uploaded image URL

  return (
    <ImageContext.Provider
      value={{
        canvasDrawingUrl,
        setCanvasDrawingUrl,
        uploadedImageUrl,
        setUploadedImageUrl,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
