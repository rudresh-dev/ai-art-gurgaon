// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//     const [selectedSubPrompt, setSelectedSubPrompt] = useState(''); // Final selected sub-prompt
//     const [finalPrompt, setFinalPrompt] = useState(''); // Final prompt combining prompt + line art text
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//     const [draggedLineArt, setDraggedLineArt] = useState(null); // Store dragged line art image and associated text
//     const [isResizing, setIsResizing] = useState(false); // Resizing state
//     const [imageSize, setImageSize] = useState({ width: 100, height: 100 }); // Default image size
//     const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // Default image position
//     const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging

//     // Redraw the image when the position or size changes
//     useEffect(() => {
//         if (draggedLineArt) {
//             drawImage();
//         }
//     }, [imagePosition, imageSize]);

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
//         if (isDraggingImage || isResizing) return; // Do not draw while dragging/resizing
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineCap = "round"; // Makes the line round at the edges
//         context.lineJoin = "round"; // Smooth joins between lines
//         context.lineWidth = brushSize;
//         context.strokeStyle = eraserMode ? '#FFFFFF' : brushColor; // Eraser or brush color
//         context.beginPath();
//         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//     };

//     const draw = (e) => {
//         if (!isDrawing || isDraggingImage || isResizing) return;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         context.stroke();
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     // Clear the canvas
//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
//     };

//     // Convert canvas to Blob
//     const canvasToBlob = async () => {
//         const canvas = canvasRef.current;
//         return new Promise((resolve) => {
//             canvas.toBlob((blob) => {
//                 resolve(blob);
//             }, 'image/png');
//         });
//     };

//     // Handle sending the prompt, style, and image data to the FastAPI backend
//     const handleSubmit = async () => {
//         if (!finalPrompt || !style) {
//             alert("Please select a sub-prompt and line art image, and draw something on the canvas!");
//             return;
//         }

//          // Console log the final prompt
//          console.log("Final Prompt:", finalPrompt);

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', finalPrompt); // Use final prompt here
//         formData.append('style', style);
//         formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:8000/generate-image/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.status === 'success') {
//                 setGeneratedImageUrl(`http://localhost:8000/${response.data.image_url}`);
//             } else {
//                 console.error("Error:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle selecting main prompt and show more options
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//         // Set 5 more related prompts
//         switch (selectedPrompt) {
//             case 'Sunset over the mountains':
//                 setSubPrompts(['Sunset with clouds', 'Sunset with a river', 'Sunset with trees', 'Sunset with animals', 'Sunset with reflections']);
//                 break;
//             case 'A futuristic city':
//                 setSubPrompts(['City with flying cars', 'City with neon lights', 'City at night', 'City with robots', 'City with skyscrapers']);
//                 break;
//             case 'A serene beach':
//                 setSubPrompts(['Beach with palm trees', 'Beach with sunset', 'Beach with waves', 'Beach with people', 'Beach with boats']);
//                 break;
//             default:
//                 setSubPrompts([]);
//         }
//         setSelectedSubPrompt(''); // Reset sub-prompt selection
//         setFinalPrompt(''); // Reset the final prompt
//     };

//     // Handle selecting sub-prompt and updating the final prompt
//     const handleSubPromptSelect = (subPrompt) => {
//         setSelectedSubPrompt(subPrompt);
//         if (draggedLineArt) {
//             setFinalPrompt(`${draggedLineArt.text} with ${subPrompt}`); // Combine sub-prompt with line art text
//         } else {
//             setFinalPrompt(subPrompt);
//         }
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging) and set final prompt text
//     const handleLineArtSelect = (lineArt) => {
//         setDraggedLineArt(lineArt); // Set the dragged image and associated text
//         if (selectedSubPrompt) {
//             setFinalPrompt(`${selectedSubPrompt} ${lineArt.text}`); // Combine with already selected sub-prompt
//         }
//     };

//     // Draw the line art image on canvas
//     const drawImage = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         const img = new Image();
//         img.src = draggedLineArt?.src;
//         img.onload = () => {
//             context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
//             context.drawImage(img, imagePosition.x, imagePosition.y, imageSize.width, imageSize.height);
//         };
//     };

//     // Handle dragging the image inside the canvas
//     const handleMouseDownImage = (e) => {
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         // Check if the mouse is inside the image area
//         if (mouseX >= imagePosition.x && mouseX <= imagePosition.x + imageSize.width &&
//             mouseY >= imagePosition.y && mouseY <= imagePosition.y + imageSize.height) {
//             setIsDraggingImage(true);
//             setDragOffset({ x: mouseX - imagePosition.x, y: mouseY - imagePosition.y });
//         }
//     };

//     const handleMouseMoveImage = (e) => {
//         if (!isDraggingImage) return;
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;
//         setImagePosition({ x: mouseX - dragOffset.x, y: mouseY - dragOffset.y });
//     };

//     const handleMouseUpImage = () => {
//         setIsDraggingImage(false);
//     };

//     // Handle resizing the image
//     const handleResizeImage = (e) => {
//         setImageSize({ width: parseInt(e.target.value, 10), height: parseInt(e.target.value, 10) });
//     };

//     return (
//         <div>
//             <h1>Draw on the Canvas and Generate an Image</h1>

//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={(e) => {
//                     startDrawing(e);
//                     handleMouseDownImage(e);
//                 }}
//                 onMouseMove={(e) => {
//                     draw(e);
//                     handleMouseMoveImage(e);
//                 }}
//                 onMouseUp={() => {
//                     stopDrawing();
//                     handleMouseUpImage();
//                 }}
//                 width="500px"
//                 height="500px"
//                 style={{ border: '1px solid black', backgroundColor: 'white' }}
//             ></canvas>

//             {/* Brush Options */}
//             <div>
//                 <label>Brush Color: </label>
//                 <input
//                     type="color"
//                     value={brushColor}
//                     onChange={(e) => setBrushColor(e.target.value)}
//                     disabled={eraserMode} // Disable color picker when eraser is active
//                 />

//                 <label>Brush Size: </label>
//                 <input
//                     type="range"
//                     min="1"
//                     max="20"
//                     value={brushSize}
//                     onChange={(e) => setBrushSize(e.target.value)}
//                 />

//                 <button onClick={toggleEraser}>
//                     {eraserMode ? 'Switch to Brush' : 'Eraser'}
//                 </button>

//                 <button onClick={clearCanvas}>Clear Canvas</button>
//             </div>

//             {/* Line Art Selector */}
//             <LineArtSelector onLineArtSelect={handleLineArtSelect} />

