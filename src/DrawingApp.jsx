import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient"; // Import Supabase client
import LineArtSelector from "./LineArtSelector"; // Import the LineArtSelector component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Loading from "./Loading";

const DrawingApp = () => {
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Supabase URL for the uploaded image
  const [eraserMode, setEraserMode] = useState(false); // To toggle eraser mode
  const [loading, setLoading] = useState(false);
  const [lineArtImages, setLineArtImages] = useState([]); // Store multiple line art images
  const navigate = useNavigate(); // For navigation to result page
  const [isDraggingImage, setIsDraggingImage] = useState(false); // Image drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
  const [currentImageIndex, setCurrentImageIndex] = useState(null); // Track which image is being dragged or resized
  const [selectedStyle, setSelectedStyle] = useState("Fantasy Art"); // Track the selected style
  const [isMobileView, setIsMobileView] = useState(false); // Detect mobile view

  const logoUrl = "/logo.png"; // Path to your logo image

  const handleStyleSelect = (style) => {
    setSelectedStyle(style); // Update the selected style
  };

  // Redraw the canvas when the position or size of any image changes
  useEffect(() => {
    drawAllImages();
  }, [lineArtImages]);

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

  // Function to draw the logo on the canvas
  const drawLogo = (context) => {
    const logo = new Image();
    logo.src = logoUrl;

    return new Promise((resolve) => {
      // Ensure logo is fully loaded
      logo.onload = () => {
        const canvas = canvasRef.current;

        if (!canvas) {
          console.error("Canvas not found");
          resolve(); // Fail silently, no drawing
          return;
        }

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const logoWidth = canvasWidth * 0.15; // Scale the logo to 15% of canvas width
        const logoHeight = logoWidth * (logo.height / logo.width); // Maintain aspect ratio

        // Draw the logo at the bottom right corner
        const x = canvasWidth - logoWidth - 20; // 20px margin from the right
        const y = canvasHeight - logoHeight - 20; // 20px margin from the bottom

        context.drawImage(logo, x, y, logoWidth, logoHeight);
        resolve(); // Resolve after drawing is complete
      };

      // Handle error if logo fails to load
      logo.onerror = () => {
        console.error("Failed to load logo image");
        resolve(); // Resolve to continue with other actions
      };
    });
  };

  const mergeCanvasesWithLogo = async () => {
    const imageCanvas = imageCanvasRef.current;
    const drawingCanvas = canvasRef.current;

    if (!drawingCanvas) {
      console.error("Drawing canvas not found");
      return;
    }

    const drawingContext = drawingCanvas.getContext("2d");

    // Draw the imageCanvas content onto the drawingCanvas
    drawingContext.drawImage(imageCanvas, 0, 0);

    // Draw the logo on the canvas
    await drawLogo(drawingContext);
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

  const canvasToBlob = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found when trying to convert to Blob.");
      return null; // Return null to handle this gracefully
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(
            new Error("Canvas is empty or could not be converted to a blob")
          );
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

    const publicURL = `https://mxyippuwkpysdexmxrbm.supabase.co/storage/v1/object/public/images/gurgaon/${fileName}`;
    const { error: insertError } = await supabase
      .from("images")
      .insert([{ url: publicURL }]);

    if (insertError) {
      console.error("Insert error:", insertError);
    }
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

    setLoading(true); // Start loading screen

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas not found during submission!");
        return;
      }

      // Merge canvas with logo and all image layers
      await mergeCanvasesWithLogo();

      // Convert the canvas to Blob
      const imageBlob = await canvasToBlob();
      if (!imageBlob) {
        console.error("Canvas conversion to Blob failed.");
        return;
      }

      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("style", style);
      formData.append("image", imageBlob, "drawing.png");

      const response = await axios.post(
        "https://king-prawn-app-js4z2.ondigitalocean.app/generate-image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        const imageUrl = response.data.image_url;

        const generatedUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `https://king-prawn-app-js4z2.ondigitalocean.app/${imageUrl}`;
        setGeneratedImageUrl(generatedUrl);

        // Fetch the generated image as Blob from the backend URL
        const generatedImageBlob = await fetchImageBlob(generatedUrl);

        // Upload the fetched image Blob to Supabase
        const supabaseUrl = await uploadToSupabase(generatedImageBlob);

        if (supabaseUrl) {
          navigate("/result", {
            state: { uploadedImageUrl: supabaseUrl },
          });
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
      case "Space":
        setSubPrompts([
          "With Moons and Asteroids",
          "Spiral Galaxy with Stars",
          "Colliding Galaxies",
          "Docked at a Space Station",
          "Galaxy with Star Trails",
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
      case "Animal":
        setSubPrompts([
          "resting under the shade of a large tree in the savanna",
          "splashing water in a calm river with its trunk.",
          "sprinting across the open plains in pursuit of prey.",
          "waddling across icy terrain with its chick.",
          "howling at the full moon in a dark forest.",
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
              <div className="mainLeft">
                <div className="canvasContainer">
                  <canvas
                    ref={imageCanvasRef}
                    
                 
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
                              ? "2px solid #000"
                              : "1px solid #ccc",
                          backgroundColor:
                            prompt === "Sunset with Mountains"
                              ? "#fff"
                              : "transparent",
                        }}
                      >
                        Nature
                      </div>

                      <div
                        onClick={() => handlePromptSelect("Space")}
                        className="selecttheme-bb"
                        style={{
                          border:
                            prompt === "With Moons and Asteroids"
                              ? "2px solid #000"
                              : "1px solid #ccc",

                          backgroundColor:
                            prompt === "With Moons and Asteroids"
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                      >
                        Space
                      </div>

                      <div
                        onClick={() => handlePromptSelect("Automibile")}
                        className="selecttheme-aa"
                        style={{
                          border:
                            prompt === "With a City Skyline"
                              ? "2px solid #0F4ABA"
                              : "1px solid #ccc",
                          backgroundColor:
                            prompt === "With a City Skyline"
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                      >
                        Automobile
                      </div>
                      <div
                        onClick={() => handlePromptSelect("Animal")}
                        className="selecttheme-dd"
                        style={{
                          border:
                            prompt === "In a Neon-lit Cityscape"
                              ? "2px solid #000"
                              : "1px solid #ccc",
                          backgroundColor:
                            prompt === "In a Neon-lit Cityscape"
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                      >
                        Animal
                      </div>
                    </div>
                  </div>

                  {/* Show more options based on selected prompt */}
                  {subPrompts.length > 0 && (
                    <div className="sub-prompts-contaier-main">
                      
                      <div
                      className="sub-prompts-contaier-ff"
                      >
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
                  <h2
                  >
                    SELECT STYLE:
                  </h2>

                  <div
                    className="style-container"
                  >
                    {/* Style Button 1 */}
                    <button
                      onClick={() => handleStyleSelect("Fantasy Art")}
                      style={{
                        backgroundColor:
                          selectedStyle === "Fantasy Art"
                            ? "#fff"
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
                            ? "#fff"
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
                            ? "#fff"
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
                            ? "#fff"
                            : "transparent",
                        color: selectedStyle === "Comic Book" ? "#000" : "#fff",
                        transition: "background-color 0.3s ease", // Smooth background color transition
                      }}
                    >
                      Comic Book
                    </button>
                  </div>
                </div>

                <div
                  className="closedfgg"
             
                ></div>

                {/* Submit Button */}
                <div
                className="fgrogf"
          
                >
                  <button
                    onClick={handleSubmit}
                    className="butoongft5"
                    disabled={loading}
                  >
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
