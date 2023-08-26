// Chargez les modules de vtk.js nécessaires
import 'vtk.js/Sources/favicon';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';

// Créez une instance du lecteur VTP
const reader = vtkXMLPolyDataReader.newInstance();

// Remplacez le chemin vers votre fichier VTP
reader.setUrl('outputs/1_d_predicted.vtp').then(() => {
  reader.loadData().then(() => {
    const polydata = reader.getOutputData(0);

    // Convertissez les données VTK en un objet JSON
    const jsonData = polydata.getPoints().getData().map((coord, index) => {
      return {
        x: coord[0],
        y: coord[1],
        z: coord[2],
      };
    });

    // Exportez les données JSON dans un format compatible avec Three.js
    const jsonString = JSON.stringify(jsonData);
    console.log(jsonString); // Affichez les données JSON dans la console
  });
});
