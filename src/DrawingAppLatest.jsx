// import { useRef, useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { supabase } from "../supabaseClient"; // Import Supabase client
// import LineArtSelector from "./LineArtSelector"; // Import the LineArtSelector component
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import Loading from "./Loading";
// import { ImageContext } from "./ImageContext";
// import { useUser } from "@clerk/clerk-react";
// const MAX_TRIALS = 3; // Maximum allowed trials

// const DrawingApp = () => {
//   const { user } = useUser(); // Fetch the user from Clerk
//   const userId = user?.id; // Get user ID from Clerk
//   console.log(userId)
//   const canvasRef = useRef(null); // Drawing canvas
//   const imageCanvasRef = useRef(null); // Image canvas

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [prompt, setPrompt] = useState("Sunset with Mountains"); // Selected text prompt
//   const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//   const [selectedSubPrompt, setSelectedSubPrompt] = useState(""); // Final selected sub-prompt
//   const [finalPrompt, setFinalPrompt] = useState(""); // Final prompt combining prompt + line art text
//   const [style, setStyle] = useState("Fantasy Art"); // Default style
//   const [brushColor, setBrushColor] = useState("#000"); // Default brush color (black)
//   const [brushSize, setBrushSize] = useState(1); // Default brush size
//   const [generatedImageUrl, setGeneratedImageUrl] = useState("");
//   // const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Supabase URL for the uploaded image
//   const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode
//   const [loading, setLoading] = useState(false);
//   const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images
//   const navigate = useNavigate(); // For navigation to result page
//   const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
//   const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized
//   const [selectedStyle, setSelectedStyle] = useState("Fantasy Art"); // Track the selected style
//   const [isMobileView, setIsMobileView] = useState(false); // Detect mobile view
//   const handleStyleSelect = (style) => {
//     setSelectedStyle(style); // Update the selected style
//   };
//   const { setCanvasDrawingUrl, setUploadedImageUrl } = useContext(ImageContext); // Use the context to store image URLs
//   const [remainingTrials, setRemainingTrials] = useState(MAX_TRIALS);

//   // Redraw the canvas when the position or size of any image changes
//   useEffect(() => {
//     drawAllImages();
//   }, [lineArtImages]);


//   useEffect(() => {
//     if (userId) {
//       fetchUserTrials(); // Fetch trials when the user ID is available
//     }
//   }, [userId]);

//   useEffect(() => {
//     updateFinalPrompt();
//   }, [lineArtImages, selectedSubPrompt]);

//   // Detect screen size and set isMobileView
//   useEffect(() => {
//     const checkScreenSize = () => {
//       if (window.innerWidth < 768) {
//         setIsMobileView(true);
//       } else if (window.innerWidth <= 768) {
//         setIsMobileView(true);
//       } else {
//         setIsMobileView(false);
//       }
//     };

//     checkScreenSize(); // Check on initial render
//     window.addEventListener("resize", checkScreenSize); // Listen for resize events
//     return () => {
//       window.removeEventListener("resize", checkScreenSize); // Cleanup listener
//     };
//   }, []);




// const fetchUserTrials = async () => {
//   if (!userId) return; // Ensure user is logged in

//   try {
//     const { data, error } = await supabase
//       .from("user_trials")
//       .select("trial_count")
//       .eq("user_id", userId) // Use the Clerk user ID here
//       .single();

//     if (error && error.code === "PGRST116") {
//       // No record found, so insert a new record with MAX_TRIALS
//       const { error: insertError } = await supabase
//         .from("user_trials")
//         .insert([{ user_id: userId, trial_count: MAX_TRIALS }]);

//       if (insertError) {
//         console.error("Error inserting user trials:", insertError);
//         return;
//       }

//       setRemainingTrials(MAX_TRIALS); // Initialize trials
//     } else if (data) {
//       setRemainingTrials(data.trial_count); // Fetch and set remaining trials
//     } else {
//       console.error("Error fetching trials:", error);
//     }
//   } catch (err) {
//     console.error("Error fetching trials:", err);
//   }
// };


// const updateUserTrials = async (newTrialCount) => {
//   if (!userId) return; // Ensure the user is logged in

//   try {
//     const { error } = await supabase
//       .from("user_trials")
//       .update({ trial_count: newTrialCount })
//       .eq("user_id", userId); // Make sure to pass the correct userId

//     if (error) {
//       console.error("Error updating trials:", error);
//     }
//   } catch (err) {
//     console.error("Error updating trials:", err);
//   }
// };


//  // Function to load the overlay image
//  const loadOverlayImage = (src) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = src;
//     img.onload = () => resolve(img);
//     img.onerror = (err) => reject(err);
//   });
// };

// // Function to merge the canvas drawing and generated image with the overlay
// // const mergeWithOverlay = async (generatedImageUrl) => {
// //   const generatedImage = await loadOverlayImage(generatedImageUrl);
// //   const overlayImage = await loadOverlayImage("logo.png"); // Load your overlay PNG

// //   // Create a new canvas for merging the images
// //   const mergedCanvas = document.createElement("canvas");
// //   const mergedContext = mergedCanvas.getContext("2d");

// //   // Set the size of the merged canvas to match the generated image
// //   mergedCanvas.width = generatedImage.width;
// //   mergedCanvas.height = generatedImage.height;

// //   // Draw the generated image on the merged canvas
// //   mergedContext.drawImage(generatedImage, 0, 0);

// //   // Draw the overlay image on top of the generated image
// //   mergedContext.drawImage(
// //     overlayImage,
// //     0,
// //     0,
// //     generatedImage.width,
// //     generatedImage.height
// //   );

// //   // Convert the merged canvas to Blob
// //   return new Promise((resolve) =>
// //     mergedCanvas.toBlob((blob) => resolve(blob), "image/png")
// //   );
// // };


// // Merge generated image and overlay into canvas
// const mergeWithOverlay = async (generatedImageUrl) => {
//   return new Promise(async (resolve, reject) => {
//     const canvas = canvasRef.current;
//     if (!canvas) {
//       reject(new Error("Canvas element not found"));
//       return;
//     }

//     const context = canvas.getContext("2d");
//     if (!context) {
//       reject(new Error("Failed to get canvas context"));
//       return;
//     }

//     try {
//       // Load generated and overlay images
//       const generatedImage = await loadOverlayImage(generatedImageUrl);
//       const overlayImage = await loadOverlayImage("/logo.png"); // Ensure the correct path to your overlay PNG

//       // Resize the canvas to the generated image's size
//       canvas.width = generatedImage.width;
//       canvas.height = generatedImage.height;

//       // Draw the generated image on canvas
//       context.drawImage(generatedImage, 0, 0, canvas.width, canvas.height);

//       // Draw the overlay image on top of the generated image
//       context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

