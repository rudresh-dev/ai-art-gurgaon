// import React from "react";

// const LineArtSelector = ({ onLineArtSelect }) => {
//   // These are placeholders for line art images, replace with actual URLs or images
//   // const lineArtImages = [
//   //     '/1.jpg',
//   //     '/2.jpg',
//   //     '/3.jpg'
//   // ];

//   const lineArtImages = [
//     { src: "/a1.svg", text: "A cycle" },
//     { src: "/a2.svg", text: "a tree" },
//     { src: "/a3.png", text: "a tree" },
//     { src: "/a4.png", text: "A cow" },
//   ];

//   return (
//     <div>
//       <h4>SELECT SHAPES</h4>
//       <div style={{ display: "flex", gap: "10px", }}>
//         {lineArtImages.map((lineArt, index) => (
//           <img
//             key={index}
//             src={lineArt.src}
//             alt={`Line Art ${index + 1}`}
//             draggable="true"
//             onClick={() => onLineArtSelect(lineArt)} // Pass the image and associated text
//             style={{
//               width: "100px",
//               height: "100px",
//               cursor: "grab",
//               border: "1px solid #fff",
//               borderRadius:"14px",
//             //   backgroundColor:"#fff",
//               padding:"13px"
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LineArtSelector;

// import React, { useState } from "react";

// const LineArtSelector = ({ onLineArtSelect }) => {
//   // Main line art images with corresponding sub-images
//   const lineArtDivs = [
//     {
//       src: "/a1.svg",
//       text: "A cycle",
//       subImages: [
//         { src: "/dd/a1.svg", text: "A bike wheel" },
//         { src: "/dd/a2.svg", text: "A handlebar" },
//         { src: "/dd/a3.svg", text: "A seat" },
//         { src: "/dd/a4.svg", text: "A pedal" },
//       ],
//     },
//     {
//       src: "/a2.svg",
//       text: "A tree",
//       subImages: [
//         { src: "/dd/b1.svg", text: "A leaf" },
//         { src: "/dd/b2.svg", text: "A branch" },
//         { src: "/dd/b3.svg", text: "A root" },
//         { src: "/dd/b4.svg", text: "A trunk" },
//       ],
//     },
//     {
//       src: "/a3.png",
//       text: "A tree",
//       subImages: [
//         { src: "/dd/c1.svg", text: "A small tree" },
//         { src: "/dd/c2.svg", text: "A medium tree" },
//         { src: "/dd/c3.svg", text: "A large tree" },
//         { src: "/dd/c4.svg", text: "A tiny tree" },
//       ],
//     },
//     {
//       src: "/a4.png",
//       text: "A cow",
//       subImages: [
//         { src: "/dd/d1.svg", text: "A cow head" },
//         { src: "/dd/d2.png", text: "A cow body" },
//         { src: "/dd/d3.svg", text: "A cow tail" },
//         { src: "/dd/d4.svg", text: "A cow legs" },
//       ],
//     },
//   ];

//   // State to track the active main image
//   const [activeIndex, setActiveIndex] = useState(0); // Start with the first image active

//   // Handle when the main image is clicked, setting it as active
//   const handleMainImageClick = (index) => {
//     setActiveIndex(index); // Update the active index
//   };

//   return (
//     <div>
//       <h4>Select Line Art Shape</h4>
//       {/* Main Image Selector */}
//       <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
//         {lineArtDivs.map((lineArt, index) => (
//           <div
//             key={index}
//             onClick={() => handleMainImageClick(index)} // Set the clicked image as active
//             style={{
//               border: activeIndex === index ? "3px solid #000" : "1px solid #fff",
//               borderRadius: "8px",
//               padding: "5px 38px",
//               cursor: "pointer",
//               backgroundColor: activeIndex === index ? "#f0f0f0" : "#000",
//               color: activeIndex === index ? "#000" : "#fff",
//             }}
//           >
//             {/* <img
//               src={lineArt.src}
//               alt={`Line Art ${index + 1}`}
//               style={{
//                 width: "100px",
//                 height: "100px",
//               }}
//             /> */}

//             <p>{lineArt.text}</p>
//           </div>
//         ))}
//       </div>

