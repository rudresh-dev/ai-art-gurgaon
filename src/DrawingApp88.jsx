import React, { useState, useEffect } from "react";
import CanvasArea from "./components/CanvasArea";
import LineArtSelector from "./components/LineArtSelector";
import Toolbar from "./components/Toolbar";
import StyleSelector from "./components/StyleSelector";
import PromptSelector from "./components/PromptSelector";
import SubmitButton from "./components/SubmitButton";
import { supabase } from "../supabaseClient"; // Supabase client
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const DrawingApp = () => {
  const [lineArtImages, setLineArtImages] = useState([]);
  const [brushSize, setBrushSize] = useState(1);
  const [brushColor, setBrushColor] = useState("#000");
  const [eraserMode, setEraserMode] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("Fantasy Art");
  const [prompt, setPrompt] = useState("Sunset with Mountains");
  const [subPrompts, setSubPrompts] = useState([]);
  const [selectedSubPrompt, setSelectedSubPrompt] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handlePromptSelect("Sunset with Mountains");
  }, []);

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
    // Set sub-prompts based on selected prompt
    switch (selectedPrompt) {
      case "Sunset with Mountains":
        setSubPrompts(["Sunset", "Mountain Reflection", "Snow-capped Peaks"]);
        break;
      case "Space":
        setSubPrompts(["Galaxies", "Moons", "Spiral Stars"]);
        break;
      case "Automobile":
        setSubPrompts(["With Skyline", "Racing", "Off-road"]);
        break;
      case "Animal":
        setSubPrompts(["In Savannah", "With Water", "Running"]);
        break;
      default:
        setSubPrompts([]);
    }
    setSelectedSubPrompt("");
    setFinalPrompt("");
  };

  const uploadToSupabase = async (blob) => {
    const fileName = `generated_${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from("images/gurgaon")
      .upload(fileName, blob, { cacheControl: "3600", upsert: false });

    if (error) return null;

    const publicURL = `https://mxyippuwkpysdexmxrbm.supabase.co/storage/v1/object/public/images/gurgaon/${fileName}`;
    return publicURL;
  };

  const handleSubmit = async () => {
    if (!finalPrompt || !selectedStyle) {
      alert("Please complete the prompt and style selection.");
      return;
    }

    setLoading(true);
    try {
      const canvas = document.querySelector("canvas");
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("style", selectedStyle);
      formData.append("image", blob, "drawing.png");

      const response = await axios.post(
        "http://127.0.0.1:8000/generate-image/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        const generatedImageBlob = await fetch(response.data.image_url).then(
          (res) => res.blob()
        );
        const supabaseUrl = await uploadToSupabase(generatedImageBlob);

        if (supabaseUrl) {
          navigate("/result", { state: { uploadedImageUrl: supabaseUrl } });
        }
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drawingApp">
      {loading ? (
        <Loading />
      ) : (
        <>
          <CanvasArea
            lineArtImages={lineArtImages}
            setLineArtImages={setLineArtImages}
            brushSize={brushSize}
            brushColor={brushColor}
            eraserMode={eraserMode}
          />
          <Toolbar
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            eraserMode={eraserMode}
            toggleEraser={() => setEraserMode(!eraserMode)}
            clearCanvas={() => setLineArtImages([])}
          />
          <PromptSelector
            prompt={prompt}
            subPrompts={subPrompts}
            selectedSubPrompt={selectedSubPrompt}
            handlePromptSelect={handlePromptSelect}
            handleSubPromptSelect={setSelectedSubPrompt}
          />
          <StyleSelector
            selectedStyle={selectedStyle}
            handleStyleSelect={setSelectedStyle}
          />
          <LineArtSelector
            handleLineArtSelect={(lineArt) =>
              setLineArtImages([...lineArtImages, lineArt])
            }
          />
          <SubmitButton handleSubmit={handleSubmit} loading={loading} />
        </>
      )}
    </div>
  );
};

export default DrawingApp;
