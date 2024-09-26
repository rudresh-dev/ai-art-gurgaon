


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





// import React, { useState, useRef } from 'react';
// import { Stage, Layer, Rect, Line, Image } from 'react-konva';
// import useImage from 'use-image';

// function App() {
//   const stageRef = useRef(null);
//   const [images, setImages] = useState([]);
//   const [lines, setLines] = useState([]);
//   const [isDrawing, setIsDrawing] = useState(false);

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const files = event.target.files;
//     const imageObjects = [];

//     // Loop through selected files and create URLs
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const url = URL.createObjectURL(file);
//       imageObjects.push({ id: i + images.length, src: url, x: 50 + i * 150, y: 50 });
//     }

//     setImages([...images, ...imageObjects]);
//   };

//   // Handle drawing
//   const handleMouseDown = (e) => {
//     setIsDrawing(true);
//     const pos = e.target.getStage().getPointerPosition();
//     setLines([...lines, { points: [pos.x, pos.y] }]);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing) return;

//     const stage = e.target.getStage();
//     const point = stage.getPointerPosition();
//     const lastLine = lines[lines.length - 1];
//     lastLine.points = lastLine.points.concat([point.x, point.y]);

//     setLines([...lines.slice(0, lines.length - 1), lastLine]);
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '20px' }}>
//       <input
//         type="file"
//         multiple
//         onChange={handleImageUpload}
//         style={{ marginBottom: '20px' }}
//       />
//       <Stage
//         width={window.innerWidth}
//         height={window.innerHeight - 100}
//         ref={stageRef}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         style={{ border: '1px solid grey' }}
//       >
//         <Layer>
//           {images.map((image) => (
//             <UploadedImage key={image.id} image={image} />
//           ))}
//           {lines.map((line, i) => (
//             <Line
//               key={i}
//               points={line.points}
//               stroke="black"
//               strokeWidth={5}
//               tension={0.5}
//               lineCap="round"
//               globalCompositeOperation={
//                 line.tool === 'eraser' ? 'destination-out' : 'source-over'
//               }
//             />
//           ))}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

// // Separate component to render uploaded images
// const UploadedImage = ({ image }) => {
//   const [loadedImage] = useImage(image.src);
//   return (
//     <Image
//       image={loadedImage}
//       x={image.x}
//       y={image.y}
//       width={150}
//       height={150}
//       draggable
//     />
//   );
// };

// export default App;