//             {/* Image Resize Controls */}
//             {draggedLineArt && (
//                 <div>
//                     <h3>Resize the Image:</h3>
//                     <input
//                         type="range"
//                         min="50"
//                         max="300"
//                         value={imageSize.width}
//                         onChange={handleResizeImage}
//                     />
//                 </div>
//             )}

//             {/* Prompt Selection */}
//             <div>
//                 <h2>Select a Prompt:</h2>
//                 <div>
//                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

//             {/* Show more options based on prompt */}
//             {subPrompts.length > 0 && (
//                 <div>
//                     <h3>Select a Sub-Prompt:</h3>
//                     {subPrompts.map((subPrompt, index) => (
//                         <button key={index} onClick={() => handleSubPromptSelect(subPrompt)}>{subPrompt}</button>
//                     ))}
//                 </div>
//             )}

//             {/* Style Selection */}
//             <div>
//                 <h2>Select a Style:</h2>
//                 <div>
//                     <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
//                     <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
//                     <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
//                 </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//                 <button onClick={handleSubmit} disabled={loading}>
//                     {loading ? 'Generating...' : 'Generate Image'}
//                 </button>
//             </div>

//             {/* Display Generated Image */}
//             {generatedImageUrl && (
//                 <div>
//                     <h3>Generated Image:</h3>
//                     <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DrawingApp;

// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//     const [selectedSubPrompt, setSelectedSubPrompt] = useState(''); // Final selected sub-prompt
//     const [finalPrompt, setFinalPrompt] = useState(''); // Final prompt combining prompt + line art text
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//     const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images

//     const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
//     const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized

//     // Redraw the canvas when the position or size of any image changes
//     useEffect(() => {
//         drawAllImages();
//     }, [lineArtImages]);

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
//         if (isDraggingImage) return; // Do not draw while dragging images
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineCap = "round"; // Makes the line round at the edges
//         context.lineJoin = "round"; // Smooth joins between lines
//         context.lineWidth = brushSize;
//         context.strokeStyle = eraserMode ? '#FFFFFF' : brushColor; // Eraser or brush color
//         context.beginPath();
//         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//     };

//     const draw = (e) => {
//         if (!isDrawing || isDraggingImage) return;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         context.stroke();
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     // Clear the canvas
//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
//         setLineArtImages([]); // Clear all line art images
//     };

//     // Convert canvas to Blob
//     const canvasToBlob = async () => {
//         const canvas = canvasRef.current;
//         return new Promise((resolve) => {
//             canvas.toBlob((blob) => {
//                 resolve(blob);
//             }, 'image/png');
//         });
//     };

//     // Handle sending the prompt, style, and image data to the FastAPI backend
//     const handleSubmit = async () => {
//         if (!finalPrompt || !style) {
//             alert("Please select a sub-prompt and line art image, and draw something on the canvas!");
//             return;
//         }

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', finalPrompt); // Use final prompt here
//         formData.append('style', style);
//         formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:8000/generate-image/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.status === 'success') {
//                 setGeneratedImageUrl(`http://localhost:8000${response.data.image_url}`);
//             } else {
//                 console.error("Error:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle selecting main prompt and show more options
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//         // Set 5 more related prompts
//         switch (selectedPrompt) {
//             case 'Sunset over the mountains':
//                 setSubPrompts(['Sunset with clouds', 'Sunset with a river', 'Sunset with trees', 'Sunset with animals', 'Sunset with reflections']);
//                 break;
//             case 'A futuristic city':
//                 setSubPrompts(['City with flying cars', 'City with neon lights', 'City at night', 'City with robots', 'City with skyscrapers']);
//                 break;
//             case 'A serene beach':
//                 setSubPrompts(['Beach with palm trees', 'Beach with sunset', 'Beach with waves', 'Beach with people', 'Beach with boats']);
//                 break;
//             default:
//                 setSubPrompts([]);
//         }
//         setSelectedSubPrompt(''); // Reset sub-prompt selection
//         setFinalPrompt(''); // Reset the final prompt
//     };

//     // Handle selecting sub-prompt and updating the final prompt
//     const handleSubPromptSelect = (subPrompt) => {
//         setSelectedSubPrompt(subPrompt);
//         if (lineArtImages.length > 0) {
//             const text = lineArtImages.map(img => img.text).join(' and ');
//             setFinalPrompt(`${subPrompt} with ${text}`);
//         } else {
//             setFinalPrompt(subPrompt);
//         }
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging) and add it to the array of line art images
//     const handleLineArtSelect = (lineArt) => {
//         const newLineArt = {
//             src: lineArt.src,
//             text: lineArt.text,
//             position: { x: 50, y: 50 }, // Default position
//             size: { width: 100, height: 100 }, // Default size
//         };
//         setLineArtImages([...lineArtImages, newLineArt]); // Add new image to the list
//         setCurrentImageIndex(lineArtImages.length); // Automatically select the newly added image
//     };

//     // Draw all line art images on the canvas
//     const drawAllImages = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-drawing

//         lineArtImages.forEach(image => {
//             const img = new Image();
//             img.src = image.src;
//             img.onload = () => {
//                 context.drawImage(img, image.position.x, image.position.y, image.size.width, image.size.height);
//             };
//         });
//     };

//     // Handle dragging the image inside the canvas
//     const handleMouseDownImage = (e) => {
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         let imageFound = false;
//         lineArtImages.forEach((image, index) => {
//             if (
//                 mouseX >= image.position.x &&
//                 mouseX <= image.position.x + image.size.width &&
//                 mouseY >= image.position.y &&
//                 mouseY <= image.position.y + image.size.height
//             ) {
//                 setCurrentImageIndex(index);
//                 setIsDraggingImage(true);
//                 setDragOffset({ x: mouseX - image.position.x, y: mouseY - image.position.y });
//                 imageFound = true;
//             }
//         });

//         // If no image is selected, deselect any current image
//         if (!imageFound) {
//             setCurrentImageIndex(null);
//         }
//     };

//     const handleMouseMoveImage = (e) => {
//         if (!isDraggingImage || currentImageIndex === null) return;
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         const updatedImages = [...lineArtImages];
//         updatedImages[currentImageIndex].position = { x: mouseX - dragOffset.x, y: mouseY - dragOffset.y };
//         setLineArtImages(updatedImages);
//     };

//     const handleMouseUpImage = () => {
//         setIsDraggingImage(false);
//     };

//     // Handle resizing the image
//     const handleResizeImage = (e) => {
//         if (currentImageIndex === null) return;
//         const updatedImages = [...lineArtImages];
//         const newSize = parseInt(e.target.value, 10);
//         updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
//         setLineArtImages(updatedImages);
//     };

//     return (
//         <div>
//             <h1>Draw on the Canvas and Generate an Image</h1>

