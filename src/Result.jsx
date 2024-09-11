// import React from "react";
// import { useLocation } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas

// const ResultPage = () => {
//   const location = useLocation();
//   const { uploadedImageUrl } = location.state || {};

//   console.log("Received URL in result page:", uploadedImageUrl); // Debugging

//   return (
//     <div>
//       {uploadedImageUrl ? (
//         <div>
//           <img
//             src={uploadedImageUrl}
//             alt="Uploaded Art"
//             style={{ width: "500px", height: "500px" }}
//           />
//           <QRCodeCanvas value={uploadedImageUrl} size={256} /> 
//         </div>
//       ) : (
//         <p>No image to display</p>
//       )}
//     </div>
//   );
// };

// export default ResultPage;



// import { useLocation } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";

// const ResultPage = () => {
//   const location = useLocation();
//   const { canvasDrawingUrl, uploadedImageUrl } = location.state || {};

//   console.log("Received in result page:", canvasDrawingUrl, uploadedImageUrl); // Debugging

//   return (
//     <div>
//       <h1>Result Page</h1>
//       <div style={{ display: "flex", justifyContent: "space-around" }}>
//         {canvasDrawingUrl && (
//           <div>
//             <h3>Your Drawing</h3>
//             <img
//               src={canvasDrawingUrl}
//               alt="Canvas Drawing"
//               style={{ width: "500px", height: "500px" }}
//             />
//           </div>
//         )}

//         {uploadedImageUrl ? (
//           <div>
//             <h3>Generated Image</h3>
//             <img
//               src={uploadedImageUrl}
//               alt="Generated Art"
//               style={{ width: "500px", height: "500px" }}
//             />
//             <h3>QR Code for the Generated Image</h3>
//             <QRCodeCanvas value={uploadedImageUrl} size={256} />
//             <p>
//               Scan this QR code to view the uploaded image:
//               <a
//                 href={uploadedImageUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {uploadedImageUrl}
//               </a>
//             </p>
//           </div>
//         ) : (
//           <p>No image to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResultPage;



import { useNavigate, useLocation} from "react-router-dom"; 
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ReactLoading from 'react-loading'; 
import './UIScreen.css';

const Result = () => {
  const navigate = useNavigate(); // Initialize navigate function
    const location = useLocation();
  const handleRedraw = () => {
    navigate('/'); // Navigate to the root path
  };

  const { canvasDrawingUrl, uploadedImageUrl } = location.state || {};

  console.log("Received in result page:", canvasDrawingUrl, uploadedImageUrl); // Debugging

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);

  useEffect(() => {
    // Check if images are loaded or not
    const checkImageLoad = () => {
      if (uploadedImageUrl && canvasDrawingUrl) {
        const image1 = new Image();
        const image2 = new Image();

        image1.src = uploadedImageUrl;
        image2.src = canvasDrawingUrl;

        let loadedImages = 0;

        const onImageLoad = () => {
          loadedImages += 1;
          if (loadedImages === 2) {
            setIsImageLoading(false);
            setIsCanvasLoading(false);
          }
        };

        image1.onload = onImageLoad;
        image2.onload = onImageLoad;

        image1.onerror = () => setIsImageLoading(false);
        image2.onerror = () => setIsCanvasLoading(false);
      }
    };

    checkImageLoad();
  }, [uploadedImageUrl, canvasDrawingUrl]);



  return (
    <div className="ui-screen">
      <div className="content">
        <div className="image-area">
          <div className="result-image">
          {isImageLoading ? (
              <div className="loading-container">
              <ReactLoading type="spinningBubbles" color="#fff" height={200} width={200} /> {/* Larger and white spinner */}
            </div>
            ) : (
              <img 
                src={uploadedImageUrl} 
                alt="Futuristic cityscape" 
              />
            )}
          </div>
          <div className="art-image">
          {isCanvasLoading ? (
               <div className="loading-container">
               <ReactLoading type="spinningBubbles" color="#fff" height={200} width={200} /> {/* Larger and white spinner */}
             </div>
            ) : (
              <img 
                src={canvasDrawingUrl} 
                alt="Art image placeholder" 
              />
            )}
          </div>
        </div>
        <div className="qr-area">
            <div className="download-info">
              <h2>Scan to download</h2>
            </div>
          <div className="qr-code">
         
          <QRCodeCanvas value={uploadedImageUrl} size={256} />
          </div>
          <button className="redraw-button" onClick={handleRedraw}>
            Redraw
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Result;