//       // Convert the canvas to a Blob (image/png)
//       canvas.toBlob((blob) => {
//         if (blob) {
//           resolve(blob); // Return the merged image as a blob
//         } else {
//           reject(new Error("Canvas toBlob failed"));
//         }
//       }, "image/png");
//     } catch (error) {
//       reject(error);
//     }
//   });
// };




//   // Mouse or touch events for canvas drawing
//   const startDrawing = (x, y) => {
//     if (isDraggingImage) return;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.lineCap = "round"; // Makes the line round at the edges
//     context.lineJoin = "round"; // Smooth joins between lines
//     context.lineWidth = brushSize;
//     context.strokeStyle = eraserMode ? "#FFFFFF" : brushColor; // Eraser or brush color
//     context.beginPath();
//     context.moveTo(x, y);
//     setIsDrawing(true);
//   };

//   const draw = (x, y) => {
//     if (!isDrawing || isDraggingImage) return;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.lineTo(x, y);
//     context.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//     // saveCanvasState();
//   };

//   // Touch event handling for drawing
//   const handleTouchStart = (e) => {
//     const touch = e.touches[0];
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const x = touch.clientX - rect.left;
//     const y = touch.clientY - rect.top;
//     startDrawing(x, y);
//   };

//   const handleTouchMove = (e) => {
//     const touch = e.touches[0];
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const x = touch.clientX - rect.left;
//     const y = touch.clientY - rect.top;
//     draw(x, y);
//   };

//   const handleTouchEnd = () => {
//     stopDrawing();
//   };

//   // Mouse event handling for drawing
//   const handleMouseDown = (e) => {
//     const x = e.nativeEvent.offsetX;
//     const y = e.nativeEvent.offsetY;
//     startDrawing(x, y);
//   };

//   const handleMouseMove = (e) => {
//     const x = e.nativeEvent.offsetX;
//     const y = e.nativeEvent.offsetY;
//     draw(x, y);
//   };

//   const handleMouseUp = () => {
//     stopDrawing();
//   };

//   // Image drag and drop functionality for the image canvas (line art)
//   const handleImageDragStart = (mouseX, mouseY) => {
//     lineArtImages.forEach((image, index) => {
//       if (
//         mouseX >= image.position.x &&
//         mouseX <= image.position.x + image.size.width &&
//         mouseY >= image.position.y &&
//         mouseY <= image.position.y + image.size.height
//       ) {
//         setCurrentImageIndex(index);
//         setIsDraggingImage(true);
//         setDragOffset({
//           x: mouseX - image.position.x,
//           y: mouseY - image.position.y,
//         });
//       }
//     });
//   };

//   const handleMouseMoveImage = (e) => {
//     if (!isDraggingImage || currentImageIndex === null) return;
//     const mouseX = e.nativeEvent.offsetX;
//     const mouseY = e.nativeEvent.offsetY;
//     const updatedImages = [...lineArtImages];
//     updatedImages[currentImageIndex].position = {
//       x: mouseX - dragOffset.x,
//       y: mouseY - dragOffset.y,
//     };
//     setLineArtImages(updatedImages);
//   };

//   // Handle touch events for dragging images
//   const handleTouchStartImage = (e) => {
//     const touch = e.touches[0];
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = touch.clientX - rect.left;
//     const mouseY = touch.clientY - rect.top;
//     handleImageDragStart(mouseX, mouseY);
//   };

//   const handleTouchMoveImage = (e) => {
//     if (!isDraggingImage || currentImageIndex === null) return;
//     const touch = e.touches[0];
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = touch.clientX - rect.left;
//     const mouseY = touch.clientY - rect.top;
//     const updatedImages = [...lineArtImages];
//     updatedImages[currentImageIndex].position = {
//       x: mouseX - dragOffset.x,
//       y: mouseY - dragOffset.y,
//     };
//     setLineArtImages(updatedImages);
//   };

//   const handleTouchEndImage = () => {
//     setIsDraggingImage(false);
//   };

//   // Clear both canvases
//   const clearCanvas = () => {
//     const drawingCanvas = canvasRef.current;
//     const drawingContext = drawingCanvas.getContext("2d");
//     const imageCanvas = imageCanvasRef.current;
//     const imageContext = imageCanvas.getContext("2d");

//     drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
//     imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

//     setLineArtImages([]);
//     setFinalPrompt("");
//   };

//   // Add this function to merge both canvases
//   const mergeCanvases = () => {
//     const imageCanvas = imageCanvasRef.current;
//     const drawingCanvas = canvasRef.current;
//     const drawingContext = drawingCanvas.getContext("2d");

//     // Draw the imageCanvas content onto the drawingCanvas
//     drawingContext.drawImage(imageCanvas, 0, 0);
//   };

//   // // Convert canvas to Blob
//   // const canvasToBlob = async () => {
//   //   const canvas = canvasRef.current;
//   //   return new Promise((resolve) => {
//   //     canvas.toBlob((blob) => {
//   //       resolve(blob);
//   //     }, "image/png");
//   //   });
//   // };

//   // Convert canvas to Blob
//   const canvasToBlob = async () => {
//     const canvas = canvasRef.current;

//     // Check if the canvas exists before attempting to convert it to Blob
//     if (!canvas) {
//       console.error("Canvas not found!");
//       return null; // Exit early if canvas is null
//     }

//     return new Promise((resolve, reject) => {
//       canvas.toBlob((blob) => {
//         if (blob) {
//           resolve(blob);
//         } else {
//           reject(new Error("Canvas toBlob failed"));
//         }
//       }, "image/png");
//     });
//   };

//   // Fetch the image from a URL and convert it to Blob
//   const fetchImageBlob = async (imageUrl) => {
//     const response = await axios.get(imageUrl, { responseType: "blob" });
//     return response.data;
//   };

