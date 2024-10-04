import React, { useContext, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ImageContext } from "../src/ImageContext"; // Import the context

const DisplayPage = () => {
  const { canvasDrawingUrl, uploadedImageUrl } = useContext(ImageContext); // Access the context
  const [imageUrl, setImageUrl] = useState(uploadedImageUrl);

  // Effect to listen to changes in the uploadedImageUrl
  useEffect(() => {
    if (uploadedImageUrl) {
      setImageUrl(uploadedImageUrl);
    }
  }, [uploadedImageUrl]);

  if (!imageUrl) {
    return <div>No image available to display</div>;
  }

  return (
    <div>
      <h2>Display Page</h2>
      <div>
        <img src={imageUrl} alt="Generated Image" />
        {imageUrl && <QRCodeCanvas value={imageUrl} size={256} />}
      </div>
    </div>
  );
};

export default DisplayPage;
