import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient"; // Import Supabase client
import LineArtSelector from "./LineArtSelector"; // Import the LineArtSelector component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Loading from "./Loading";

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState(""); // Selected text prompt
  const [subPrompts, setSubPrompts] = useState([]); // Store related sub-prompts
  const [selectedSubPrompt, setSelectedSubPrompt] = useState(""); // Final selected sub-prompt
  const [finalPrompt, setFinalPrompt] = useState(""); // Final prompt combining prompt + line art text
  const [style, setStyle] = useState("Fantasy Art"); // Default style
  const [brushColor, setBrushColor] = useState("#000"); // Default brush color (black)
  const [brushSize, setBrushSize] = useState(1); // Default brush size
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Supabase URL for the uploaded image
  const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode
  const [loading, setLoading] = useState(false);
  const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images
  const navigate = useNavigate(); // For navigation to result page
  const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
  const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized

  // Redraw the canvas when the position or size of any image changes
  useEffect(() => {
    drawAllImages();
  }, [lineArtImages]);

  useEffect(() => {
    updateFinalPrompt();
  }, [lineArtImages, selectedSubPrompt]);

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


//   const draw = (e) => {
//     if (!isDrawing || isDraggingImage) return;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     context.stroke();
//   };


const draw = (x, y) => {
    if (!isDrawing || isDraggingImage) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
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
  // Image drag and drop functionality (both for touch and mouse)
  const handleImageDragStart = (mouseX, mouseY) => {
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
    if (!imageFound) {
      setCurrentImageIndex(null);
    }
  };


    // // Handle mouse events for dragging images
    // const handleMouseDownImage = (e) => {
    //     const mouseX = e.nativeEvent.offsetX;
    //     const mouseY = e.nativeEvent.offsetY;
    //     handleImageDragStart(mouseX, mouseY);
    //   };
    
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
    
    //   const handleMouseUpImage = () => {
    //     setIsDraggingImage(false);
    //   };


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

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    setLineArtImages([]); // Clear all line art images
    setFinalPrompt(""); // Clear final prompt
  };

  // Convert canvas to Blob
  const canvasToBlob = async () => {
    const canvas = canvasRef.current;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  // Fetch the image from a URL and convert it to Blob
  const fetchImageBlob = async (imageUrl) => {
    const response = await axios.get(imageUrl, { responseType: "blob" });
    return response.data;
  };

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

  const uploadToSupabase = async (blob) => {
    const fileName = `generated_${Date.now()}.png`; // Unique file name
    const { data, error } = await supabase.storage
      .from("images") // Ensure this is your bucket name
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    // // Get the public URL of the uploaded image
    // const { publicURL, error: urlError } = supabase.storage

    //   .from("images")
    //   .getPublicUrl(fileName);

    // if (urlError) {
    //   console.error("Error getting public URL:", urlError.message);
    //   return null;
    // }

    // console.log("Supabase Public URL:", publicURL); // Debugging

    const publicURL = `https://mxyippuwkpysdexmxrbm.supabase.co/storage/v1/object/public/images/${fileName}`;
    return publicURL;
  };

  // Handle sending the prompt, style, and image data to the FastAPI backend
  const handleSubmit = async () => {
    if (!finalPrompt || !style) {
      alert(
        "Please select a sub-prompt and line art image, and draw something on the canvas!"
      );
      return;
    }
    setLoading(true); // Start showing the loading screen

    try {
      // Convert the canvas to base64 for displaying in the result page
      const canvas = canvasRef.current;

      if (!canvas) {
        console.error("Canvas not found!"); // Debugging check
        return;
      }

      const canvasDrawingUrl = canvas.toDataURL("image/png"); // Get the canvas image as base64
      console.log("Canvas Drawing URL:", canvasDrawingUrl); // Debugging check

      // Send the canvas image and prompt data to the FastAPI backend
      const imageBlob = await canvasToBlob();
      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("style", style);
      formData.append("image", imageBlob, "drawing.png"); // Sending image as a binary Blob

      const response = await axios.post(
        "http://localhost:8000/generate-image/",
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
          : `http://localhost:8000/${imageUrl}`;
        setGeneratedImageUrl(generatedUrl); // Set the URL of the generated image

        // Fetch the generated image as Blob from the backend URL
        const generatedImageBlob = await fetchImageBlob(generatedUrl);

        // Upload the fetched image Blob to Supabase
        const supabaseUrl = await uploadToSupabase(generatedImageBlob);

        if (supabaseUrl) {
          console.log("Image uploaded to Supabase, URL:", supabaseUrl); // Debugging
          console.log("Navigating to result page"); // Debugging before navigation
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

  // Handle selecting main prompt and show more options
  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    // Set 5 more related prompts
    switch (selectedPrompt) {
      case "Sunset over the mountains":
        setSubPrompts([
          "Sunset with clouds",
          "Sunset with a river",
          "Sunset with trees",
          "Sunset with animals",
          "Sunset with reflections",
        ]);
        break;
      case "A futuristic city":
        setSubPrompts([
          "City with flying cars",
          "City with neon lights",
          "City at night",
          "City with robots",
          "City with skyscrapers",
        ]);
        break;
      case "A serene beach":
        setSubPrompts([
          "Beach with palm trees",
          "Beach with sunset",
          "Beach with waves",
          "Beach with people",
          "Beach with boats",
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
    setFinalPrompt(`${selectedSubPrompt} with ${lineArtText}`);
  };

  // Handle selecting style
  const handleStyleSelect = (selectedStyle) => {
    setStyle(selectedStyle);
  };

  // Toggle eraser mode
  const toggleEraser = () => {
    setEraserMode(!eraserMode);
  };

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

  // Handle line art selection (start dragging) and add it to the array of line art images
  const handleLineArtSelect = (lineArt) => {
    const canvas = canvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const newLineArt = {
      src: lineArt.src,
      text: lineArt.text,
      position: { x: canvasWidth / 4, y: canvasHeight / 4 }, // Default position
      size: { width: canvasWidth / 4, height: canvasHeight / 4 }, // Scale size relative to canvas
    };

    setLineArtImages([...lineArtImages, newLineArt]); // Add new image to the list
  };

  // Draw all line art images on the canvas
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

  // Draw all line art images on the canvas
  const drawAllImages = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before re-drawing

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

  const handleMouseUpImage = () => {
    setIsDraggingImage(false);
  };

  // Handle resizing the image
  //   const handleResizeImage = (e) => {
  //     if (currentImageIndex === null) return;
  //     const updatedImages = [...lineArtImages];
  //     const newSize = parseInt(e.target.value, 10);
  //     updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
  //     setLineArtImages(updatedImages);
  //   };

  // Handle resizing the image
  const handleResizeImage = (e) => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
    const updatedImages = [...lineArtImages];
    const newSize = parseInt(e.target.value, 10);
    updatedImages[currentImageIndex].size = { width: newSize, height: newSize };
    setLineArtImages(updatedImages);
  };

  // Handle deleting the selected image
  //   const handleDeleteImage = () => {
  //     if (currentImageIndex === null) return;
  //     const updatedImages = [...lineArtImages];
  //     updatedImages.splice(currentImageIndex, 1); // Remove the selected image
  //     setLineArtImages(updatedImages); // Update the state
  //     setCurrentImageIndex(null); // Deselect the image after deleting
  //   };

  // Handle deleting the selected image
  const handleDeleteImage = () => {
    if (currentImageIndex === null || !lineArtImages[currentImageIndex]) return; // Ensure index and image exist
    const updatedImages = [...lineArtImages];
    updatedImages.splice(currentImageIndex, 1); // Remove the selected image
    setLineArtImages(updatedImages); // Update the state
    setCurrentImageIndex(null); // Deselect the image after deleting
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="mainContainer">
          <div className="mainLeft">
            <div className="canvasContainer">
              <canvas
                ref={canvasRef}
                // onMouseDown={(e) => {
                //   startDrawing(e);
                //   handleMouseDownImage(e);
                // }}
                // onMouseMove={(e) => {
                //   draw(e);
                //   handleMouseMoveImage(e);
                // }}
                // onMouseUp={() => {
                //   stopDrawing();
                //   handleMouseUpImage();
                // }}

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
                  onTouchEnd={(e) => {
                    handleTouchEnd();
                    handleTouchEndImage();
                  }}
                width="1192"
                height="795"
                style={{ border: "1px solid black", backgroundColor: "white" }}
              ></canvas>
            </div>
            <div className="downContainer">
              <div className="brushRest">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  className="slider-thumb"
                  onChange={(e) => setBrushSize(e.target.value)}
                />
              </div>
              <div className="bothGContainer">
                <button onClick={toggleEraser} className="brushButton">
                  {eraserMode ? "Brush" : "Eraser"}
                </button>
                <button onClick={clearCanvas} className="resetButton">Reset</button>
              </div>
            </div>
          </div>



          <div className="mainRight">
            {/* Line Art Selector */}
            <LineArtSelector onLineArtSelect={handleLineArtSelect} />

            {/* Image Resize and Delete Controls */}
            {currentImageIndex !== null && lineArtImages[currentImageIndex] && (
              <div>
                <h3>Resize or Delete the Image:</h3>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={lineArtImages[currentImageIndex]?.size?.width || 100} // Default to 100 if size is not defined
                  onChange={handleResizeImage}
                />
                <button onClick={handleDeleteImage}>Delete Image</button>
              </div>
            )}

            {/* Prompt Selection */}
            <div>
              <h2>Select a Prompt:</h2>
              <div>
                <button
                  onClick={() =>
                    handlePromptSelect("Sunset over the mountains")
                  }
                >
                  Sunset over the mountains
                </button>
                <button onClick={() => handlePromptSelect("A futuristic city")}>
                  A futuristic city
                </button>
                <button onClick={() => handlePromptSelect("A serene beach")}>
                  A serene beach
                </button>
              </div>
            </div>

            {/* Show more options based on prompt */}
            {subPrompts.length > 0 && (
              <div style={{display:'flex', flexDirection:"column", justifyContent:"center", alignItems:"flex-start", }}>
                {subPrompts.map((subPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubPromptSelect(subPrompt)}
                    style={{width:"350px"}}
                  >
                    {subPrompt}
                  </button>
                ))}
              </div>
            )}

            {/* Style Selection */}
            <div className="whole-style-container">
              <h2>Select a Style:</h2>
              <div className="style-container">
                <button onClick={() => handleStyleSelect("Fantasy Art")}>
                  Fantasy Art
                </button>
                <button onClick={() => handleStyleSelect("Realism")}>
                  Realism
                </button>
                <button onClick={() => handleStyleSelect("Abstract")}>
                  Abstract
                </button>
                <button onClick={() => handleStyleSelect("Abstractsdafs")}>
                  Abstractsadsf
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Generating..." : "Generate Image"}
              </button>
            </div>

            {/*            
                  {generatedImageUrl && (
                      <div>
                          <h3>Generated Image:</h3>
                          <img src={generatedImageUrl} alt="Generated Art" style={{ width: '500px', height: '500px' }} />
                      </div>
                  )}
      
                 
                  {uploadedImageUrl && (
                      <div>
                          <h3>Uploaded Image to Supabase:</h3>
                          <img src={uploadedImageUrl} alt="Uploaded Art" style={{ width: '500px', height: '500px' }} />
                      </div>
                  )} */}
          </div>

          {/* <button
            onClick={() =>
              navigate("/result", {
                state: { uploadedImageUrl: uploadedImageUrl },
              })
            }
          >
            Go to Result Page
          </button> */}
        </div>
      )}
    </div>
  );
};

export default DrawingApp;