//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={(e) => {
//                     startDrawing(e);
//                     handleMouseDownImage(e);
//                 }}
//                 onMouseMove={(e) => {
//                     draw(e);
//                     handleMouseMoveImage(e);
//                 }}
//                 onMouseUp={() => {
//                     stopDrawing();
//                     handleMouseUpImage();
//                 }}
//                 width="500px"
//                 height="500px"
//                 style={{ border: '1px solid black', backgroundColor: 'white' }}
//             ></canvas>

//             {/* Brush Options */}
//             <div>
//                 <label>Brush Color: </label>
//                 <input
//                     type="color"
//                     value={brushColor}
//                     onChange={(e) => setBrushColor(e.target.value)}
//                     disabled={eraserMode} // Disable color picker when eraser is active
//                 />

//                 <label>Brush Size: </label>
//                 <input
//                     type="range"
//                     min="1"
//                     max="20"
//                     value={brushSize}
//                     onChange={(e) => setBrushSize(e.target.value)}
//                 />

//                 <button onClick={toggleEraser}>
//                     {eraserMode ? 'Switch to Brush' : 'Eraser'}
//                 </button>

//                 <button onClick={clearCanvas}>Clear Canvas</button>
//             </div>

//             {/* Line Art Selector */}
//             <LineArtSelector onLineArtSelect={handleLineArtSelect} />

//             {/* Image Resize Controls */}
//             {currentImageIndex !== null && (
//                 <div>
//                     <h3>Resize the Image:</h3>
//                     <input
//                         type="range"
//                         min="50"
//                         max="300"
//                         value={lineArtImages[currentImageIndex].size.width}
//                         onChange={handleResizeImage}
//                     />
//                 </div>
//             )}

//             {/* Prompt Selection */}
//             <div>
//                 <h2>Select a Prompt:</h2>
//                 <div>
//                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

//             {/* Show more options based on prompt */}
//             {subPrompts.length > 0 && (
//                 <div>
//                     <h3>Select a Sub-Prompt:</h3>
//                     {subPrompts.map((subPrompt, index) => (
//                         <button key={index} onClick={() => handleSubPromptSelect(subPrompt)}>{subPrompt}</button>
//                     ))}
//                 </div>
//             )}

//             {/* Style Selection */}
//             <div>
//                 <h2>Select a Style:</h2>
//                 <div>
//                     <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
//                     <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
//                     <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
//                 </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//                 <button onClick={handleSubmit} disabled={loading}>
//                     {loading ? 'Generating...' : 'Generate Image'}
//                 </button>
//             </div>

//             {/* Display Generated Image */}
//             {generatedImageUrl && (
//                 <div>
//                     <h3>Generated Image:</h3>
//                     <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DrawingApp;

// // properly working

// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//     const [selectedSubPrompt, setSelectedSubPrompt] = useState(''); // Final selected sub-prompt
//     const [finalPrompt, setFinalPrompt] = useState(''); // Final prompt combining prompt + line art text
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//     const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images

//     const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
//     const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized

//     // Redraw the canvas when the position or size of any image changes
//     useEffect(() => {
//         drawAllImages();
//     }, [lineArtImages]);

//     useEffect(() => {
//         updateFinalPrompt();
//     }, [lineArtImages, selectedSubPrompt]);

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
//         if (isDraggingImage) return; // Do not draw while dragging images
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineCap = "round"; // Makes the line round at the edges
//         context.lineJoin = "round"; // Smooth joins between lines
//         context.lineWidth = brushSize;
//         context.strokeStyle = eraserMode ? '#FFFFFF' : brushColor; // Eraser or brush color
//         context.beginPath();
//         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//     };

//     const draw = (e) => {
//         if (!isDrawing || isDraggingImage) return;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         context.stroke();
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     // Clear the canvas
//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
//         setLineArtImages([]); // Clear all line art images
//         setFinalPrompt(''); // Clear final prompt
//     };

//     // Convert canvas to Blob
//     const canvasToBlob = async () => {
//         const canvas = canvasRef.current;
//         return new Promise((resolve) => {
//             canvas.toBlob((blob) => {
//                 resolve(blob);
//             }, 'image/png');
//         });
//     };

//     // Handle sending the prompt, style, and image data to the FastAPI backend
//     const handleSubmit = async () => {
//         if (!finalPrompt || !style) {
//             alert("Please select a sub-prompt and line art image, and draw something on the canvas!");
//             return;
//         }

//          console.log("Final Prompt:", finalPrompt);

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', finalPrompt); // Use final prompt here
//         formData.append('style', style);
//         formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:8000/generate-image/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.status === 'success') {
//                 setGeneratedImageUrl(`http://localhost:8000$/{response.data.image_url}`);
//             } else {
//                 console.error("Error:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle selecting main prompt and show more options
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//         // Set 5 more related prompts
//         switch (selectedPrompt) {
//             case 'Sunset over the mountains':
//                 setSubPrompts(['Sunset with clouds', 'Sunset with a river', 'Sunset with trees', 'Sunset with animals', 'Sunset with reflections']);
//                 break;
//             case 'A futuristic city':
//                 setSubPrompts(['City with flying cars', 'City with neon lights', 'City at night', 'City with robots', 'City with skyscrapers']);
//                 break;
//             case 'A serene beach':
//                 setSubPrompts(['Beach with palm trees', 'Beach with sunset', 'Beach with waves', 'Beach with people', 'Beach with boats']);
//                 break;
//             default:
//                 setSubPrompts([]);
//         }
//         setSelectedSubPrompt(''); // Reset sub-prompt selection
//     };

//     // Handle selecting sub-prompt and updating the final prompt
//     const handleSubPromptSelect = (subPrompt) => {
//         setSelectedSubPrompt(subPrompt);
//     };

//     // Update the final prompt with the selected sub-prompt and all the line art text
//     const updateFinalPrompt = () => {
//         if (!selectedSubPrompt) return;

//         const lineArtText = lineArtImages.map(img => img.text).join(' and ');
//         setFinalPrompt(`${lineArtText} with ${selectedSubPrompt}`);
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging) and add it to the array of line art images
//     const handleLineArtSelect = (lineArt) => {
//         const newLineArt = {
//             src: lineArt.src,
//             text: lineArt.text,
//             position: { x: 50, y: 50 }, // Default position
//             size: { width: 100, height: 100 }, // Default size
//         };
//         setLineArtImages([...lineArtImages, newLineArt]); // Add new image to the list
//     };

//     // Draw all line art images on the canvas
//     const drawAllImages = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-drawing

//         lineArtImages.forEach(image => {
//             const img = new Image();
//             img.src = image.src;
//             img.onload = () => {
//                 context.drawImage(img, image.position.x, image.position.y, image.size.width, image.size.height);
//             };
//         });
//     };

