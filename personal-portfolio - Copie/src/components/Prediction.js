import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Col, Row, Alert } from "react-bootstrap";
import Vis from "./vis"; // Import the Vis component

export const Prediction = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionSuccess, setPredictionSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [predictionCompleted, setPredictionCompleted] = useState(false);
  const [predictionMessage, setPredictionMessage] = useState("");
  const [predictionFileURL, setPredictionFileURL] = useState("");
  const [showVis, setShowVis] = useState(false);
  const [predicting, setPredicting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file.name);
  };

  const handleUpload = async () => {
    setPredicting(true);
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
      setPredicting(false);
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

  function scrollToVis() {
    const visContainer = document.querySelector('.visContainer'); // Remplacez '.visContainer' par la classe ou l'identifiant de votre élément contenant le composant Vis
    if (visContainer) {
      visContainer.scrollIntoView(); // Faites défiler en douceur vers le composant Vis
      console.log(visContainer);
    }
  }
  


  return (
    <>
    <Col lg={12}>
      <div className="newsletter-bx wow slideInUp new-email-bx">
        <input
          type="file"
          id="uploadInput"
          accept=".obj,.vtp"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="file-input-container" style={{ display: "flex", alignItems: "center" }}>
          {selectedFileName && !predictionSuccess ? (
            <p className="selected-file" style={{ color: "black", marginRight: "10px" }}>
              Selected File : {selectedFileName}
            </p>
          ) : null}

          {!selectedFileName && !predictionSuccess ? (
            <label htmlFor="uploadInput" style={{ textDecoration: "underline", cursor: "pointer", marginRight: "10px" }}>
              <h3>+ Upload Object</h3>
          </label>
          ) : null}

          {!predictionSuccess ? (
            <button type="submit" onClick={handleUpload}>
              {predicting ? "Predicting..." : "Predict"}
            </button>
          ) : null}
          {predictionCompleted && predictionSuccess ? (
            <h4>{predictionMessage}</h4>
          ) : null}
        </div>
        {(!predictionCompleted || !predictionSuccess) && (
          <div>
            <h4>Supported Files : (.vtp, .obj)</h4>
          </div>
        )}
        {predictionCompleted && predictionSuccess && predictionFileURL ? (
          <div>
            <button onClick={handleDownload}>Download the VTP file</button>
            <button onClick={scrollToVis}>Show predicted VTP object</button>
            <div className="visContainer" id="visContainer">
              <Vis predictionFileURL={predictionFileURL} />
            </div> 
          </div>
        ) : null}
         
      </div>
    </Col>
    
    </>
  );
}