//       {/* Sub-Image Selector based on active main image */}
//       <div style={{ display: "flex", gap: "10px" }}>
//         {lineArtDivs[activeIndex].subImages.map((subImage, subIndex) => (
//           <img
//             key={subIndex}
//             src={subImage.src}
//             alt={`Sub Image ${subIndex + 1}`}
//             draggable="true"
//             onClick={() => onLineArtSelect(subImage)} // Pass the selected sub-image to the parent
//             style={{
//               width: "100px",
//               height: "100px",
//               cursor: "grab",
//               border: "1px solid #fff",
//               borderRadius: "14px",
//               padding: "13px",
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LineArtSelector;

import React, { useState } from "react";

const LineArtSelector = ({ onLineArtSelect }) => {
  // Main line art images with corresponding sub-images and icons
  const lineArtDivs = [
    {
      src: "/a1.svg",
      text: "Nature",
      subImages: [
        { src: "/dd/a1.svg", icon: "/d/a1.svg", text: "Big Tree" },
        { src: "/dd/a2.svg", icon: "/d/a2.svg", text: "Pasture" },
        { src: "/dd/a3.svg", icon: "/d/a3.svg", text: "Leaf" },
        { src: "/dd/a4.svg", icon: "/d/a4.svg", text: "Flower" },
      ],
    },
    {
      src: "/a2.svg",
      text: "Space",
      subImages: [
        { src: "/dd/b1.svg", icon: "/d/b1.svg", text: "Astroids" },
        { src: "/dd/b2.svg", icon: "/d/b2.svg", text: "Comet" },
        { src: "/dd/b3.svg", icon: "/d/b3.svg", text: "Planet" },
        { src: "/dd/b4.svg", icon: "/d/b4.svg", text: "Astronaut" },
      ],
    },
    {
      src: "/a3.png",
      text: "Automobile",
      subImages: [
        { src: "/dd/c1.svg", icon: "/d/c1.svg", text: "Car" },
        { src: "/dd/c2.svg", icon: "/d/c2.svg", text: "Ship" },
        { src: "/dd/c3.svg", icon: "/d/c3.svg", text: "Aeroplane" },
        { src: "/dd/c4.svg", icon: "/d/c4.svg", text: "Bus" },
      ],
    },
    {
      src: "/a4.png",
      text: "Animal",
      subImages: [
        { src: "/aa3.png", icon: "/d/d1.svg", text: "Horse" },
        { src: "/aa1.png", icon: "/d/d2.svg", text: "Tortise" },
        { src: "/aa2.png", icon: "/d/d3.svg", text: "Lion" },
        { src: "/aa4.png", icon: "/d/d4.svg", text: "Camel" },
      ],
    },
  ];

  // State to track the active main image
  const [activeIndex, setActiveIndex] = useState(0); // Start with the first image active

  // Handle when the main image is clicked, setting it as active
  const handleMainImageClick = (index) => {
    setActiveIndex(index); // Update the active index
  };

  return (
    <div style={{marginBottom:"30px"}}>
      <h4 style={{ color: "white", fontWeight: 600, fontSize: 16, paddingBottom:16 }}>
        SELECT SHAPES
      </h4>
      {/* Main Image Selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {lineArtDivs.map((lineArt, index) => (
          <div
            key={index}
            onClick={() => handleMainImageClick(index)} // Set the clicked image as active
            style={{
              border:
                activeIndex === index ? "3px solid #000" : "1px solid #fff",
              borderRadius: "8px",
              padding: "5px 34px",
              cursor: "pointer",
              background: activeIndex === index ? "#f0f0f0" : "transparent",
              color: activeIndex === index ? "#000" : "#fff",
            }}
          >
            <p>{lineArt.text}</p>
          </div>
        ))}
      </div>

      {/* Sub-Image Selector based on active main image */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {lineArtDivs[activeIndex].subImages.map((subImage, subIndex) => (
          <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
            <div
              key={subIndex}
              onClick={() => onLineArtSelect(subImage)} // Pass the selected sub-image to the parent
              draggable="true"
              style={{
                cursor: "grab",
                border: "1px solid #fff",
                borderRadius: "14px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Show icon in div */}
              <img
                src={subImage.icon}
                alt={`Icon ${subIndex + 1}`}
                style={{ width: "100px", height: "70px", marginBottom: "5px" }}
              />
              {/* Display text */}
            </div>
            <div>
              <p style={{ fontSize: "12px", textAlign: "center", color:"white" }}>
                {subImage.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineArtSelector;