//     // Handle dragging the image inside the canvas
//     const handleMouseDownImage = (e) => {
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         lineArtImages.forEach((image, index) => {
//             if (
//                 mouseX >= image.position.x &&
//                 mouseX <= image.position.x + image.size.width &&
//                 mouseY >= image.position.y &&
//                 mouseY <= image.position.y + image.size.height
//             ) {
//                 setCurrentImageIndex(index);
//                 setIsDraggingImage(true);
//                 setDragOffset({ x: mouseX - image.position.x, y: mouseY - image.position.y });
//             }
//         });
//     };

//     const handleMouseMoveImage = (e) => {
//         if (!isDraggingImage || currentImageIndex === null) return;
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         const updatedImages = [...lineArtImages];
//         updatedImages[currentImageIndex].position = { x: mouseX - dragOffset.x, y: mouseY - dragOffset.y };
//         setLineArtImages(updatedImages);
//     };

//     const handleMouseUpImage = () => {
//         setIsDraggingImage(false);
//     };

//     // Handle resizing the image
//     const handleResizeImage = (e) => {
//         if (currentImageIndex === null) return;
//         const updatedImages = [...lineArtImages];
//         const newSize = parseInt(e.target.value, 10);
//         updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
//         setLineArtImages(updatedImages);
//     };

//     return (
//         <div>
//             <h1>Draw on the Canvas and Generate an Image</h1>

//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={(e) => {
//                     startDrawing(e);
//                     handleMouseDownImage(e);
//                 }}
//                 onMouseMove={(e) => {
//                     draw(e);
//                     handleMouseMoveImage(e);
//                 }}
//                 onMouseUp={() => {
//                     stopDrawing();
//                     handleMouseUpImage();
//                 }}
//                 width="500px"
//                 height="500px"
//                 style={{ border: '1px solid black', backgroundColor: 'white' }}
//             ></canvas>

//             {/* Brush Options */}
//             <div>
//                 <label>Brush Color: </label>
//                 <input
//                     type="color"
//                     value={brushColor}
//                     onChange={(e) => setBrushColor(e.target.value)}
//                     disabled={eraserMode} // Disable color picker when eraser is active
//                 />

//                 <label>Brush Size: </label>
//                 <input
//                     type="range"
//                     min="1"
//                     max="20"
//                     value={brushSize}
//                     onChange={(e) => setBrushSize(e.target.value)}
//                 />

//                 <button onClick={toggleEraser}>
//                     {eraserMode ? 'Switch to Brush' : 'Eraser'}
//                 </button>

//                 <button onClick={clearCanvas}>Clear Canvas</button>
//             </div>

//             {/* Line Art Selector */}
//             <LineArtSelector onLineArtSelect={handleLineArtSelect} />

//             {/* Image Resize Controls */}
//             {currentImageIndex !== null && (
//                 <div>
//                     <h3>Resize the Image:</h3>
//                     <input
//                         type="range"
//                         min="50"
//                         max="300"
//                         value={lineArtImages[currentImageIndex].size.width}
//                         onChange={handleResizeImage}
//                     />
//                 </div>
//             )}

//             {/* Prompt Selection */}
//             <div>
//                 <h2>Select a Prompt:</h2>
//                 <div>
//                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

//             {/* Show more options based on prompt */}
//             {subPrompts.length > 0 && (
//                 <div>
//                     <h3>Select a Sub-Prompt:</h3>
//                     {subPrompts.map((subPrompt, index) => (
//                         <button key={index} onClick={() => handleSubPromptSelect(subPrompt)}>{subPrompt}</button>
//                     ))}
//                 </div>
//             )}

//             {/* Style Selection */}
//             <div>
//                 <h2>Select a Style:</h2>
//                 <div>
//                     <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
//                     <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
//                     <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
//                 </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//                 <button onClick={handleSubmit} disabled={loading}>
//                     {loading ? 'Generating...' : 'Generate Image'}
//                 </button>
//             </div>

//             {/* Display Generated Image */}
//             {generatedImageUrl && (
//                 <div>
//                     <h3>Generated Image:</h3>
//                     <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DrawingApp;

// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//     const [selectedSubPrompt, setSelectedSubPrompt] = useState(''); // Final selected sub-prompt
//     const [finalPrompt, setFinalPrompt] = useState(''); // Final prompt combining prompt + line art text
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//     const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images

//     const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
//     const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized

//     // Redraw the canvas when the position or size of any image changes
//     useEffect(() => {
//         drawAllImages();
//     }, [lineArtImages]);

//     useEffect(() => {
//         updateFinalPrompt();
//     }, [lineArtImages, selectedSubPrompt]);

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
//         if (isDraggingImage) return; // Do not draw while dragging images
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineCap = "round"; // Makes the line round at the edges
//         context.lineJoin = "round"; // Smooth joins between lines
//         context.lineWidth = brushSize;
//         context.strokeStyle = eraserMode ? '#FFFFFF' : brushColor; // Eraser or brush color
//         context.beginPath();
//         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//     };

//     const draw = (e) => {
//         if (!isDrawing || isDraggingImage) return;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         context.stroke();
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     // Clear the canvas
//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
//         setLineArtImages([]); // Clear all line art images
//         setFinalPrompt(''); // Clear final prompt
//     };

//     // Convert canvas to Blob
//     const canvasToBlob = async () => {
//         const canvas = canvasRef.current;
//         return new Promise((resolve) => {
//             canvas.toBlob((blob) => {
//                 resolve(blob);
//             }, 'image/png');
//         });
//     };

//     // Handle sending the prompt, style, and image data to the FastAPI backend
//     const handleSubmit = async () => {
//         if (!finalPrompt || !style) {
//             alert("Please select a sub-prompt and line art image, and draw something on the canvas!");
//             return;
//         }

//         console.log("Final Prompt:", finalPrompt);

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', finalPrompt); // Use final prompt here
//         formData.append('style', style);
//         formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:8000/generate-image/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.status === 'success') {
//                 setGeneratedImageUrl(`http://127.0.0.1:8000/output/output_image.png`);
//             } else {
//                 console.error("Error:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle selecting main prompt and show more options
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//         // Set 5 more related prompts
//         switch (selectedPrompt) {
//             case 'Sunset over the mountains':
//                 setSubPrompts(['Sunset with clouds', 'Sunset with a river', 'Sunset with trees', 'Sunset with animals', 'Sunset with reflections']);
//                 break;
//             case 'A futuristic city':
//                 setSubPrompts(['City with flying cars', 'City with neon lights', 'City at night', 'City with robots', 'City with skyscrapers']);
//                 break;
//             case 'A serene beach':
//                 setSubPrompts(['Beach with palm trees', 'Beach with sunset', 'Beach with waves', 'Beach with people', 'Beach with boats']);
//                 break;
//             default:
//                 setSubPrompts([]);
//         }
//         setSelectedSubPrompt(''); // Reset sub-prompt selection
//     };

//     // Handle selecting sub-prompt and updating the final prompt
//     const handleSubPromptSelect = (subPrompt) => {
//         setSelectedSubPrompt(subPrompt);
//     };

//     // Update the final prompt with the selected sub-prompt and all the line art text
//     const updateFinalPrompt = () => {
//         if (!selectedSubPrompt) return;

//         const lineArtText = lineArtImages.map(img => img.text).join(' and ');
//         setFinalPrompt(`${selectedSubPrompt} with ${lineArtText}`);
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging) and add it to the array of line art images
//     const handleLineArtSelect = (lineArt) => {
//         const newLineArt = {
//             src: lineArt.src,
//             text: lineArt.text,
//             position: { x: 50, y: 50 }, // Default position
//             size: { width: 100, height: 100 }, // Default size
//         };
//         setLineArtImages([...lineArtImages, newLineArt]); // Add new image to the list
//     };

//     // Draw all line art images on the canvas
//     const drawAllImages = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-drawing

//         lineArtImages.forEach(image => {
//             const img = new Image();
//             img.src = image.src;
//             img.onload = () => {
//                 context.drawImage(img, image.position.x, image.position.y, image.size.width, image.size.height);
//             };
//         });
//     };

//     // Handle dragging the image inside the canvas
//     const handleMouseDownImage = (e) => {
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         let imageFound = false;
//         lineArtImages.forEach((image, index) => {
//             if (
//                 mouseX >= image.position.x &&
//                 mouseX <= image.position.x + image.size.width &&
//                 mouseY >= image.position.y &&
//                 mouseY <= image.position.y + image.size.height
//             ) {
//                 setCurrentImageIndex(index);
//                 setIsDraggingImage(true);
//                 setDragOffset({ x: mouseX - image.position.x, y: mouseY - image.position.y });
//                 imageFound = true;
//             }
//         });

//         // If no image is selected, deselect any current image
//         if (!imageFound) {
//             setCurrentImageIndex(null);
//         }
//     };

//     const handleMouseMoveImage = (e) => {
//         if (!isDraggingImage || currentImageIndex === null) return;
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         const updatedImages = [...lineArtImages];
//         updatedImages[currentImageIndex].position = { x: mouseX - dragOffset.x, y: mouseY - dragOffset.y };
//         setLineArtImages(updatedImages);
//     };

//     const handleMouseUpImage = () => {
//         setIsDraggingImage(false);
//     };

//     // Handle resizing the image
//     const handleResizeImage = (e) => {
//         if (currentImageIndex === null) return;
//         const updatedImages = [...lineArtImages];
//         const newSize = parseInt(e.target.value, 10);
//         updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
//         setLineArtImages(updatedImages);
//     };

//     // Handle deleting the selected image
//     const handleDeleteImage = () => {
//         if (currentImageIndex === null) return;
//         const updatedImages = [...lineArtImages];
//         updatedImages.splice(currentImageIndex, 1); // Remove the selected image
//         setLineArtImages(updatedImages); // Update the state
//         setCurrentImageIndex(null); // Deselect the image after deleting
//     };

//     return (
//         <div>
//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={(e) => {
//                     startDrawing(e);
//                     handleMouseDownImage(e);
//                 }}
//                 onMouseMove={(e) => {
//                     draw(e);
//                     handleMouseMoveImage(e);
//                 }}
//                 onMouseUp={() => {
//                     stopDrawing();
//                     handleMouseUpImage();
//                 }}
//                 width="500px"
//                 height="500px"
//                 style={{ border: '1px solid black', backgroundColor: 'white' }}
//             ></canvas>

//             {/* Brush Options */}
//             <div>
//                 <label>Brush Color: </label>
//                 <input
//                     type="color"
//                     value={brushColor}
//                     onChange={(e) => setBrushColor(e.target.value)}
//                     disabled={eraserMode} // Disable color picker when eraser is active
//                 />

//                 <label>Brush Size: </label>
//                 <input
//                     type="range"
//                     min="1"
//                     max="20"
//                     value={brushSize}
//                     onChange={(e) => setBrushSize(e.target.value)}
//                 />

//                 <button onClick={toggleEraser}>
//                     {eraserMode ? 'Switch to Brush' : 'Eraser'}
//                 </button>

//                 <button onClick={clearCanvas}>Clear Canvas</button>
//             </div>

//             {/* Line Art Selector */}
//             <LineArtSelector onLineArtSelect={handleLineArtSelect} />

//             {/* Image Resize and Delete Controls */}
//             {currentImageIndex !== null && (
//                 <div>
//                     <h3>Resize or Delete the Image:</h3>
//                     <input
//                         type="range"
//                         min="50"
//                         max="300"
//                         value={lineArtImages[currentImageIndex].size.width}
//                         onChange={handleResizeImage}
//                     />
//                     <button onClick={handleDeleteImage}>Delete Image</button>
//                 </div>
//             )}

//             {/* Prompt Selection */}
//             <div>

//                 <div>
//                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

//             {/* Show more options based on prompt */}
//             {subPrompts.length > 0 && (
//                 <div>
//                     {subPrompts.map((subPrompt, index) => (
//                         <button key={index} onClick={() => handleSubPromptSelect(subPrompt)}>{subPrompt}</button>
//                     ))}
//                 </div>
//             )}

//             {/* Style Selection */}
//             <div>
//                 <div>
//                     <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
//                     <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
//                     <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
//                 </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//                 <button onClick={handleSubmit} disabled={loading}>
//                     {loading ? 'Generating...' : 'Generate Image'}
//                 </button>
//             </div>

//             {/* Display Generated Image */}
//             {generatedImageUrl && (
//                 <div>
//                     <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DrawingApp;

// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import { supabase } from '../supabaseClient'; // Import Supabase client
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//     const [selectedSubPrompt, setSelectedSubPrompt] = useState(''); // Final selected sub-prompt
//     const [finalPrompt, setFinalPrompt] = useState(''); // Final prompt combining prompt + line art text
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // Store the Supabase URL for the uploaded image
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//     const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images

//     const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
//     const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized

//     // Redraw the canvas when the position or size of any image changes
//     useEffect(() => {
//         drawAllImages();
//     }, [lineArtImages]);

//     useEffect(() => {
//         updateFinalPrompt();
//     }, [lineArtImages, selectedSubPrompt]);

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
//         if (isDraggingImage) return; // Do not draw while dragging images
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineCap = "round"; // Makes the line round at the edges
//         context.lineJoin = "round"; // Smooth joins between lines
//         context.lineWidth = brushSize;
//         context.strokeStyle = eraserMode ? '#FFFFFF' : brushColor; // Eraser or brush color
//         context.beginPath();
//         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//     };

//     const draw = (e) => {
//         if (!isDrawing || isDraggingImage) return;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         context.stroke();
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     // Clear the canvas
//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
//         setLineArtImages([]); // Clear all line art images
//         setFinalPrompt(''); // Clear final prompt
//     };

//     // Convert canvas to Blob
//     const canvasToBlob = async () => {
//         const canvas = canvasRef.current;
//         return new Promise((resolve) => {
//             canvas.toBlob((blob) => {
//                 resolve(blob);
//             }, 'image/png');
//         });
//     };

//     // Upload image to Supabase storage
//     const uploadToSupabase = async (blob) => {
//         const fileName = `generated_${Date.now()}.png`; // Unique file name
//         const { data, error } = await supabase.storage
//             .from('images') // Ensure this is your bucket name
//             .upload(fileName, blob, {
//                 cacheControl: '3600',
//                 upsert: false
//             });

//         if (error) {
//             console.error('Error uploading image:', error.message);
//             return null;
//         }

//         // Get the public URL of the uploaded image
//         const { publicURL } = supabase.storage.from('images').getPublicUrl(fileName);
//         return publicURL;
//     };

//     // Handle sending the prompt, style, and image data to the FastAPI backend
//     const handleSubmit = async () => {
//         if (!finalPrompt || !style) {
//             alert("Please select a sub-prompt and line art image, and draw something on the canvas!");
//             return;
//         }

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', finalPrompt); // Use final prompt here
//         formData.append('style', style);
//         formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:8000/generate-image/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.status === 'success') {
//                 setGeneratedImageUrl(`http://localhost:8000/${response.data.image_url}`);

//                 // Upload the generated image to Supabase after receiving it
//                 const supabaseUrl = await uploadToSupabase(imageBlob);

//                 if (supabaseUrl) {
//                     setUploadedImageUrl(supabaseUrl); // Set the uploaded image URL
//                 }
//             } else {
//                 console.error("Error:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle selecting main prompt and show more options
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//         // Set 5 more related prompts
//         switch (selectedPrompt) {
//             case 'Sunset over the mountains':
//                 setSubPrompts(['Sunset with clouds', 'Sunset with a river', 'Sunset with trees', 'Sunset with animals', 'Sunset with reflections']);
//                 break;
//             case 'A futuristic city':
//                 setSubPrompts(['City with flying cars', 'City with neon lights', 'City at night', 'City with robots', 'City with skyscrapers']);
//                 break;
//             case 'A serene beach':
//                 setSubPrompts(['Beach with palm trees', 'Beach with sunset', 'Beach with waves', 'Beach with people', 'Beach with boats']);
//                 break;
//             default:
//                 setSubPrompts([]);
//         }
//         setSelectedSubPrompt(''); // Reset sub-prompt selection
//     };

//     // Handle selecting sub-prompt and updating the final prompt
//     const handleSubPromptSelect = (subPrompt) => {
//         setSelectedSubPrompt(subPrompt);
//     };

//     // Update the final prompt with the selected sub-prompt and all the line art text
//     const updateFinalPrompt = () => {
//         if (!selectedSubPrompt) return;

//         const lineArtText = lineArtImages.map(img => img.text).join(' and ');
//         setFinalPrompt(`${selectedSubPrompt} with ${lineArtText}`);
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging) and add it to the array of line art images
//     const handleLineArtSelect = (lineArt) => {
//         const newLineArt = {
//             src: lineArt.src,
//             text: lineArt.text,
//             position: { x: 50, y: 50 }, // Default position
//             size: { width: 100, height: 100 }, // Default size
//         };
//         setLineArtImages([...lineArtImages, newLineArt]); // Add new image to the list
//     };