//   const uploadToSupabase = async (blob) => {
//     const fileName = `generated_${Date.now()}.png`; // Unique file name
//     const { data, error } = await supabase.storage
//       .from("images/gurgaon") // Ensure this is your bucket name
//       .upload(fileName, blob, {
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (error) {
//       console.error("Error uploading image:", error.message);
//       return null;
//     }

//     const publicURL = `https://dvomtdfgsaposxyigjbw.supabase.co/storage/v1/object/public/images/gurgaon/${fileName}`;
//     const { error: insertError } = await supabase
//       .from("images")
//       .insert([{ url: publicURL }]);

//     if (insertError) {
//       console.error("Insert error:", insertError);
//     }
//     return publicURL;
//   };

//   // // Handle sending the prompt, style, and image data to the FastAPI backend
//   const handleSubmit = async () => {
//     // Check if prompt and style are selected (re-enable validation)
//     if (!finalPrompt || !style) {
//       alert("Please select a sub-prompt, line art image, and a drawing style!");
//       return;
//     }

//     // Check if the user has remaining trials before proceeding
//     if (remainingTrials <= 0) {
//       alert("Trial limit reached! You cannot generate more images.");
//       return;
//     }

//     setLoading(true); // Start showing the loading screen

//     try {
//       // Convert the canvas to base64 for displaying in the result page
//       const canvas = canvasRef.current;

//       if (!canvas) {
//         console.error("Canvas not found!");
//         setLoading(false); // Debugging check
//         return;
//       }

//       mergeCanvases();

//       const canvasDrawingUrl = canvas.toDataURL("image/png"); // Get the canvas image as base64
//       console.log("Canvas Drawing URL:", canvasDrawingUrl); // Debugging check

//       // Get the MAC address of the user

//       console.log("Final Prompt:", finalPrompt);
//       // Send the canvas image and prompt data to the FastAPI backend
//       const imageBlob = await canvasToBlob();
//       if (!imageBlob) {
//         throw new Error("Failed to create Blob from canvas.");
//       }
//       const formData = new FormData();
//       formData.append("prompt", finalPrompt);
//       formData.append("style", style);
//       formData.append("image", imageBlob, "drawing.png"); // Sending image as a binary Blob

//       const response = await axios.post(
//         "https://king-prawn-app-js4z2.ondigitalocean.app/generate-image/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.status === "success") {
//         const imageUrl = response.data.image_url;

//         // Ensure the imageUrl has the correct format
//         const generatedUrl = imageUrl.startsWith("http")
//           ? imageUrl
//           : `https://king-prawn-app-js4z2.ondigitalocean.app/${imageUrl}`;
//         setGeneratedImageUrl(generatedUrl); // Set the URL of the generated image

//         // // Fetch the generated image as Blob from the backend URL
//         // const generatedImageBlob = await fetchImageBlob(generatedUrl);

//          // Merge with the overlay
//          const mergedImageBlob = await mergeWithOverlay(generatedUrl);


//         // Upload the fetched image Blob to Supabase
//         const supabaseUrl = await uploadToSupabase(mergedImageBlob);

//         // Set the URLs in the context **before** navigating
//         setCanvasDrawingUrl(canvasDrawingUrl);
//         setUploadedImageUrl(supabaseUrl);

//         if (supabaseUrl) {
//           console.log("Image uploaded to Supabase, URL:", supabaseUrl); // Debugging
//           console.log("Navigating to result page"); // Debugging before navigation

//           // Deduct a trial after successful image generation
//           const newTrialCount = remainingTrials - 1;
//           setRemainingTrials(newTrialCount);

//           // Update the remaining trials count in Supabase
//           await updateUserTrials(newTrialCount);

//           navigate("/result", {
//             state: { canvasDrawingUrl, uploadedImageUrl: supabaseUrl },
//           });
//           console.log("Navigation triggered"); // Debugging after navigation
//         }
//       } else {
//         console.error("Error:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePromptSelect = (selectedPrompt) => {
//     setPrompt(selectedPrompt);
//     switch (selectedPrompt) {
//       case "Sunset with Mountains":
//         setSubPrompts([
//           "Sunset with Mountains",
//           "Blooming in a Meadow",
//           "Snow-capped Peaks at Dawn",
//           "River with Cascading Waterfalls",
//           "Sunset with reflections",
//         ]);
//         break;
//       case "House":
//         setSubPrompts([
//           "With Moons and Asteroids",
//           "Spiral Galaxy with Stars",
//           "Colliding Galaxies",
//           "Docked at a Space Station",
//           "Galaxy with Star Trails",
//         ]);
//         break;
//       case "Automibile":
//         setSubPrompts([
//           "With a City Skyline",
//           "Racing on a track",
//           "With a Mountain Backdrop",
//           "In a Rustic Farmyard",
//           "Racing Through Urban Streets",
//         ]);
//         break;
//         case "Anime":
//           setSubPrompts([
//             "In a Neon-lit Cityscape",
//             "Battle in a Fantasy World",
//             "With Futuristic Vehicles",
//             "At a Lantern Festival",
//             "Hero with a Magic Sword",
//           ]);
//         break;
//       default:
//         setSubPrompts([]);
//     }
//     setSelectedSubPrompt(""); // Reset sub-prompt selection
//   };

//   // Handle selecting sub-prompt and updating the final prompt
//   const handleSubPromptSelect = (subPrompt) => {
//     setSelectedSubPrompt(subPrompt);
//   };

//   // Update the final prompt with the selected sub-prompt and all the line art text
//   const updateFinalPrompt = () => {
//     if (!selectedSubPrompt) return;

//     const lineArtText = lineArtImages.map((img) => img.text).join(" and ");
//     setFinalPrompt(`${lineArtText}, ${selectedSubPrompt}`);
//   };

//   // Handle selecting style
//   //   const handleStyleSelect = (style) => {
//   //     setStyle(style);
//   //   };

//   // Toggle eraser mode
//   const toggleEraser = () => {
//     setEraserMode(!eraserMode);
//   };

//   // Line art selection and placement
//   const handleLineArtSelect = (lineArt) => {
//     const canvas = imageCanvasRef.current;
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;

//     const newLineArt = {
//       src: lineArt.src,
//       text: lineArt.text,
//       position: { x: canvasWidth / 4, y: canvasHeight / 4 },
//       size: {
//         width: Math.random() * (canvasWidth / 4) + canvasWidth / 4,
//         height: Math.random() * (canvasHeight / 4) + canvasHeight / 4,
//       },
//     };

//     setLineArtImages([...lineArtImages, newLineArt]);
//   };

//   // Draw all line art images on the image canvas
//   const drawAllImages = () => {
//     const canvas = imageCanvasRef.current;
//     const context = canvas.getContext("2d");
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     lineArtImages.forEach((image) => {
//       const img = new Image();
//       img.src = image.src;
//       img.onload = () => {
//         context.drawImage(
//           img,
//           image.position.x,
//           image.position.y,
//           image.size.width,
//           image.size.height
//         );
//       };
//     });
//   };

//   // Handle dragging the image inside the canvas
//   const handleMouseDownImage = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     let imageFound = false;
//     lineArtImages.forEach((image, index) => {
//       if (
//         mouseX >= image.position.x &&
//         mouseX <= image.position.x + image.size.width &&
//         mouseY >= image.position.y &&
//         mouseY <= image.position.y + image.size.height
//       ) {
//         setCurrentImageIndex(index);
//         setIsDraggingImage(true);
//         setDragOffset({
//           x: mouseX - image.position.x,
//           y: mouseY - image.position.y,
//         });
//         imageFound = true;
//       }
//     });

//     // If no image is selected, deselect any current image
//     if (!imageFound) {
//       setCurrentImageIndex(null);
//     }
//   };

//   const handleMouseUpImage = () => {
//     setIsDraggingImage(false);
//   };

//   // Handle resizing the image
//   const handleResizeImage = (e) => {
//     if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
//     const updatedImages = [...lineArtImages];
//     const newSize = parseInt(e.target.value, 10);
//     updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
//     setLineArtImages(updatedImages);
//   };

//   // Handle deleting the selected image
//   const handleDeleteImage = () => {
//     if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
//     const updatedImages = [...lineArtImages];
//     updatedImages.splice(currentImageIndex, 1); // Remove the selected image
//     setLineArtImages(updatedImages); // Update the state
//     setCurrentImageIndex(null); // Deselect the image after deleting
//   };

//   // Automatically select the default prompt when the component loads
//   useEffect(() => {
//     handlePromptSelect("Sunset with Mountains"); // Set the default active prompt
//   }, []);

//   return (
//     <>
//       {loading && (
//         <div>
//           <video
//             src="02.mp4"
//             autoPlay
//             loop
//             muted
//             style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
//           ></video>
//         </div>
//       )}
//       {!loading && (
//         <div style={{ display: "block" }}>
//           {isMobileView ? (
//             <div className="mobileView">
//               <h2>For a better experience, please switch to a desktop view!</h2>
//             </div>
//           ) : (
//             <div className="mainContainer">
//               <h2 style={{ position:"absolute", top:"60px", right:"40px", color:"red" }}>Remaining Trials: {remainingTrials}</h2>
//               <div className="mainLeft">
//                 <div className="canvasContainer">

//                   <canvas
//                     ref={imageCanvasRef}
//                     width="1192"
//                     height="795"
//                     onMouseDown={(e) =>
//                       handleImageDragStart(
//                         e.nativeEvent.offsetX,
//                         e.nativeEvent.offsetY
//                       )
//                     }
//                     onMouseMove={handleMouseMoveImage}
//                     onMouseUp={handleMouseUpImage}
//                     className="canvasgg"
//                   ></canvas>
//                   <canvas
//                     ref={canvasRef}
//                     onMouseDown={(e) => {
//                       handleMouseDown(e);
//                       handleMouseDownImage(e);
//                     }}
//                     onMouseMove={(e) => {
//                       handleMouseMove(e);
//                       handleMouseMoveImage(e);
//                     }}
//                     onMouseUp={() => {
//                       handleMouseUp();
//                       handleMouseUpImage();
//                     }}
//                     onTouchStart={(e) => {
//                       handleTouchStart(e);
//                       handleTouchStartImage(e);
//                     }}
//                     onTouchMove={(e) => {
//                       handleTouchMove(e);
//                       handleTouchMoveImage(e);
//                     }}
//                     onTouchEnd={() => {
//                       handleTouchEnd();
//                       handleTouchEndImage();
//                     }}
//                     className="canvasff"
//                     width="1192"
//                     height="795"
//                   ></canvas>
//                 </div>
//                 <div className="downContainer">
//                   <div className="brushRest">
//                     <input
//                       type="range"
//                       min="1"
//                       max="5"
//                       value={brushSize}
//                       className="slider-thumb"
//                       onChange={(e) => setBrushSize(e.target.value)}
//                     />
//                   </div>
//                   <div className="bothGContainer">
//                     <button onClick={toggleEraser} className="brushButton">
//                       {eraserMode ? "Brush" : "Eraser"}
//                     </button>
//                     <button onClick={clearCanvas} className="resetButton">
//                       <img src="/public/e-icon.svg" alt="" />
//                       <p>Reset</p>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="mainRight">
//                 {/* Line Art Selector */}
//                 <LineArtSelector onLineArtSelect={handleLineArtSelect} />

//                 {/* Image Resize and Delete Controls */}
//                 <div className="imageResize-container">
//                   <h3>ADJUST SIZE</h3>
//                   <div className="imageResize-con">
//                     <div className="imageResige-002">
//                       <input
//                         type="range"
//                         min="50"
//                         max="500"
//                         value={
//                           currentImageIndex !== null &&
//                           lineArtImages[currentImageIndex]
//                             ? lineArtImages[currentImageIndex]?.size?.width ||
//                               100
//                             : 100 // Default to 100 when no image is selected
//                         }
//                         onChange={handleResizeImage}
//                         disabled={
//                           currentImageIndex === null ||
//                           !lineArtImages[currentImageIndex]
//                         } // Disable the input when no image is selected
//                       />
//                     </div>
//                     <div className="deletegg77">
//                       <button
//                         className="buttonGG-rf"
//                         onClick={handleDeleteImage}
//                         disabled={
//                           currentImageIndex === null ||
//                           !lineArtImages[currentImageIndex]
//                         } // Disable the button when no image is selected
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="clasgg-55"></div>
//                 {/* Prompt Selection */}
//                 <h2 className="clasgg-h2">SELECT THEME</h2>
//                 <div className="mainthemcont">
//                   <div>
//                     <div className="oggng">
//                       <div></div>
//                       <div
//                         onClick={() =>
//                           handlePromptSelect("Sunset with Mountains")
//                         }
//                         className="selecttheme-cc"
//                         style={{
//                           border:
//                             prompt === "Sunset with Mountains"
//                               ? "2px solid #000"
//                               : "1px solid #ccc",
//                           backgroundColor:
//                             prompt === "Sunset with Mountains"
//                               ? "#fff"
//                               : "transparent",
//                         }}
//                       >
//                         Nature
//                       </div>

//                       <div
//                         onClick={() => handlePromptSelect("House")}
//                         className="selecttheme-bb"
//                         style={{
//                           border:
//                             prompt === "House"
//                               ? "2px solid #000"
//                               : "1px solid #ccc",

//                           backgroundColor:
//                             prompt === "House"
//                               ? "#f0f0f0"
//                               : "transparent",
//                         }}
//                       >
//                         House
//                       </div>

//                       <div
//                         onClick={() => handlePromptSelect("Automibile")}
//                         className="selecttheme-aa"
//                         style={{
//                           border:
//                             prompt === "With a City Skyline"
//                               ? "2px solid #0F4ABA"
//                               : "1px solid #ccc",
//                           backgroundColor:
//                             prompt === "With a City Skyline"
//                               ? "#f0f0f0"
//                               : "transparent",
//                         }}
//                       >
//                         Automobile
//                       </div>
//                       <div
//                         onClick={() => handlePromptSelect("Anime")}
//                         className="selecttheme-dd"
//                         style={{
//                           border:
//                             prompt === "In a Neon-lit Cityscape"
//                               ? "2px solid #000"
//                               : "1px solid #ccc",
//                           backgroundColor:
//                             prompt === "In a Neon-lit Cityscape"
//                               ? "#f0f0f0"
//                               : "transparent",
//                         }}
//                       >
//                         Anime
//                       </div>
//                     </div>
//                   </div>

//                   {/* Show more options based on selected prompt */}
//                   {subPrompts.length > 0 && (
//                     <div className="sub-prompts-contaier-main">
//                       <div className="sub-prompts-contaier-ff">
//                         {subPrompts.map((subPrompt, index) => (
//                           <div
//                             key={index}
//                             onClick={() => setSelectedSubPrompt(subPrompt)}
//                             className="sub-prompts-oopp"
//                             style={{
//                               border:
//                                 selectedSubPrompt === subPrompt
//                                   ? "1px solid #0F4ABA"
//                                   : "0px solid #ccc",
//                               borderRadius:
//                                 selectedSubPrompt === subPrompt ? "7px" : "7px",

//                               backgroundColor:
//                                 selectedSubPrompt === subPrompt
//                                   ? "#EEEEEE"
//                                   : "#FBFBFB",
//                               color:
//                                 selectedSubPrompt === subPrompt
//                                   ? "#0F4ABA"
//                                   : "#0F4ABA",
//                               fontWeight:
//                                 selectedSubPrompt === subPrompt ? "700" : "500",
//                             }}
//                           >
//                             {subPrompt}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="whole-style-container">
//                   <h2>SELECT STYLE:</h2>

//                   <div className="style-container">
//                     {/* Style Button 1 */}
//                     <button
//                       onClick={() => handleStyleSelect("Fantasy Art")}
//                       style={{
//                         backgroundColor:
//                           selectedStyle === "Fantasy Art"
//                             ? "#fff"
//                             : "transparent", // Change color if selected
//                         color:
//                           selectedStyle === "Fantasy Art" ? "#000" : "#fff",
//                         transition: "background-color 0.3s ease", // Smooth background color transition
//                       }}
//                       className="button-g-ryt"
//                     >
//                       Fantasy Art
//                     </button>

//                     {/* Style Button 2 */}
//                     <button
//                       className="button-f-ryt"
//                       onClick={() => handleStyleSelect("Neon Punk")}
//                       style={{
//                         backgroundColor:
//                           selectedStyle === "Neon Punk"
//                             ? "#fff"
//                             : "transparent",
//                         color: selectedStyle === "Neon Punk" ? "#000" : "#fff",
//                         transition: "background-color 0.3s ease", // Smooth background color transition
//                       }}
//                     >
//                       Neon Punk
//                     </button>

//                     {/* Style Button 3 */}
//                     <button
//                       onClick={() => handleStyleSelect("Hyperrealism")}
//                       className="button-w-ryt"
//                       style={{
//                         backgroundColor:
//                           selectedStyle === "Hyperrealism"
//                             ? "#fff"
//                             : "transparent",
//                         color:
//                           selectedStyle === "Hyperrealism" ? "#000" : "#fff",
//                         transition: "background-color 0.3s ease", // Smooth background color transition
//                       }}
//                     >
//                       Hyperrealism
//                     </button>

//                     {/* Style Button 4 */}
//                     <button
//                       onClick={() => handleStyleSelect("Comic Book")}
//                       className="button-q-ryt"
//                       style={{
//                         backgroundColor:
//                           selectedStyle === "Comic Book"
//                             ? "#fff"
//                             : "transparent",
//                         color: selectedStyle === "Comic Book" ? "#000" : "#fff",
//                         transition: "background-color 0.3s ease", // Smooth background color transition
//                       }}
//                     >
//                       Comic Book
//                     </button>
//                   </div>
//                 </div>

//                 <div className="closedfgg"></div>

//                 {/* Submit Button */}
//                 <div className="fgrogf">
//                   <button onClick={handleSubmit} className="butoongft5" disabled={remainingTrials <= 0}>
//                     {loading ? "Generating..." : "Submit"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default DrawingApp;


import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient"; // Import Supabase client
import LineArtSelector from "./LineArtSelector"; // Import the LineArtSelector component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Loading from "./Loading";
import { ImageContext } from "../src/ImageContext";
import { useUser } from "@clerk/clerk-react";
const MAX_TRIALS = 3; // Maximum allowed trials

const DrawingApp = () => {
  const { user } = useUser(); // Fetch the user from Clerk
  const userId = user?.id; // Get user ID from Clerk
  console.log(userId)
  const canvasRef = useRef(null); // Drawing canvas
  const imageCanvasRef = useRef(null); // Image canvas

  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState("Sunset with Mountains"); // Selected text prompt
  const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
  const [selectedSubPrompt, setSelectedSubPrompt] = useState(""); // Final selected sub-prompt
  const [finalPrompt, setFinalPrompt] = useState(""); // Final prompt combining prompt + line art text
  const [style, setStyle] = useState("Fantasy Art"); // Default style
  const [brushColor, setBrushColor] = useState("#000"); // Default brush color (black)
  const [brushSize, setBrushSize] = useState(1); // Default brush size
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  // const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Supabase URL for the uploaded image
  const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode
  const [loading, setLoading] = useState(false);
  const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images
  const navigate = useNavigate(); // For navigation to result page
  const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
  const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized
  const [selectedStyle, setSelectedStyle] = useState("Fantasy Art"); // Track the selected style
  const [isMobileView, setIsMobileView] = useState(false); // Detect mobile view
  const handleStyleSelect = (style) => {
    setSelectedStyle(style); // Update the selected style
  };
  const { setCanvasDrawingUrl, setUploadedImageUrl } = useContext(ImageContext); // Use the context to store image URLs
  const [remainingTrials, setRemainingTrials] = useState(MAX_TRIALS);

  // Redraw the canvas when the position or size of any image changes
  useEffect(() => {
    drawAllImages();
  }, [lineArtImages]);


  useEffect(() => {
    if (userId) {
      fetchUserTrials(); // Fetch trials when the user ID is available
    }
  }, [userId]);

  useEffect(() => {
    updateFinalPrompt();
  }, [lineArtImages, selectedSubPrompt]);

  // Detect screen size and set isMobileView
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsMobileView(true);
      } else if (window.innerWidth <= 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    checkScreenSize(); // Check on initial render
    window.addEventListener("resize", checkScreenSize); // Listen for resize events
    return () => {
      window.removeEventListener("resize", checkScreenSize); // Cleanup listener
    };
  }, []);




  const fetchUserTrials = async () => {
    if (!userId) return; // Ensure user is logged in

    try {
      const { data, error } = await supabase
        .from("user_trials")
        .select("trial_count")
        .eq("user_id", userId) // Use the Clerk user ID here
        .single();

      if (error && error.code === "PGRST116") {
        // No record found, so insert a new record with MAX_TRIALS
        const { error: insertError } = await supabase
          .from("user_trials")
          .insert([{ user_id: userId, trial_count: MAX_TRIALS }]);

        if (insertError) {
          console.error("Error inserting user trials:", insertError);
          return;
        }

        setRemainingTrials(MAX_TRIALS); // Initialize trials
      } else if (data) {
        setRemainingTrials(data.trial_count); // Fetch and set remaining trials
      } else {
        console.error("Error fetching trials:", error);
      }
    } catch (err) {
      console.error("Error fetching trials:", err);
    }
  };


  const updateUserTrials = async (newTrialCount) => {
    if (!userId) return; // Ensure the user is logged in

    try {
      const { error } = await supabase
        .from("user_trials")
        .update({ trial_count: newTrialCount })
        .eq("user_id", userId); // Make sure to pass the correct userId

      if (error) {
        console.error("Error updating trials:", error);
      }
    } catch (err) {
      console.error("Error updating trials:", err);
    }
  };


  // Mouse or touch events for canvas drawing
  const startDrawing = (x, y) => {
    if (isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round"; // Makes the line round at the edges
    context.lineJoin = "round"; // Smooth joins between lines
    context.lineWidth = brushSize;
    context.strokeStyle = eraserMode ? "#FFFFFF" : brushColor; // Eraser or brush color
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (x, y) => {
    if (!isDrawing || isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // saveCanvasState();
  };

  // Touch event handling for drawing
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  // Mouse event handling for drawing
  const handleMouseDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    startDrawing(x, y);
  };

  const handleMouseMove = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    draw(x, y);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  // Image drag and drop functionality for the image canvas (line art)
  const handleImageDragStart = (mouseX, mouseY) => {
    lineArtImages.forEach((image, index) => {
      if (
        mouseX >= image.position.x &&
        mouseX <= image.position.x + image.size.width &&
        mouseY >= image.position.y &&
        mouseY <= image.position.y + image.size.height
      ) {
        setCurrentImageIndex(index);
        setIsDraggingImage(true);
        setDragOffset({
          x: mouseX - image.position.x,
          y: mouseY - image.position.y,
        });
      }
    });
  };

  const handleMouseMoveImage = (e) => {
    if (!isDraggingImage || currentImageIndex === null) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    const updatedImages = [...lineArtImages];
    updatedImages[currentImageIndex].position = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };
    setLineArtImages(updatedImages);
  };

  // Handle touch events for dragging images
  const handleTouchStartImage = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    handleImageDragStart(mouseX, mouseY);
  };

  const handleTouchMoveImage = (e) => {
    if (!isDraggingImage || currentImageIndex === null) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    const updatedImages = [...lineArtImages];
    updatedImages[currentImageIndex].position = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };
    setLineArtImages(updatedImages);
  };

  const handleTouchEndImage = () => {
    setIsDraggingImage(false);
  };

  // Clear both canvases
  const clearCanvas = () => {
    const drawingCanvas = canvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");
    const imageCanvas = imageCanvasRef.current;
    const imageContext = imageCanvas.getContext("2d");

    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    imageContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    setLineArtImages([]);
    setFinalPrompt("");
  };

  // Add this function to merge both canvases
  const mergeCanvases = () => {
    const imageCanvas = imageCanvasRef.current;
    const drawingCanvas = canvasRef.current;
    const drawingContext = drawingCanvas.getContext("2d");

    // Draw the imageCanvas content onto the drawingCanvas
    drawingContext.drawImage(imageCanvas, 0, 0);
  };

  // // Convert canvas to Blob
  // const canvasToBlob = async () => {
  //   const canvas = canvasRef.current;
  //   return new Promise((resolve) => {
  //     canvas.toBlob((blob) => {
  //       resolve(blob);
  //     }, "image/png");
  //   });
  // };

  // Convert canvas to Blob
  const canvasToBlob = async () => {
    const canvas = canvasRef.current;

    // Check if the canvas exists before attempting to convert it to Blob
    if (!canvas) {
      console.error("Canvas not found!");
      return null; // Exit early if canvas is null
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob failed"));
        }
      }, "image/png");
    });
  };

  // Fetch the image from a URL and convert it to Blob
  const fetchImageBlob = async (imageUrl) => {
    const response = await axios.get(imageUrl, { responseType: "blob" });
    return response.data;
  };

  const uploadToSupabase = async (blob) => {
    const fileName = `generated_${Date.now()}.png`; // Unique file name
    const { data, error } = await supabase.storage
      .from("images/gurgaon") // Ensure this is your bucket name
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const publicURL = `https://dvomtdfgsaposxyigjbw.supabase.co/storage/v1/object/public/images/gurgaon/${fileName}`;
    const { error: insertError } = await supabase
      .from("images")
      .insert([{ url: publicURL }]);

    if (insertError) {
      console.error("Insert error:", insertError);
    }
    return publicURL;
  };

  // // Handle sending the prompt, style, and image data to the FastAPI backend
  const handleSubmit = async () => {
    // Check if prompt and style are selected (re-enable validation)
    if (!finalPrompt || !style) {
      alert("Please select a sub-prompt, line art image, and a drawing style!");
      return;
    }

    // Check if the user has remaining trials before proceeding
    if (remainingTrials <= 0) {
      alert("Trial limit reached! You cannot generate more images.");
      return;
    }

    setLoading(true); // Start showing the loading screen

    try {
      // Convert the canvas to base64 for displaying in the result page
      const canvas = canvasRef.current;

      if (!canvas) {
        console.error("Canvas not found!");
        setLoading(false); // Debugging check
        return;
      }

      mergeCanvases();

      const canvasDrawingUrl = canvas.toDataURL("image/png"); // Get the canvas image as base64
      console.log("Canvas Drawing URL:", canvasDrawingUrl); // Debugging check

      // Get the MAC address of the user

      console.log("Final Prompt:", finalPrompt);
      // Send the canvas image and prompt data to the FastAPI backend
      const imageBlob = await canvasToBlob();
      if (!imageBlob) {
        throw new Error("Failed to create Blob from canvas.");
      }
      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("style", style);
      formData.append("image", imageBlob, "drawing.png"); // Sending image as a binary Blob

      const response = await axios.post(
        "https://walrus-app-cfdn6.ondigitalocean.app/generate-image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        const imageUrl = response.data.image_url;

        // Ensure the imageUrl has the correct format
        const generatedUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `https://walrus-app-cfdn6.ondigitalocean.app/${imageUrl}`;
        setGeneratedImageUrl(generatedUrl); // Set the URL of the generated image

        // Fetch the generated image as Blob from the backend URL
        const generatedImageBlob = await fetchImageBlob(generatedUrl);

        // Upload the fetched image Blob to Supabase
        const supabaseUrl = await uploadToSupabase(generatedImageBlob);

        // Set the URLs in the context **before** navigating
        setCanvasDrawingUrl(canvasDrawingUrl);

        setUploadedImageUrl(supabaseUrl);

        if (supabaseUrl) {
          console.log("Image uploaded to Supabase, URL:", supabaseUrl); // Debugging
          console.log("Navigating to result page"); // Debugging before navigation

          // Deduct a trial after successful image generation
          const newTrialCount = remainingTrials - 1;
          setRemainingTrials(newTrialCount);

          // Update the remaining trials count in Supabase
          await updateUserTrials(newTrialCount);

          navigate("/result", {
            state: { canvasDrawingUrl, uploadedImageUrl: supabaseUrl },
          });
          console.log("Navigation triggered"); // Debugging after navigation
        }
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    switch (selectedPrompt) {
      case "Sunset with Mountains":
        setSubPrompts([
          "Sunset with Mountains",
          "Blooming in a Meadow",
          "Snow-capped Peaks at Dawn",
          "River with Cascading Waterfalls",
          "Sunset with reflections",
        ]);
        break;
      case "House":
        setSubPrompts([
          "Modern House on a Cliffside",
          "Cottage in a Misty Forest",
          "Luxury Mansion by the Beach",
          "Skyscraper in a Busy Metropolis",
          "Skyscraper Piercing through the Clouds",
        ]);
        break;
      case "Automibile":
        setSubPrompts([
          "With a City Skyline",
          "Racing on a track",
          "With a Mountain Backdrop",
          "In a Rustic Farmyard",
          "Racing Through Urban Streets",
        ]);
        break;
      case "Anime":
        setSubPrompts([
          "In a Neon-lit Cityscape",
          "Battle in a Fantasy World",
          "With Futuristic Vehicles",
          "At a Lantern Festival",
          "Hero with a Magic Sword",
        ]);
        break;
      default:
        setSubPrompts([]);
    }
    setSelectedSubPrompt(""); // Reset sub-prompt selection
  };

  // Handle selecting sub-prompt and updating the final prompt
  const handleSubPromptSelect = (subPrompt) => {
    setSelectedSubPrompt(subPrompt);
  };

  // Update the final prompt with the selected sub-prompt and all the line art text
  const updateFinalPrompt = () => {
    if (!selectedSubPrompt) return;

    const lineArtText = lineArtImages.map((img) => img.text).join(" and ");
    setFinalPrompt(`${lineArtText}, ${selectedSubPrompt}`);
  };

  // Handle selecting style
  //   const handleStyleSelect = (style) => {
  //     setStyle(style);
  //   };

  // Toggle eraser mode
  const toggleEraser = () => {
    setEraserMode(!eraserMode);
  };

  // Line art selection and placement
  const handleLineArtSelect = (lineArt) => {
    const canvas = imageCanvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const newLineArt = {
      src: lineArt.src,
      text: lineArt.text,
      position: { x: canvasWidth / 4, y: canvasHeight / 4 },
      size: {
        width: Math.random() * (canvasWidth / 4) + canvasWidth / 4,
        height: Math.random() * (canvasHeight / 4) + canvasHeight / 4,
      },
    };

    setLineArtImages([...lineArtImages, newLineArt]);
  };

  // Draw all line art images on the image canvas
  const drawAllImages = () => {
    const canvas = imageCanvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    lineArtImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        context.drawImage(
          img,
          image.position.x,
          image.position.y,
          image.size.width,
          image.size.height
        );
      };
    });
  };

  // Handle dragging the image inside the canvas
  const handleMouseDownImage = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let imageFound = false;
    lineArtImages.forEach((image, index) => {
      if (
        mouseX >= image.position.x &&
        mouseX <= image.position.x + image.size.width &&
        mouseY >= image.position.y &&
        mouseY <= image.position.y + image.size.height
      ) {
        setCurrentImageIndex(index);
        setIsDraggingImage(true);
        setDragOffset({
          x: mouseX - image.position.x,
          y: mouseY - image.position.y,
        });
        imageFound = true;
      }
    });

    // If no image is selected, deselect any current image
    if (!imageFound) {
      setCurrentImageIndex(null);
    }
  };

  const handleMouseUpImage = () => {
    setIsDraggingImage(false);
  };

  // Handle resizing the image
  const handleResizeImage = (e) => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
    const updatedImages = [...lineArtImages];
    const newSize = parseInt(e.target.value, 10);
    updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
    setLineArtImages(updatedImages);
  };

  // Handle deleting the selected image
  const handleDeleteImage = () => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
    const updatedImages = [...lineArtImages];
    updatedImages.splice(currentImageIndex, 1); // Remove the selected image
    setLineArtImages(updatedImages); // Update the state
    setCurrentImageIndex(null); // Deselect the image after deleting
  };

  // Automatically select the default prompt when the component loads
  useEffect(() => {
    handlePromptSelect("Sunset with Mountains"); // Set the default active prompt
  }, []);

  return (
    <>
      {loading && (
        <div>
          <video
            src="02.mp4"
            autoPlay
            loop
            muted
            style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
          ></video>
        </div>
      )}
      {!loading && (
        <div style={{ display: "block" }}>
          {isMobileView ? (
            <div className="mobileView">
              <h2>For a better experience, please switch to a desktop view!</h2>
            </div>
          ) : (
            <div className="mainContainer">
              {/* <h2 style={{ position: "absolute", top: "60px", right: "40px", color: "#fff" }}>Trials: {remainingTrials}</h2> */}
              <div className="mainLeft">
                {/* <div className="canvasContainer">

                  <canvas
                    ref={imageCanvasRef}
                    width="1192"
                    height="795"
                    onMouseDown={(e) =>
                      handleImageDragStart(
                        e.nativeEvent.offsetX,
                        e.nativeEvent.offsetY
                      )
                    }
                    onMouseMove={handleMouseMoveImage}
                    onMouseUp={handleMouseUpImage}
                    className="canvasgg"
                  ></canvas>
                  <canvas
                    ref={canvasRef}
                    onMouseDown={(e) => {
                      handleMouseDown(e);
                      handleMouseDownImage(e);
                    }}
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      handleMouseMoveImage(e);
                    }}
                    onMouseUp={() => {
                      handleMouseUp();
                      handleMouseUpImage();
                    }}
                    onTouchStart={(e) => {
                      handleTouchStart(e);
                      handleTouchStartImage(e);
                    }}
                    onTouchMove={(e) => {
                      handleTouchMove(e);
                      handleTouchMoveImage(e);
                    }}
                    onTouchEnd={() => {
                      handleTouchEnd();
                      handleTouchEndImage();
                    }}
                    className="canvasff"
                    width="1192"
                    height="795"
                  ></canvas>
                </div> */}

                <div className="canvasContainer" style={{ position: "relative" }}>
                  {/* Logo Image */}
                  <img
                    src="/logo1.png"
                    alt="Logo"
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "100px",
                      width: "100px", // Adjust the size as needed
                      zIndex: 10, // Make sure it appears above the canvases
                    }}
                  />

                  <canvas
                    ref={imageCanvasRef}
                    width="1192"
                    height="795"
                    onMouseDown={(e) =>
                      handleImageDragStart(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                    }
                    onMouseMove={handleMouseMoveImage}
                    onMouseUp={handleMouseUpImage}
                    className="canvasgg"
                  ></canvas>

                  <canvas
                    ref={canvasRef}
                    onMouseDown={(e) => {
                      handleMouseDown(e);
                      handleMouseDownImage(e);
                    }}
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      handleMouseMoveImage(e);
                    }}
                    onMouseUp={() => {
                      handleMouseUp();
                      handleMouseUpImage();
                    }}
                    onTouchStart={(e) => {
                      handleTouchStart(e);
                      handleTouchStartImage(e);
                    }}
                    onTouchMove={(e) => {
                      handleTouchMove(e);
                      handleTouchMoveImage(e);
                    }}
                    onTouchEnd={() => {
                      handleTouchEnd();
                      handleTouchEndImage();
                    }}
                    className="canvasff"
                    width="1192"
                    height="795"
                  ></canvas>
                </div>

                <div className="downContainer">
                  <div className="brushRest">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={brushSize}
                      className="slider-thumb"
                      onChange={(e) => setBrushSize(e.target.value)}
                    />
                  </div>
                  <div className="bothGContainer">
                    <button onClick={toggleEraser} className="brushButton">
                      {eraserMode ? "Brush" : "Eraser"}
                    </button>
                    <button onClick={clearCanvas} className="resetButton">
                      <img src="/public/e-icon.svg" alt="" />
                      <p>Reset</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mainRight">
                {/* Line Art Selector */}
                <LineArtSelector onLineArtSelect={handleLineArtSelect} />

                {/* Image Resize and Delete Controls */}
                <div className="imageResize-container">
                  <h3>ADJUST SIZE</h3>
                  <div className="imageResize-con">
                    <div className="imageResige-002">
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={
                          currentImageIndex !== null &&
                            lineArtImages[currentImageIndex]
                            ? lineArtImages[currentImageIndex]?.size?.width ||
                            100
                            : 100 // Default to 100 when no image is selected
                        }
                        onChange={handleResizeImage}
                        disabled={
                          currentImageIndex === null ||
                          !lineArtImages[currentImageIndex]
                        } // Disable the input when no image is selected
                      />
                    </div>
                    <div className="deletegg77">
                      <button
                        className="buttonGG-rf"
                        onClick={handleDeleteImage}
                        disabled={
                          currentImageIndex === null ||
                          !lineArtImages[currentImageIndex]
                        } // Disable the button when no image is selected
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="clasgg-55"></div>
                {/* Prompt Selection */}
                <h2 className="clasgg-h2">SELECT THEME</h2>
                <div className="mainthemcont">
                  <div>
                    <div className="oggng">
                      <div></div>
                      <div
                        onClick={() =>
                          handlePromptSelect("Sunset with Mountains")
                        }
                        className="selecttheme-cc"
                        style={{
                          border:
                            prompt === "Sunset with Mountains"
                              ? "2px solid #fff"
                              : "1px solid #ccc",
                          backgroundColor:
                            prompt === "Sunset with Mountains"
                              ? "#D12028"
                              : "transparent",
                        }}
                      >
                        Nature
                      </div>

                      <div
                        onClick={() => handlePromptSelect("House")}
                        className="selecttheme-bb"
                        style={{
                          border:
                            prompt === "House"
                              ? "2px solid #fff"
                              : "1px solid #ccc",

                          backgroundColor:
                            prompt === "House"
                              ? "#D12028"
                              : "transparent",
                        }}
                      >
                        House/Skyscraper
                      </div>

                      <div
                        onClick={() => handlePromptSelect("Automibile")}
                        className="selecttheme-aa"
                        style={{
                          border:
                            prompt === "Automibile"
                              ? "2px solid #fff"
                              : "1px solid #ccc",
                          backgroundColor:
                            prompt === "Automibile"
                              ? "#D12028"
                              : "transparent",
                        }}
                      >
                        Automobile
                      </div>
                      <div
                        onClick={() => handlePromptSelect("Anime")}
                        className="selecttheme-dd"
                        style={{
                          border:
                            prompt === "Anime"
                              ? "2px solid #fff"
                              : "1px solid #ccc",
                          backgroundColor:
                            prompt === "Anime"
                              ? "#D12028"
                              : "transparent",
                        }}
                      >
                        Anime
                      </div>
                    </div>
                  </div>

                  {/* Show more options based on selected prompt */}
                  {subPrompts.length > 0 && (
                    <div className="sub-prompts-contaier-main">
                      <div className="sub-prompts-contaier-ff">
                        {subPrompts.map((subPrompt, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedSubPrompt(subPrompt)}
                            className="sub-prompts-oopp"
                            style={{
                              border:
                                selectedSubPrompt === subPrompt
                                  ? "1px solid #0F4ABA"
                                  : "0px solid #ccc",
                              borderRadius:
                                selectedSubPrompt === subPrompt ? "7px" : "7px",

                              backgroundColor:
                                selectedSubPrompt === subPrompt
                                  ? "#EEEEEE"
                                  : "#FBFBFB",
                              color:
                                selectedSubPrompt === subPrompt
                                  ? "#0F4ABA"
                                  : "#0F4ABA",
                              fontWeight:
                                selectedSubPrompt === subPrompt ? "700" : "500",
                            }}
                          >
                            {subPrompt}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="whole-style-container">
                  <h2>SELECT STYLE:</h2>

                  <div className="style-container">
                    {/* Style Button 1 */}
                    <button
                      onClick={() => handleStyleSelect("Fantasy Art")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Fantasy Art"
                            ? "#D12028"
                            : "transparent", // Change color if selected
                        color:
                          selectedStyle === "Fantasy Art" ? "#000" : "#fff",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                      className="button-g-ryt"
                    >
                      Fantasy Art
                    </button>

                    {/* Style Button 2 */}
                    <button
                      className="button-f-ryt"
                      onClick={() => handleStyleSelect("Neon Punk")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Neon Punk"
                            ? "#D12028"
                            : "transparent",
                        color: selectedStyle === "Neon Punk" ? "#000" : "#fff",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Neon Punk
                    </button>

                    {/* Style Button 3 */}
                    <button
                      onClick={() => handleStyleSelect("Hyperrealism")}
                      className="button-w-ryt"
                      style={{
                        backgroundColor:
                          selectedStyle === "Hyperrealism"
                            ? "#D12028"
                            : "transparent",
                        color:
                          selectedStyle === "Hyperrealism" ? "#000" : "#fff",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Hyperrealism
                    </button>

                    {/* Style Button 4 */}
                    <button
                      onClick={() => handleStyleSelect("Comic Book")}
                      className="button-q-ryt"
                      style={{
                        backgroundColor:
                          selectedStyle === "Comic Book"
                            ? "#D12028"
                            : "transparent",
                        color: selectedStyle === "Comic Book" ? "#000" : "#fff",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Comic Book
                    </button>
                  </div>
                </div>

                <div className="closedfgg"></div>

                {/* Submit Button */}
                <div className="fgrogf">
                  <button onClick={handleSubmit} className="butoongft5" disabled={remainingTrials <= 0}>
                    {loading ? "Generating..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DrawingApp;


