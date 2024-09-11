// import React, { useRef, useState } from 'react';
// import axios from 'axios';
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode
//     const [draggedLineArt, setDraggedLineArt] = useState(null); // Store dragged line art image
//     const [imageSize, setImageSize] = useState(100); // Default image size
//     const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // Default image position

//     const [isResizing, setIsResizing] = useState(false); // Resizing state

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
//         if (isResizing) return; // Do not draw while resizing
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
//         if (!isDrawing || isResizing) return;
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
//         if (!prompt || !style) {
//             alert("Please select a prompt and style, and draw something on the canvas!");
//             return;
//         }

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', prompt);
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

//     // Handle selecting prompt text
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging)
//     const handleLineArtSelect = (src) => {
//         setDraggedLineArt(src); // Set the dragged image source
//     };

//     // Handle drop of line art on the canvas
//     const handleDrop = (e) => {
//         e.preventDefault();
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         const img = new Image();
//         img.src = draggedLineArt;
//         img.onload = () => {
//             const dropX = imagePosition.x;
//             const dropY = imagePosition.y;
//             context.drawImage(img, dropX, dropY, imageSize, imageSize); // Draw line art onto canvas with custom size
//         };
//         setDraggedLineArt(null); // Reset dragged image
//     };

//     // Handle resizing of the image
//     const handleResizeStart = () => {
//         setIsResizing(true);
//     };

//     const handleResize = (e) => {
//         if (isResizing) {
//             const newSize = e.target.value;
//             setImageSize(newSize);
//         }
//     };

//     const handleResizeEnd = () => {
//         setIsResizing(false);
//     };

//     return (
//         <div>
//             <h1>Draw on the Canvas and Generate an Image</h1>

//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={startDrawing}
//                 onMouseMove={draw}
//                 onMouseUp={stopDrawing}
//                 onDragOver={(e) => e.preventDefault()} // Allow drop
//                 onDrop={handleDrop}
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
//                         value={imageSize}
//                         onMouseDown={handleResizeStart}
//                         onChange={handleResize}
//                         onMouseUp={handleResizeEnd}
//                     />
//                 </div>
//             )}

//             {/* Prompt Selection */}
//             <div>
//                 <h2>Select a Prompt:</h2>
//                 <div>
//                     <button onClick={() => handlePromptSelect('cycle')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

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









// import React, { useRef, useState } from 'react';
// import axios from 'axios';
// import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

// const DrawingApp = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [prompt, setPrompt] = useState(''); // Selected text prompt
//     const [style, setStyle] = useState('Fantasy Art'); // Default style
//     const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
//     const [brushSize, setBrushSize] = useState(5); // Default brush size
//     const [loading, setLoading] = useState(false);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState('');
//     const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

//     const [draggedLineArt, setDraggedLineArt] = useState(null); // Store dragged line art image
//     const [isResizing, setIsResizing] = useState(false); // Resizing state
//     const [imageSize, setImageSize] = useState({ width: 100, height: 100 }); // Default image size
//     const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // Default image position
//     const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging

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
//         if (!prompt || !style) {
//             alert("Please select a prompt and style, and draw something on the canvas!");
//             return;
//         }

//         const imageBlob = await canvasToBlob();

//         if (!imageBlob) {
//             alert("Error converting canvas to image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('prompt', prompt);
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

//     // Handle selecting prompt text
//     const handlePromptSelect = (selectedPrompt) => {
//         setPrompt(selectedPrompt);
//     };

//     // Handle selecting style
//     const handleStyleSelect = (selectedStyle) => {
//         setStyle(selectedStyle);
//     };

//     // Toggle eraser mode
//     const toggleEraser = () => {
//         setEraserMode(!eraserMode);
//     };

//     // Handle line art selection (start dragging)
//     const handleLineArtSelect = (src) => {
//         setDraggedLineArt(src); // Set the dragged image source
//     };

//     // Draw the line art image on canvas
//     const drawImage = () => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         const img = new Image();
//         img.src = draggedLineArt;
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
//         drawImage(); // Redraw the image while dragging
//     };

//     const handleMouseUpImage = () => {
//         setIsDraggingImage(false);
//     };

//     // Handle resizing the image
//     const handleResizeImage = (e) => {
//         setImageSize({ width: parseInt(e.target.value, 10), height: parseInt(e.target.value, 10) });
//         drawImage(); // Redraw the image while resizing
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
//                 onMouseMove={handleMouseMoveImage}
//                 onMouseUp={handleMouseUpImage}
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
//                     <button onClick={() => handlePromptSelect('tree')}>Sunset over the mountains</button>
//                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
//                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
//                 </div>
//             </div>

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













import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import LineArtSelector from './LineArtSelector'; // Import the LineArtSelector component