//     // Draw all line art images on the canvas
//     const drawAllImages = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-drawing

//         lineArtImages.forEach(image => {
//             const img = new Image();
//             img.src = image.src;
//             img.onload = () => {
//                 context.drawImage(img, image.position.x, image.position.y, image.size.width, image.size.height);
//             };
//         });
//     };

//     // Handle dragging the image inside the canvas
//     const handleMouseDownImage = (e) => {
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         let imageFound = false;
//         lineArtImages.forEach((image, index) => {
//             if (
//                 mouseX >= image.position.x &&
//                 mouseX <= image.position.x + image.size.width &&
//                 mouseY >= image.position.y &&
//                 mouseY <= image.position.y + image.size.height
//             ) {
//                 setCurrentImageIndex(index);
//                 setIsDraggingImage(true);
//                 setDragOffset({ x: mouseX - image.position.x, y: mouseY - image.position.y });
//                 imageFound = true;
//             }
//         });

//         // If no image is selected, deselect any current image
//         if (!imageFound) {
//             setCurrentImageIndex(null);
//         }
//     };

//     const handleMouseMoveImage = (e) => {
//         if (!isDraggingImage || currentImageIndex === null) return;
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         const updatedImages = [...lineArtImages];
//         updatedImages[currentImageIndex].position = { x: mouseX - dragOffset.x, y: mouseY - dragOffset.y };
//         setLineArtImages(updatedImages);
//     };

