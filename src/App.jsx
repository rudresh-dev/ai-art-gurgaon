
// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const App = () => {
// //     const [prompt, setPrompt] = useState("");
// //     const [style, setStyle] = useState("Fantasy Art");
// //     const [imageBase64, setImageBase64] = useState("");

// //     const handleImageChange = (e) => {
// //       // Check if a file is selected
// //       if (e.target.files && e.target.files[0]) {
// //           const file = e.target.files[0];  // Get the first file
// //           console.log("Selected File:", file);  // Log the selected file
  
// //           const reader = new FileReader();
// //           reader.onloadend = () => {
// //               const base64String = reader.result.split(',')[1];  // Remove the base64 prefix
// //               setImageBase64(base64String);
// //               console.log("Base64 Image String:", base64String);  // Log the base64 image string
// //           };
  
// //           reader.readAsDataURL(file);  // Convert file to Base64 string
// //       } else {
// //           console.error("No file selected or file input issue.");
// //       }
// //   };
  
  

// //   const handleSubmit = async () => {
// //     try {
// //         console.log("Prompt:", prompt);  // Log prompt
// //         console.log("Image Base64:", imageBase64);  // Log base64 image

// //         if (!prompt || !imageBase64) {
// //             console.error("Prompt or Image is missing");
// //             return;
// //         }

// //         const response = await axios.post('http://localhost:5000/generate-image', {
// //             prompt: prompt,
// //             style: style,
// //             image: imageBase64
// //         });

// //         // Log the entire response object
// //         console.log("Full response:", response);

// //         // Since the API returns an image_url, handle it like this:
// //         if (response.status === 200 && response.data.image_url) {
// //             const imageUrl = response.data.image_url;
// //             console.log("Generated Image URL:", imageUrl);
// //             // You can now use this imageUrl to display or further process the image
// //         } else {
// //             // Log an error if image_url is not present
// //             console.error("Error response: No image URL found");
// //         }
// //     } catch (error) {
// //         if (error.response) {
// //             console.error("Error response:", error.response.data);
// //         } else if (error.request) {
// //             console.error("No response received:", error.request);
// //         } else {
// //             console.error("Error:", error.message);
// //         }
// //     }
// // };



// //     return (
// //         <div>
// //             <input
// //                 type="text"
// //                 placeholder="Enter prompt"
// //                 value={prompt}
// //                 onChange={(e) => setPrompt(e.target.value)}
// //             />
// //             <input
// //                 type="text"
// //                 placeholder="Enter style"
// //                 value={style}
// //                 onChange={(e) => setStyle(e.target.value)}
// //             />
// //             <input type="file" accept="image/*" onChange={handleImageChange} />
// //             <button onClick={handleSubmit}>Generate Image</button>
// //         </div>
// //     );
// // };

// // export default App;



// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const App = () => {
// //     const [prompt, setPrompt] = useState("");
// //     const [style, setStyle] = useState("Fantasy Art");
// //     const [imageBase64, setImageBase64] = useState("");
// //     const [imageUrl, setImageUrl] = useState(null);  // State to store the generated image URL
// //     const [loading, setLoading] = useState(false);  // State for loading indication

// //     const handleImageChange = (e) => {
// //         if (e.target.files && e.target.files[0]) {
// //             const file = e.target.files[0];
// //             const reader = new FileReader();
// //             reader.onloadend = () => {
// //                 const base64String = reader.result.split(',')[1];  // Remove base64 prefix
// //                 setImageBase64(base64String);
// //             };
// //             reader.readAsDataURL(file);  // Convert file to base64
// //         } else {
// //             console.error("No file selected.");
// //         }
// //     };

// //     const handleSubmit = async () => {
// //       setLoading(true);  // Start loading
// //       try {
// //           const response = await axios.post('http://localhost:5000/generate-image', {
// //               prompt: prompt,
// //               style: style,
// //               image: imageBase64
// //           });
  
// //           console.log("Full response:", response);  // Log the entire response
  
// //           if (response.data.status === "success") {
// //               const generatedImageUrl = response.data.image_url;  // Get the image URL
// //               console.log("Generated Image URL:", generatedImageUrl);  // Log the image URL
// //               setImageUrl(`http://localhost:5000${generatedImageUrl}`);  // Set the full URL
// //           } else {
// //               console.error("Error:", response.data.message);
// //           }
// //       } catch (error) {
// //           console.error("Error:", error);
// //       } finally {
// //           setLoading(false);  // Stop loading
// //       }
// //   };
  

// //     return (
// //         <div>
// //             <input
// //                 type="text"
// //                 placeholder="Enter prompt"
// //                 value={prompt}
// //                 onChange={(e) => setPrompt(e.target.value)}
// //             />
// //             <input
// //                 type="text"
// //                 placeholder="Enter style"
// //                 value={style}
// //                 onChange={(e) => setStyle(e.target.value)}
// //             />
// //             <input type="file" accept="image/*" onChange={handleImageChange} />
// //             <button onClick={handleSubmit} disabled={loading}>
// //                 {loading ? "Generating..." : "Generate Image"}
// //             </button>

// //             {/* Display the generated image */}
// //             {imageUrl && (
// //                 <div>
// //                     <h3>Generated Image:</h3>
// //                     <img src={imageUrl} alt="Generated" style={{ width: '300px', height: '300px' }} />
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default App;



// import React, { useState } from 'react';
// import axios from 'axios';

// const App = () => {
//     const [prompt, setPrompt] = useState("");
//     const [style, setStyle] = useState("Fantasy Art");
//     const [imageBase64, setImageBase64] = useState("");
//     const [imageUrl, setImageUrl] = useState(null);  // Store the image URL
//     const [loading, setLoading] = useState(false);   // For loading state

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const base64String = reader.result.split(',')[1];  // Remove the base64 prefix
//                 setImageBase64(base64String);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = async () => {
//       setLoading(true);  // Start loading
//       try {
//           const response = await axios.post('http://localhost:5000/generate-image', {
//               prompt: prompt,
//               style: style,
//               image: imageBase64
//           });
  
//           console.log("Full response:", response);  // Log the entire response
  
//           // Check if the response contains the image_url
//           if (response.data && response.data.image_url) {
//               setImageUrl(`http://localhost:5000${response.data.image_url}`);
//           } else {
//               console.error("Unexpected response format, image_url not found.");
//           }
//       } catch (error) {
//           // More detailed error handling
//           if (error.response) {
//               // Server responded with an error status code
//               console.error("Error Response:", error.response);
//           } else if (error.request) {
//               // Request was made but no response received
//               console.error("No response received:", error.request);
//           } else {
//               // Something went wrong setting up the request
//               console.error("Error setting up request:", error.message);
//           }
//       } finally {
//           setLoading(false);  // Stop loading
//       }
//   };
  
  
  

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Enter prompt"
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//             />
//             <input
//                 type="text"
//                 placeholder="Enter style"
//                 value={style}
//                 onChange={(e) => setStyle(e.target.value)}
//             />
//             <input type="file" accept="image/*" onChange={handleImageChange} />
//             <button onClick={handleSubmit} disabled={loading}>
//                 {loading ? "Generating..." : "Generate Image"}
//             </button>

//             {imageUrl && (
//                 <div>
//                     <h3>Generated Image:</h3>
//                     <img src={imageUrl} alt="Generated" style={{ width: '300px', height: '300px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default App;



import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DrawingApp from './DrawingApp';
import Result from './Result';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DrawingApp />} />
                <Route path="/result" element={<Result />} />
            </Routes>
        </Router>
    );
};

export default App;