const DrawingApp = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [prompt, setPrompt] = useState(''); // Selected text prompt
    const [style, setStyle] = useState('Fantasy Art'); // Default style
    const [brushColor, setBrushColor] = useState('#000000'); // Default brush color (black)
    const [brushSize, setBrushSize] = useState(5); // Default brush size
    const [loading, setLoading] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode

    const [draggedLineArt, setDraggedLineArt] = useState(null); // Store dragged line art image
    const [isResizing, setIsResizing] = useState(false); // Resizing state
    const [imageSize, setImageSize] = useState({ width: 100, height: 100 }); // Default image size
    const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // Default image position
    const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging

    // Redraw the image when the position or size changes
    useEffect(() => {
        if (draggedLineArt) {
            drawImage();
        }
    }, [imagePosition, imageSize]);

    // Mouse events for canvas drawing
    const startDrawing = (e) => {
        if (isDraggingImage || isResizing) return; // Do not draw while dragging/resizing
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = "round"; // Makes the line round at the edges
        context.lineJoin = "round"; // Smooth joins between lines
        context.lineWidth = brushSize;
        context.strokeStyle = eraserMode ? '#FFFFFF' : brushColor; // Eraser or brush color
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || isDraggingImage || isResizing) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // Clear the canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    };

    // Convert canvas to Blob
    const canvasToBlob = async () => {
        const canvas = canvasRef.current;
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    };

    // Handle sending the prompt, style, and image data to the FastAPI backend
    const handleSubmit = async () => {
        if (!prompt || !style) {
            alert("Please select a prompt and style, and draw something on the canvas!");
            return;
        }

        const imageBlob = await canvasToBlob();

        if (!imageBlob) {
            alert("Error converting canvas to image.");
            return;
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('style', style);
        formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/generate-image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'success') {
                setGeneratedImageUrl(`http://localhost:8000${response.data.image_url}`);
            } else {
                console.error("Error:", response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle selecting prompt text
    const handlePromptSelect = (selectedPrompt) => {
        setPrompt(selectedPrompt);
    };

    // Handle selecting style
    const handleStyleSelect = (selectedStyle) => {
        setStyle(selectedStyle);
    };

    // Toggle eraser mode
    const toggleEraser = () => {
        setEraserMode(!eraserMode);
    };

    // Handle line art selection (start dragging)
    const handleLineArtSelect = (src) => {
        setDraggedLineArt(src); // Set the dragged image source
    };

    // Draw the line art image on canvas
    const drawImage = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = draggedLineArt;
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
            context.drawImage(img, imagePosition.x, imagePosition.y, imageSize.width, imageSize.height);
        };
    };

    // Handle dragging the image inside the canvas
    const handleMouseDownImage = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if the mouse is inside the image area
        if (mouseX >= imagePosition.x && mouseX <= imagePosition.x + imageSize.width &&
            mouseY >= imagePosition.y && mouseY <= imagePosition.y + imageSize.height) {
            setIsDraggingImage(true);
            setDragOffset({ x: mouseX - imagePosition.x, y: mouseY - imagePosition.y });
        }
    };

    const handleMouseMoveImage = (e) => {
        if (!isDraggingImage) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setImagePosition({ x: mouseX - dragOffset.x, y: mouseY - dragOffset.y });
    };

    const handleMouseUpImage = () => {
        setIsDraggingImage(false);
    };

    // Handle resizing the image
    const handleResizeImage = (e) => {
        setImageSize({ width: parseInt(e.target.value, 10), height: parseInt(e.target.value, 10) });
    };

    return (
        <div>
            

            {/* Drawing Canvas */}
            <canvas
                ref={canvasRef}
                onMouseDown={(e) => {
                    startDrawing(e);
                    handleMouseDownImage(e);
                }}
                onMouseMove={(e) => {
                    draw(e);
                    handleMouseMoveImage(e);
                }}
                onMouseUp={() => {
                    stopDrawing();
                    handleMouseUpImage();
                }}
                width="500px"
                height="500px"
                style={{ border: '1px solid black', backgroundColor: 'white' }}
            ></canvas>

            {/* Brush Options */}
            <div>
                <label>Brush Color: </label>
                <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    disabled={eraserMode} // Disable color picker when eraser is active
                />

                <label>Brush Size: </label>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                />

                <button onClick={toggleEraser}>
                    {eraserMode ? 'Switch to Brush' : 'Eraser'}
                </button>

                <button onClick={clearCanvas}>Clear Canvas</button>
            </div>

            {/* Line Art Selector */}
            <LineArtSelector onLineArtSelect={handleLineArtSelect} />

            {/* Image Resize Controls */}
            {draggedLineArt && (
                <div>
                    <h3>Resize the Image:</h3>
                    <input
                        type="range"
                        min="50"
                        max="300"
                        value={imageSize.width}
                        onChange={handleResizeImage}
                    />
                </div>
            )}

            {/* Prompt Selection */}
            <div>
                <h2>Select a Prompt:</h2>
                <div>
                    <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
                    <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
                    <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
                </div>
            </div>

            {/* Style Selection */}
            <div>
                <h2>Select a Style:</h2>
                <div>
                    <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
                    <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
                    <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
                </div>
            </div>

            {/* Submit Button */}
            <div>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>

            {/* Display Generated Image */}
            {generatedImageUrl && (
                <div>
                    <h3>Generated Image:</h3>
                    <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
                </div>
            )}
        </div>
    );
};

export default DrawingApp;