//     const handleMouseUpImage = () => {
//         setIsDraggingImage(false);
//     };

//     // Handle resizing the image
//     const handleResizeImage = (e) => {
//         if (currentImageIndex === null) return;
//         const updatedImages = [...lineArtImages];
//         const newSize = parseInt(e.target.value, 10);
//         updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
//         setLineArtImages(updatedImages);
//     };

//     // Handle deleting the selected image
//     const handleDeleteImage = () => {
//         if (currentImageIndex === null) return;
//         const updatedImages = [...lineArtImages];
//         updatedImages.splice(currentImageIndex, 1); // Remove the selected image
//         setLineArtImages(updatedImages); // Update the state
//         setCurrentImageIndex(null); // Deselect the image after deleting
//     };

//     return (
//         <div>
//             <h1>Draw on the Canvas and Generate an Image</h1>

//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={(e) => {
//                     startDrawing(e);
//                     handleMouseDownImage(e);
//                 }}
//                 onMouseMove={(e) => {
//                     draw(e);
//                     handleMouseMoveImage(e);
//                 }}
//                 onMouseUp={() => {
//                     stopDrawing();
//                     handleMouseUpImage();
//                 }}
//                 width="500px"
//                 height="500px"
//                 style={{ border: '1px solid black', backgroundColor: 'white' }}
//             ></canvas>

