// // import React, { useRef, useState } from 'react';
// // import axios from 'axios';

// // const DrawingApp = () => {
// //     const canvasRef = useRef(null);
// //     const [isDrawing, setIsDrawing] = useState(false);
// //     const [prompt, setPrompt] = useState(''); // Selected text prompt
// //     const [style, setStyle] = useState('Fantasy Art'); // Default style
// //     const [loading, setLoading] = useState(false);
// //     const [generatedImageUrl, setGeneratedImageUrl] = useState('');

// //     // Mouse events for canvas drawing
// //     const startDrawing = (e) => {
// //         const canvas = canvasRef.current;
// //         const context = canvas.getContext('2d');
// //         context.beginPath();
// //         context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
// //         setIsDrawing(true);
// //     };

// //     const draw = (e) => {
// //         if (!isDrawing) return;
// //         const canvas = canvasRef.current;
// //         const context = canvas.getContext('2d');
// //         context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
// //         context.stroke();
// //     };

// //     const stopDrawing = () => {
// //         setIsDrawing(false);
// //     };

// //     // Convert canvas to Blob
// //     const canvasToBlob = async () => {
// //         const canvas = canvasRef.current;
// //         return new Promise((resolve) => {
// //             canvas.toBlob((blob) => {
// //                 resolve(blob);
// //             }, 'image/png');
// //         });
// //     };

// //     // Handle sending the prompt, style, and image data to the FastAPI backend
// //     const handleSubmit = async () => {
// //         if (!prompt || !style) {
// //             alert("Please select a prompt and style, and draw something on the canvas!");
// //             return;
// //         }

// //         const imageBlob = await canvasToBlob();

// //         if (!imageBlob) {
// //             alert("Error converting canvas to image.");
// //             return;
// //         }

// //         const formData = new FormData();
// //         formData.append('prompt', prompt);
// //         formData.append('style', style);
// //         formData.append('image', imageBlob, 'drawing.png'); // Sending image as a binary Blob

// //         setLoading(true);
// //         try {
// //             const response = await axios.post('http://localhost:8000/generate-image/', formData, {
// //                 headers: {
// //                     'Content-Type': 'multipart/form-data',
// //                 },
// //             });

// //             if (response.data.status === 'success') {
// //                 setGeneratedImageUrl(`http://localhost:8000${response.data.image_url}`);
// //             } else {
// //                 console.error("Error:", response.data.message);
// //             }
// //         } catch (error) {
// //             console.error("Error:", error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Handle selecting prompt text
// //     const handlePromptSelect = (selectedPrompt) => {
// //         setPrompt(selectedPrompt);
// //     };

// //     // Handle selecting style
// //     const handleStyleSelect = (selectedStyle) => {
// //         setStyle(selectedStyle);
// //     };

// //     return (
// //         <div>
          

// //             {/* Drawing Canvas */}
// //             <canvas
// //                 ref={canvasRef}
// //                 onMouseDown={startDrawing}
// //                 onMouseMove={draw}
// //                 onMouseUp={stopDrawing}
// //                 width="500px"
// //                 height="500px"
// //                 style={{ border: '1px solid black' }}
// //             ></canvas>

// //             {/* Prompt Selection */}
// //             <div>
// //                 <h2>Select a Prompt:</h2>
// //                 <div>
// //                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
// //                     <button onClick={() => handlePromptSelect('A futuristic city')}>A futuristic city</button>
// //                     <button onClick={() => handlePromptSelect('A serene beach')}>A serene beach</button>
// //                 </div>
// //             </div>

// //             {/* Style Selection */}
// //             <div>
// //                 <h2>Select a Style:</h2>
// //                 <div>
// //                     <button onClick={() => handleStyleSelect('Fantasy Art')}>Fantasy Art</button>
// //                     <button onClick={() => handleStyleSelect('Realism')}>Realism</button>
// //                     <button onClick={() => handleStyleSelect('Abstract')}>Abstract</button>
// //                 </div>
// //             </div>

// //             {/* Submit Button */}
// //             <div>
// //                 <button onClick={handleSubmit} disabled={loading}>
// //                     {loading ? 'Generating...' : 'Generate Image'}
// //                 </button>
// //             </div>

// //             {/* Display Generated Image */}
// //             {generatedImageUrl && (
// //                 <div>
// //                     <h3>Generated Image:</h3>
// //                     <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default DrawingApp;



// import React, { useRef, useState } from 'react';
// import axios from 'axios';

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

//     // Mouse events for canvas drawing
//     const startDrawing = (e) => {
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
//         if (!isDrawing) return;
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

//     return (
//         <div>
         
//             {/* Drawing Canvas */}
//             <canvas
//                 ref={canvasRef}
//                 onMouseDown={startDrawing}
//                 onMouseMove={draw}
//                 onMouseUp={stopDrawing}
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

//             {/* Prompt Selection */}
//             <div>
//                 <h2>Select a Prompt:</h2>
//                 <div>
//                     <button onClick={() => handlePromptSelect('Sunset over the mountains')}>Sunset over the mountains</button>
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















import React, { useRef, useState } from 'react';
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

    // Mouse events for canvas drawing
    const startDrawing = (e) => {
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
        if (!isDrawing) return;
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

    // Handle drop of line art on the canvas
    const handleDrop = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = draggedLineArt;
        img.onload = () => {
            // Calculate drop position
            const dropX = e.nativeEvent.offsetX - img.width / 2;
            const dropY = e.nativeEvent.offsetY - img.height / 2;
            context.drawImage(img, dropX, dropY, 100, 100); // Draw line art onto canvas
        };
        setDraggedLineArt(null); // Reset dragged image
    };

    return (
        <div>
            <h1>Draw on the Canvas and Generate an Image</h1>

            {/* Drawing Canvas */}
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onDragOver={(e) => e.preventDefault()} // Allow drop
                onDrop={handleDrop}
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

            {/* Prompt Selection */}
            <div>
                <h2>Select a Prompt:</h2>
                <div>
                    <button onClick={() => handlePromptSelect('tree')}>Sunset over the mountains</button>
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

