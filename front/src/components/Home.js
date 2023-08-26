import React, { Component } from "react";
import axios from 'axios';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import "./HomeStyles.css";
import Vis from "./vis"; // Import the Vis component

class Home extends Component {
  constructor() {
    super();
    this.state = {
      uploadedImage: null,
      selectedFile: null,
      predictionSuccess: false,
      selectedFileName: "",
      predictionCompleted: false,
      predictionMessage: "",
      vtkSceneRendered: false,
      showVisComponent: false,
      showVis: false, // Initialize the visibility state

    };
  }

  toggleVis = () => {
    this.setState((prevState) => ({ showVis: !prevState.showVis }));
  };

  handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ uploadedImage: e.target.result, selectedFile, selectedFileName: selectedFile.name });
    };
    reader.readAsDataURL(selectedFile);
  };

  handleUpload = async () => {
      const { selectedFile } = this.state;
      const formData = new FormData();
      formData.append('meshFile', selectedFile);

      try {
        const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
          responseType: 'blob', // Indique que la réponse sera sous forme de fichier
        });

        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        this.setState({
          predictionSuccess: true,
          predictionCompleted: true,
          predictionMessage: "Prediction successful!",
          predictionFileURL: url, // Nouveau state pour stocker l'URL du fichier VTP
        });
        

      } catch (error) {
        console.error('Error uploading file:', error);
      }
  };

  handleDownload = () => {
    const { predictionFileURL } = this.state;
  
    if (predictionFileURL) {
      const link = document.createElement('a');
      link.href = predictionFileURL;
      link.download = 'output_file.vtp';
      link.click();
    } else {
      console.error('No prediction file URL available.');
    }
  };

  
  toggleVis = () => {
    this.setState((prevState) => ({ showVisComponent: !prevState.showVisComponent }));
  };
  

  render() {
    const {
      predictionSuccess,
      selectedFileName,
      predictionCompleted,
      predictionMessage,
      predictionFileURL,
      showVis,
      showVisComponent,
    } = this.state;


    return (
      <div className="center-container">
        <input
          type="file"
          id="uploadInput"
          accept=".obj,.stl,.vtp,.glb,.gltf,.fbx,.jpg"
          style={{ display: "none" }}
          onChange={this.handleFileChange}
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
            <button type="button" onClick={this.handleUpload}>
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
            <button onClick={this.handleDownload}>Télécharger le fichier VTP</button>
            <button onClick={this.toggleVis}>Afficher l'objet VTP prédit</button>
          </div>
        ) : null}
        {showVisComponent && <Vis predictionFileURL={predictionFileURL} />}
      </div>
    );
  }
}

export default Home;