//             {/* Brush Options */}
//             <div>
//                 <label>Brush Color: </label>
//                 <input
//                     type="color"
//                     value={brushColor}
//                     onChange={(e) => setBrushColor(e.target.value)}
//                     disabled={eraserMode} // Disable color picker when eraser is active
//                 />

//                 <label>Brush Size: </label>
//                 <input
//                     type="range"
//                     min="1"
//                     max="20"
//                     value={brushSize}
//                     onChange={(e) => setBrushSize(e.target.value)}
//                 />

//                 <button onClick={toggleEraser}>
//                     {eraserMode ? 'Switch to Brush' : 'Eraser'}
//                 </button>

//                 <button onClick={clearCanvas}>Clear Canvas</button>
//             </div>

//             {/* Line Art Selector */}
//             <LineArtSelector onLineArtSelect={handleLineArtSelect} />

//             {/* Image Resize and Delete Controls */}
//             {currentImageIndex !== null && (
//                 <div>
//                     <h3>Resize or Delete the Image:</h3>
//                     <input
//                         type="range"
//                         min="50"
//                         max="300"
//                         value={lineArtImages[currentImageIndex].size.width}
//                         onChange={handleResizeImage}
//                     />
//                     <button onClick={handleDeleteImage}>Delete Image</button>
//                 </div>
//             )}

//             {/* Prompt Selection */}
//             <div>
//                 <h2>Select a Prompt:</h2>
//                 <div>
//                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

//             {/* Show more options based on prompt */}
//             {subPrompts.length > 0 && (
//                 <div>
//                     <h3>Select a Sub-Prompt:</h3>
//                     {subPrompts.map((subPrompt, index) => (
//                         <button key={index} onClick={() => handleSubPromptSelect(subPrompt)}>{subPrompt}</button>
//                     ))}
//                 </div>
//             )}

//             {/* Style Selection */}
//             <div>
//                 <h2>Select a Style:</h2>
//                 <div>
//                     <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
//                     <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
//                     <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
//                 </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//                 <button onClick={handleSubmit} disabled={loading}>
//                     {loading ? 'Generating...' : 'Generate Image'}
//                 </button>
//             </div>

//             {/* Display Generated Image */}
//             {generatedImageUrl && (
//                 <div>
//                     <h3>Generated Image:</h3>
//                     <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
//                 </div>
//             )}

//             {/* Display Uploaded Image */}
//             {uploadedImageUrl && (
//                 <div>
//                     <h3>Uploaded Image to Supabase:</h3>
//                     <img src={uploadedImageUrl} alt="Uploaded Art" style={{ width: '500px', height: '500px' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DrawingApp;

// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import { supabase } from "../supabaseClient"; // Import Supabase client
// import LineArtSelector from "./LineArtSelector"; // Import the LineArtSelector component

// const DrawingApp = () => {
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [prompt, setPrompt] = useState(""); // Selected text prompt
//   const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
//   const [selectedSubPrompt, setSelectedSubPrompt] = useState(""); // Final selected sub-prompt
//   const [finalPrompt, setFinalPrompt] = useState(""); // Final prompt combining prompt + line art text
//   const [style, setStyle] = useState("Fantasy Art"); // Default style
//   const [brushColor, setBrushColor] = useState("#000000"); // Default brush color (black)
//   const [brushSize, setBrushSize] = useState(5); // Default brush size
//   const [loading, setLoading] = useState(false);
//   const [generatedImageUrl, setGeneratedImageUrl] = useState("");
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Supabase URL for the uploaded image
//   const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//   const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images

//   const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
//   const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized

//   // Redraw the canvas when the position or size of any image changes
//   useEffect(() => {
//     drawAllImages();
//   }, [lineArtImages]);

//   useEffect(() => {
//     updateFinalPrompt();
//   }, [lineArtImages, selectedSubPrompt]);

//   // Mouse events for canvas drawing
//   const startDrawing = (e) => {
//     if (isDraggingImage) return; // Do not draw while dragging images
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.lineCap = "round"; // Makes the line round at the edges
//     context.lineJoin = "round"; // Smooth joins between lines
//     context.lineWidth = brushSize;
//     context.strokeStyle = eraserMode ? "#FFFFFF" : brushColor; // Eraser or brush color
//     context.beginPath();
//     context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     setIsDrawing(true);
//   };

//   const draw = (e) => {
//     if (!isDrawing || isDraggingImage) return;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     context.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   // Clear the canvas
//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
//     setLineArtImages([]); // Clear all line art images
//     setFinalPrompt(""); // Clear final prompt
//   };

//   // Convert canvas to Blob
//   const canvasToBlob = async () => {
//     const canvas = canvasRef.current;
//     return new Promise((resolve) => {
//         canvas.toBlob((blob) => {
//             resolve(blob);
//         }, 'image/png');
//     });
// };

//   // Fetch the image from a URL and convert it to Blob
//   const fetchImageBlob = async (imageUrl) => {
//     const response = await axios.get(imageUrl, { responseType: "blob" });
//     return response.data;
//   };

