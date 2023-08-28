import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Col, Row, Alert } from "react-bootstrap";
import Vis from "./vis"; // Import the Vis component

export const Newsletter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionSuccess, setPredictionSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [predictionCompleted, setPredictionCompleted] = useState(false);
  const [predictionMessage, setPredictionMessage] = useState("");
  const [predictionFileURL, setPredictionFileURL] = useState("");
  const [showVisComponent, setShowVisComponent] = useState(false);
  const [showVis, setShowVis] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file.name);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('meshFile', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      setPredictionSuccess(true);
      setPredictionCompleted(true);
      setPredictionMessage("Prediction successful!");
      setPredictionFileURL(url);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = () => {
    if (predictionFileURL) {
      const link = document.createElement('a');
      link.href = predictionFileURL;
      link.download = 'output_file.vtp';
      link.click();
    } else {
      console.error('No prediction file URL available.');
    }
  };

  const toggleVis = () => {
    setShowVisComponent((prevState) => !prevState);
  };

  useEffect(() => {
    if (showVis) {
      toggleVis(); // Close the Vis component when showVis state changes
    }
  }, [showVis]);

  return (
    <Col lg={12}>
      <div className="newsletter-bx wow slideInUp new-email-bx">
        <input
          type="file"
          id="uploadInput"
          accept=".obj,.stl,.vtp,.glb,.gltf,.fbx,.jpg"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="file-input-container">
          {!predictionSuccess ? (
            <label htmlFor="uploadInput" style={{ textDecoration: "underline", cursor: "pointer" }}>
              <h3>+ Upload Object</h3>
            </label>
          ) : null}
          {selectedFileName && !predictionSuccess ? (
            <p className="selected-file">Selected File: {selectedFileName}</p>
          ) : null}
          {!predictionSuccess ? (
            <button type="submit" onClick={handleUpload}>
              Predict
            </button>
          ) : null}
          {predictionCompleted && predictionSuccess ? (
            <h4>{predictionMessage}</h4>
          ) : null}
        </div>
        {(!predictionCompleted || !predictionSuccess) && (
          <div>
            <h4>Supported Files :</h4>
            <h4>(.vtp, .obj)</h4>
          </div>
        )}
        {predictionCompleted && predictionSuccess && predictionFileURL ? (
          <div>
            <button onClick={handleDownload}>Télécharger le fichier VTP</button>
            <a href="vis"><button onClick={() => setShowVis(true)}>Afficher l'objet VTP prédit</button></a>
          </div>
        ) : null}
        {showVis && <Vis predictionFileURL={predictionFileURL} />}
      </div>
    </Col>
  );
}






