import { useEffect } from 'react';
import '@kitware/vtk.js/favicon';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import { formatBytesToProperUnit, debounce } from '@kitware/vtk.js/macros';
import HttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkScalarBarActor from '@kitware/vtk.js/Rendering/Core/ScalarBarActor';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader';
import vtkFPSMonitor from '@kitware/vtk.js/Interaction/UI/FPSMonitor';
import { XrSessionTypes } from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow/Constants';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper';
import {
  ColorMode,
  ScalarMode,
} from '@kitware/vtk.js/Rendering/Core/Mapper/Constants';
import style from '../css/GeometryViewer.module.css';



let autoInit = true;
let background = [0, 0, 0];
let fullScreenRenderWindow;
let renderWindow;
let renderer;
let scalarBarActor;


function Vis({ predictionFileURL }) {

  useEffect(() => {
    const userParams = vtkURLExtract.extractURLParameters();

    // Background handling
    if (userParams.background) {
      background = userParams.background.split(',').map((s) => Number(s));
    }
    const selectorClass =
      background.length === 3 && background.reduce((a, b) => a + b, 0) < 1.5
        ? style.dark
        : style.light;

    // lut
    const lutName = userParams.lut || 'erdc_rainbow_bright';

    // field
    const field = userParams.field || '';

    // camera
    function updateCamera(camera) {
      ['zoom', 'pitch', 'elevation', 'yaw', 'azimuth', 'roll', 'dolly'].forEach(
        (key) => {
          if (userParams[key]) {
            camera[key](userParams[key]);
          }
          renderWindow.render();
        }
      );
    }

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // WebXR
    let requestedXrSessionType =
      userParams.xrSessionType !== undefined ? userParams.xrSessionType : null;
    if (
      requestedXrSessionType !== null &&
      !Object.values(XrSessionTypes).includes(requestedXrSessionType)
    ) {
      console.warn(
        'Could not parse requested XR session type: ',
        requestedXrSessionType
      );
      requestedXrSessionType = null;
    }

    if (requestedXrSessionType === XrSessionTypes.LookingGlassVR) {
      import( 'https://unpkg.com/@lookingglass/webxr@0.3.0/dist/@lookingglass/bundle/webxr.js').then((obj) => {
        new obj.LookingGlassWebXRPolyfill();
      });
    } else if (requestedXrSessionType === null) {
      navigator.xr.isSessionSupported('immersive-vr').then((vrSupported) => {
        if (vrSupported) {
          requestedXrSessionType = XrSessionTypes.HmdVr;
        } else {
          navigator.xr.isSessionSupported('immersive-ar').then((arSupported) => {
            requestedXrSessionType = arSupported ? XrSessionTypes.MobileAR : null;
          });
        }
      });
    }

    // ----------------------------------------------------------------------------
    // DOM containers for UI control
    // ----------------------------------------------------------------------------

    const rootControllerContainer = document.createElement('div');
    rootControllerContainer.setAttribute('class', style.rootController);

    const addDataSetButton = document.createElement('img');
    addDataSetButton.setAttribute('class', style.button);
    //addDataSetButton.setAttribute('src', icon);
    addDataSetButton.addEventListener('click', () => {
      const isVisible = rootControllerContainer.style.display !== 'none';
      rootControllerContainer.style.display = isVisible ? 'none' : 'flex';
    });

    const fpsMonitor = vtkFPSMonitor.newInstance();
    const fpsElm = fpsMonitor.getFpsMonitorContainer();
    fpsElm.classList.add(style.fpsMonitor);

    // ----------------------------------------------------------------------------
    // Add class to body if iOS device
    // ----------------------------------------------------------------------------

    const iOS = /iPad|iPhone|iPod/.test(window.navigator.platform);

    if (iOS) {
      document.querySelector('body').classList.add('is-ios-device');
    }

    // ----------------------------------------------------------------------------

    

    // ----------------------------------------------------------------------------

    function createViewer(container) {
      fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
        background,
        rootContainer: container,
        containerStyle: { height: '100%', width: '100%', position: 'absolute' },
      });
      renderer = fullScreenRenderWindow.getRenderer();
      renderWindow = fullScreenRenderWindow.getRenderWindow();
      renderWindow.getInteractor().setDesiredUpdateRate(15);

      container.appendChild(rootControllerContainer);
      container.appendChild(addDataSetButton);

      scalarBarActor = vtkScalarBarActor.newInstance();
      renderer.addActor(scalarBarActor);

      if (userParams.fps) {
        if (Array.isArray(userParams.fps)) {
          fpsMonitor.setMonitorVisibility(...userParams.fps);
          if (userParams.fps.length === 4) {
            fpsMonitor.setOrientation(userParams.fps[3]);
          }
        }
        fpsMonitor.setRenderWindow(renderWindow);
        fpsMonitor.setContainer(container);
        fullScreenRenderWindow.setResizeCallback(fpsMonitor.update);
      }
    }

    // ----------------------------------------------------------------------------

    function createPipeline(fileName, predictionFileURL) {
      const presetSelector = document.createElement('select');
      presetSelector.setAttribute('class', selectorClass);
      presetSelector.innerHTML = vtkColorMaps.rgbPresetNames
      
        .map(
          (name) =>
            `<option value="${name}" ${
              lutName === name ? 'selected="selected"' : ''
            }>${name}</option>`
        )
        .join('');

      const representationSelector = document.createElement('select');
      representationSelector.setAttribute('class', selectorClass);
      representationSelector.innerHTML = [
        'Hidden',
        'Points',
        'Wireframe',
        'Surface',
        'Surface with Edge',
      ]
        .map(
          (name, idx) =>
            `<option value="${idx === 0 ? 0 : 1}:${idx < 4 ? idx - 1 : 2}:${
              idx === 4 ? 1 : 0
            }">${name}</option>`
        )
        .join('');
      representationSelector.value = '1:2:0';

      const colorBySelector = document.createElement('select');
      colorBySelector.setAttribute('class', selectorClass);

      const componentSelector = document.createElement('select');
      componentSelector.setAttribute('class', selectorClass);
      componentSelector.style.display = 'none';

      const opacitySelector = document.createElement('input');
      opacitySelector.setAttribute('class', selectorClass);
      opacitySelector.setAttribute('type', 'range');
      opacitySelector.setAttribute('value', '100');
      opacitySelector.setAttribute('max', '100');
      opacitySelector.setAttribute('min', '1');

      const labelSelector = document.createElement('label');
      labelSelector.setAttribute('class', selectorClass);
      labelSelector.innerHTML = fileName;

      const immersionSelector = document.createElement('button');
      immersionSelector.setAttribute('class', selectorClass);
      immersionSelector.innerHTML =
        requestedXrSessionType === XrSessionTypes.MobileAR
          ? 'Start AR'
          : 'Start VR';

      const controlContainer = document.createElement('div');
      controlContainer.setAttribute('class', style.control);
      controlContainer.appendChild(labelSelector);
      controlContainer.appendChild(representationSelector);
      controlContainer.appendChild(presetSelector);
      controlContainer.appendChild(colorBySelector);
      controlContainer.appendChild(componentSelector);
      controlContainer.appendChild(opacitySelector);

      if (
        navigator.xr !== undefined &&
        fullScreenRenderWindow.getApiSpecificRenderWindow().getXrSupported() &&
        requestedXrSessionType !== null
      ) {
        controlContainer.appendChild(immersionSelector);
      }
      rootControllerContainer.appendChild(controlContainer);

      // VTK pipeline
      const vtpReader = vtkXMLPolyDataReader.newInstance();
      vtpReader.parseAsArrayBuffer(predictionFileURL);

      const lookupTable = vtkColorTransferFunction.newInstance();
      const source = vtpReader.getOutputData(0);
      const mapper = vtkMapper.newInstance({
        interpolateScalarsBeforeMapping: false,
        useLookupTableScalarRange: true,
        lookupTable,
        scalarVisibility: false,
      });
      const actor = vtkActor.newInstance();
      const scalars = source.getPointData().getScalars();
      const dataRange = [].concat(scalars ? scalars.getRange() : [0, 1]);
      let activeArray = vtkDataArray;

      // --------------------------------------------------------------------
      // Color handling
      // --------------------------------------------------------------------

      function applyPreset() {
        const preset = vtkColorMaps.getPresetByName(presetSelector.value);
        lookupTable.applyColorMap(preset);
        lookupTable.setMappingRange(dataRange[0], dataRange[1]);
        lookupTable.updateRange();
        renderWindow.render();
      }
      applyPreset();
      presetSelector.addEventListener('change', applyPreset);

      // --------------------------------------------------------------------
      // Representation handling
      // --------------------------------------------------------------------

      function updateRepresentation(event) {
        const [visibility, representation, edgeVisibility] = event.target.value
          .split(':')
          .map(Number);
        actor.getProperty().set({ representation, edgeVisibility });
        actor.setVisibility(!!visibility);
        renderWindow.render();
      }
      representationSelector.addEventListener('change', updateRepresentation);

      // --------------------------------------------------------------------
      // Opacity handling
      // --------------------------------------------------------------------

      function updateOpacity(event) {
        const opacity = Number(event.target.value) / 100;
        actor.getProperty().setOpacity(opacity);
        renderWindow.render();
      }

      opacitySelector.addEventListener('input', updateOpacity);

      // --------------------------------------------------------------------
      // ColorBy handling
      // --------------------------------------------------------------------

      const colorByOptions = [{ value: ':', label: '(c) Label' }].concat(
        source
          .getPointData()
          .getArrays()
          .map((a) => ({
            label: `(p) ${a.getName()}`,
            value: `PointData:${a.getName()}`,
          })),
        source
          .getCellData()
          .getArrays()
          .map((a) => ({
            label: `(c) ${a.getName()}`,
            value: `CellData:${a.getName()}`,
          }))
      );
      colorBySelector.innerHTML = colorByOptions
        .map(
          ({ label, value }) =>
            `<option value="${value}" ${
              field === value ? 'selected="selected"' : ''
            }>${label}</option>`
        )
        .join('');

      function updateColorBy(event) {
        const [location, colorByArrayName] = event.target.value.split(':');
        const interpolateScalarsBeforeMapping = location === 'PointData';
        let colorMode = ColorMode.DEFAULT;
        let scalarMode = ScalarMode.DEFAULT;
        const scalarVisibility = location.length > 0;
        if (scalarVisibility) {
          const newArray =
            source[`get${location}`]().getArrayByName(colorByArrayName);
          activeArray = newArray;
          const newDataRange = activeArray.getRange();
          dataRange[0] = newDataRange[0];
          dataRange[1] = newDataRange[1];
          colorMode = ColorMode.MAP_SCALARS;
          scalarMode =
            location === 'PointData'
              ? ScalarMode.USE_POINT_FIELD_DATA
              : ScalarMode.USE_CELL_FIELD_DATA;

          const numberOfComponents = activeArray.getNumberOfComponents();
          if (numberOfComponents > 1) {
            // always start on magnitude setting
            if (mapper.getLookupTable()) {
              const lut = mapper.getLookupTable();
              lut.setVectorModeToMagnitude();
            }
            componentSelector.style.display = 'block';
            const compOpts = [['Magnitude', -1]];
            while (compOpts.length <= numberOfComponents) {
              compOpts.push([`Component ${compOpts.length}`, compOpts.length - 1]);
            }
            if (numberOfComponents === 3 || numberOfComponents === 4) {
              compOpts.push([`Use direct mapping`, -2]);
            }
            componentSelector.innerHTML = compOpts
              .map((t) => `<option value="${t[1]}">${t[0]}</option>`)
              .join('');
          } else {
            componentSelector.style.display = 'none';
          }
          scalarBarActor.setAxisLabel(colorByArrayName);
          scalarBarActor.setVisibility(true);
        } else {
          componentSelector.style.display = 'none';
          scalarBarActor.setVisibility(false);
        }
        mapper.set({
          colorByArrayName,
          colorMode,
          interpolateScalarsBeforeMapping,
          scalarMode,
          scalarVisibility,
        });
        applyPreset();
      }
      colorBySelector.addEventListener('change', updateColorBy);
      updateColorBy({ target: colorBySelector });

      function updateColorByComponent(event) {
        if (mapper.getLookupTable()) {
          const lut = mapper.getLookupTable();
          mapper.setColorModeToMapScalars();
          if (event.target.value === '-2') {
            mapper.setColorModeToDirectScalars();
          } else if (event.target.value === '-1') {
            lut.setVectorModeToMagnitude();
          } else {
            lut.setVectorModeToComponent();
            lut.setVectorComponent(Number(event.target.value));
            const newDataRange = activeArray.getRange(Number(event.target.value));
            dataRange[0] = newDataRange[0];
            dataRange[1] = newDataRange[1];
            lookupTable.setMappingRange(dataRange[0], dataRange[1]);
            lut.updateRange();
          }
          renderWindow.render();
        }
      }
      componentSelector.addEventListener('change', updateColorByComponent);

      // --------------------------------------------------------------------
      // Immersion handling
      // --------------------------------------------------------------------

      function toggleXR() {
        if (immersionSelector.textContent.startsWith('Start')) {
          fullScreenRenderWindow
            .getApiSpecificRenderWindow()
            .startXR(requestedXrSessionType);
          immersionSelector.textContent = [
            XrSessionTypes.HmdAR,
            XrSessionTypes.MobileAR,
          ].includes(requestedXrSessionType)
            ? 'Exit AR'
            : 'Exit VR';
        } else {
          fullScreenRenderWindow.getApiSpecificRenderWindow().stopXR();
          immersionSelector.textContent = [
            XrSessionTypes.HmdAR,
            XrSessionTypes.MobileAR,
          ].includes(requestedXrSessionType)
            ? 'Start AR'
            : 'Start VR';
        }
      }
      immersionSelector.addEventListener('click', toggleXR);

      // --------------------------------------------------------------------
      // Pipeline handling
      // --------------------------------------------------------------------

      actor.setMapper(mapper);
      mapper.setInputData(source);
      renderer.addActor(actor);

      scalarBarActor.setScalarsToColors(mapper.getLookupTable());

      // Manage update when lookupTable change
      const debouncedRender = debounce(renderWindow.render, 10);
      lookupTable.onModified(debouncedRender, -1);
      
      // First render
      renderer.resetCamera();
      renderWindow.render();

      // Update stats
      fpsMonitor.update();
    }

    // ----------------------------------------------------------------------------

    function loadFile(file) {
      const reader = new FileReader();
      reader.onload = function onLoad(e) {
        createPipeline(file.name, reader.result);
      };
      reader.readAsArrayBuffer(file);
    }

    // ----------------------------------------------------------------------------

    function load(container, options) {
      autoInit = false;

      if (options.files) {
        createViewer(container);
        let count = options.files.length;
        while (count--) {
          loadFile(options.files[count]);
        }
        updateCamera(renderer.getActiveCamera());
      } else if (options.fileURL) {
        const urls = [].concat(options.fileURL);
        const progressContainer = document.createElement('div');
        progressContainer.setAttribute('class', style.progress);
        container.appendChild(progressContainer);

        const progressCallback = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = Math.floor(
              (100 * progressEvent.loaded) / progressEvent.total
            );
            progressContainer.innerHTML = `Loading ${percent}%`;
          } else {
            progressContainer.innerHTML = formatBytesToProperUnit(
              progressEvent.loaded
            );
          }
        };

        createViewer(container);
        const nbURLs = urls.length;
        let nbLoadedData = 0;

        /* eslint-disable no-loop-func */
        while (urls.length) {
          const url = urls.pop();
          const name = Array.isArray(userParams.name)
            ? userParams.name[urls.length]
            : `Data ${urls.length + 1}`;
          HttpDataAccessHelper.fetchBinary(url, {
            progressCallback,
          }).then((binary) => {
            nbLoadedData++;
            if (nbLoadedData === nbURLs) {
              container.removeChild(progressContainer);
            }
            createPipeline(name, binary);
            updateCamera(renderer.getActiveCamera());
          });
        }
      }
    }

    

    // Look at URL an see if we should load a file
    

    // Load data based on the predictionFileURL
    if (predictionFileURL) {
      const exampleContainer = document.querySelector('.content');
      const rootBody = document.querySelector('body');
      const myContainer = exampleContainer || rootBody;

      if (myContainer) {
        myContainer.classList.add(style.fullScreen);
        rootBody.style.margin = '0';
        rootBody.style.padding = '0';
      }

      load(myContainer, { fileURL: predictionFileURL });
    }

    

  }, []); 
}

export default Vis;