//   // Upload image to Supabase storage
//   const uploadToSupabase = async (blob) => {
//     const fileName = `generated_${Date.now()}.png`; // Unique file name
//     const { data, error } = await supabase.storage
//       .from("images") // Ensure this is your bucket name
//       .upload(fileName, blob, {
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (error) {
//       console.error("Error uploading image:", error.message);
//       return null;
//     }

//     // Get the public URL of the uploaded image
//     const { publicURL } = supabase.storage
//       .from("images")
//       .getPublicUrl(fileName);
//     return publicURL;
//   };

//   // Handle sending the prompt, style, and image data to the FastAPI backend
//   const handleSubmit = async () => {
//     if (!finalPrompt || !style) {
//       alert(
//         "Please select a sub-prompt and line art image, and draw something on the canvas!"
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       // Send the canvas image and prompt data to the FastAPI backend
//       const formData = new FormData();
//       const imageBlob = await canvasToBlob();
//       formData.append("prompt", finalPrompt);
//       formData.append("style", style);
//       formData.append("image", imageBlob, "drawing.png"); // Sending image as a binary Blob

//       const response = await axios.post(
//         "http://localhost:8000/generate-image/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.status === "success") {
//         const generatedUrl = `http://localhost:8000${response.data.image_url}`;
//         setGeneratedImageUrl(generatedUrl); // Set the URL of the generated image

//         // Fetch the generated image as Blob from the backend URL
//         const generatedImageBlob = await fetchImageBlob(generatedUrl);

//         // Upload the fetched image Blob to Supabase
//         const supabaseUrl = await uploadToSupabase(generatedImageBlob);

//         if (supabaseUrl) {
//           setUploadedImageUrl(supabaseUrl); // Set the uploaded image URL
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

//   // Handle selecting main prompt and show more options
//   const handlePromptSelect = (selectedPrompt) => {
//     setPrompt(selectedPrompt);
//     // Set 5 more related prompts
//     switch (selectedPrompt) {
//       case "Sunset over the mountains":
//         setSubPrompts([
//           "Sunset with clouds",
//           "Sunset with a river",
//           "Sunset with trees",
//           "Sunset with animals",
//           "Sunset with reflections",
//         ]);
//         break;
//       case "A futuristic city":
//         setSubPrompts([
//           "City with flying cars",
//           "City with neon lights",
//           "City at night",
//           "City with robots",
//           "City with skyscrapers",
//         ]);
//         break;
//       case "A serene beach":
//         setSubPrompts([
//           "Beach with palm trees",
//           "Beach with sunset",
//           "Beach with waves",
//           "Beach with people",
//           "Beach with boats",
//         ]);
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
//     setFinalPrompt(`${selectedSubPrompt} with ${lineArtText}`);
//   };

//   // Handle selecting style
//   const handleStyleSelect = (selectedStyle) => {
//     setStyle(selectedStyle);
//   };

//   // Toggle eraser mode
//   const toggleEraser = () => {
//     setEraserMode(!eraserMode);
//   };

//   // Handle line art selection (start dragging) and add it to the array of line art images
//   const handleLineArtSelect = (lineArt) => {
//     const newLineArt = {
//       src: lineArt.src,
//       text: lineArt.text,
//       position: { x: 50, y: 50 }, // Default position
//       size: { width: 100, height: 100 }, // Default size
//     };
//     setLineArtImages([...lineArtImages, newLineArt]); // Add new image to the list
//   };

//   // Draw all line art images on the canvas
//   const drawAllImages = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-drawing

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

//   const handleMouseMoveImage = (e) => {
//     if (!isDraggingImage || currentImageIndex === null) return;
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     const updatedImages = [...lineArtImages];
//     updatedImages[currentImageIndex].position = {
//       x: mouseX - dragOffset.x,
//       y: mouseY - dragOffset.y,
//     };
//     setLineArtImages(updatedImages);
//   };

//   const handleMouseUpImage = () => {
//     setIsDraggingImage(false);
//   };

//   // Handle resizing the image
//   const handleResizeImage = (e) => {
//     if (currentImageIndex === null) return;
//     const updatedImages = [...lineArtImages];
//     const newSize = parseInt(e.target.value, 10);
//     updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
//     setLineArtImages(updatedImages);
//   };

//   // Handle deleting the selected image
//   const handleDeleteImage = () => {
//     if (currentImageIndex === null) return;
//     const updatedImages = [...lineArtImages];
//     updatedImages.splice(currentImageIndex, 1); // Remove the selected image
//     setLineArtImages(updatedImages); // Update the state
//     setCurrentImageIndex(null); // Deselect the image after deleting
//   };

//   return (
//     <div className="mainContainer">
//       <div>
//         <canvas
//           ref={canvasRef}
//           onMouseDown={(e) => {
//             startDrawing(e);
//             handleMouseDownImage(e);
//           }}
//           onMouseMove={(e) => {
//             draw(e);
//             handleMouseMoveImage(e);
//           }}
//           onMouseUp={() => {
//             stopDrawing();
//             handleMouseUpImage();
//           }}
//           width="500px"
//           height="500px"
//           style={{ border: "1px solid black", backgroundColor: "white" }}
//         ></canvas>

//         {/* Brush Options */}
//         <div>
//           <label>Brush Color: </label>
//           <input
//             type="color"
//             value={brushColor}
//             onChange={(e) => setBrushColor(e.target.value)}
//             disabled={eraserMode} // Disable color picker when eraser is active
//           />

//           <label>Brush Size: </label>
//           <input
//             type="range"
//             min="1"
//             max="20"
//             value={brushSize}
//             onChange={(e) => setBrushSize(e.target.value)}
//           />

//           <button onClick={toggleEraser}>
//             {eraserMode ? "Switch to Brush" : "Eraser"}
//           </button>

//           <button onClick={clearCanvas}>Clear Canvas</button>
//         </div>

//         {/* Line Art Selector */}
//         <LineArtSelector onLineArtSelect={handleLineArtSelect} />
//       </div>
//       <div>
//         {/* Image Resize and Delete Controls */}
//         {currentImageIndex !== null && (
//           <div>
//             <h3>Resize or Delete the Image:</h3>
//             <input
//               type="range"
//               min="50"
//               max="300"
//               value={lineArtImages[currentImageIndex].size.width}
//               onChange={handleResizeImage}
//             />
//             <button onClick={handleDeleteImage}>Delete Image</button>
//           </div>
//         )}

//         {/* Prompt Selection */}
//         <div>
//           <h2>Select a Prompt:</h2>
//           <div>
//             <button
//               onClick={() => handlePromptSelect("Sunset over the mountains")}
//             >
//               Sunset over the mountains
//             </button>
//             <button onClick={() => handlePromptSelect("A futuristic city")}>
//               A futuristic city
//             </button>
//             <button onClick={() => handlePromptSelect("A serene beach")}>
//               A serene beach
//             </button>
//           </div>
//         </div>

//         {/* Show more options based on prompt */}
//         {subPrompts.length > 0 && (
//           <div>
//             <h3>Select a Sub-Prompt:</h3>
//             {subPrompts.map((subPrompt, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleSubPromptSelect(subPrompt)}
//               >
//                 {subPrompt}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Style Selection */}
//         <div>
//           <h2>Select a Style:</h2>
//           <div>
//             <button onClick={() => handleStyleSelect("Fantasy Art")}>
//               Fantasy Art
//             </button>
//             <button onClick={() => handleStyleSelect("Realism")}>
//               Realism
//             </button>
//             <button onClick={() => handleStyleSelect("Abstract")}>
//               Abstract
//             </button>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Generating..." : "Generate Image"}
//           </button>
//         </div>

//         {/* Display Generated Image */}
//         {generatedImageUrl && (
//           <div>
//             <h3>Generated Image:</h3>
//             <img
//               src={generatedImageUrl}
//               alt="Generated Art"
//               style={{ width: "500px", height: "500px" }}
//             />
//           </div>
//         )}

//         {/* Display Uploaded Image */}
//         {uploadedImageUrl && (
//           <div>
//             <h3>Uploaded Image to Supabase:</h3>
//             <img
//               src={uploadedImageUrl}
//               alt="Uploaded Art"
//               style={{ width: "500px", height: "500px" }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DrawingApp;
