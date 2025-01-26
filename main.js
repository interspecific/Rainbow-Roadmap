require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/GroupLayer", // Import GroupLayer
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "esri/widgets/Fullscreen"
], function (Map, MapView, FeatureLayer, GroupLayer, LayerList, Search, Fullscreen) {
  
  // Initialize the map
  const map = new Map({
    basemap: "gray-vector" // Other options: "streets-night-vector", "dark-gray-vector"
  });
  

  // Initialize the map view
  const view = new MapView({
    container: "viewDiv", // Ensure this matches the HTML ID
    map: map,
    center: [-98.57, 39.82], // Center map on United States
    zoom: 3
  });

// Splash Screen Logic
const splashScreen = document.getElementById("splashScreen");
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  splashScreen.classList.add("hidden");
  setTimeout(() => (splashScreen.style.display = "none"), 500); // Hides splash screen after animation
});

// Function to show the splash screen
function showSplashScreen() {
  const splashScreen = document.getElementById("splashScreen");
  splashScreen.classList.remove("hidden");
  splashScreen.style.display = "flex"; // Make sure it's visible
}

// Attach the event listener to the button
document.getElementById("showSplashButton").addEventListener("click", showSplashScreen);


// Function to create and add the "Add Safe Place to Map" button
function createAddLocationButton(view) {
  const addButton = document.createElement("button");
  addButton.id = "addLocationButton";
  addButton.innerHTML = "Add Safe Place to Map";
  addButton.style.padding = "10px";
  addButton.style.backgroundColor = "#6c4aad";
  addButton.style.color = "white";
  addButton.style.border = "none";
  addButton.style.cursor = "pointer";
  addButton.style.borderRadius = "4px";
  addButton.style.margin = "5px";
  addButton.style.position = "absolute";
  addButton.style.left = "20px";
  addButton.style.zIndex = "10";

  // Dynamically adjust the bottom position based on screen size
  function adjustButtonPosition() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      addButton.style.bottom = "40px"; // For very small screens (phones)
    } else if (screenWidth <= 768) {
      addButton.style.bottom = "40px"; // For medium screens (tablets)
    } else {
      addButton.style.bottom = "30px"; // Default position for larger screens
    }
  }

  // Call the function once to set the initial position
  adjustButtonPosition();

  // Listen for window resize events to adjust the position dynamically
  window.addEventListener("resize", adjustButtonPosition);

  // Add click functionality
  addButton.addEventListener("click", () => {
    toggleForm(); // Call toggleForm to handle showing the form modal
  });

  // Append the button to the map container
  const viewDiv = document.getElementById("viewDiv");
  viewDiv.appendChild(addButton);
}

// Call this function after the map view is initialized
createAddLocationButton(view);




function adjustButtonForSafeArea() {
  const addButton = document.getElementById("addLocationButton");
  const safeAreaInsetBottom = window.innerHeight - document.documentElement.clientHeight;

  if (safeAreaInsetBottom > 0) {
    // Add extra spacing dynamically
    addButton.style.bottom = `${40 + safeAreaInsetBottom}px`;
  }
}

// Run the function on page load and resize
window.addEventListener("load", adjustButtonForSafeArea);
window.addEventListener("resize", adjustButtonForSafeArea);





// Function to toggle the form modal and overlay
function toggleForm() {
  const modal = document.getElementById("formModal");
  const overlay = document.getElementById("overlay");
  const isHidden = modal.style.display === "none" || modal.style.display === "";

  if (isHidden) {
    // Show modal and overlay
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    modal.style.display = "block";
    overlay.style.display = "block";
  } else {
    // Hide modal and overlay
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    setTimeout(() => {
      modal.style.display = "none";
      overlay.style.display = "none";
    }, 500); // Match the fade-out animation duration
  }
}

// Add functionality to close the form via the close button
document.getElementById("closeButton").addEventListener("click", () => {
  toggleForm(); // Close the form modal
});

// Add functionality to close the form via the overlay
document.getElementById("overlay").addEventListener("click", () => {
  toggleForm(); // Close the form modal
});





  

  






  // =======================
  // Add Widgets to the Map
  // =======================

  // Add a Search widget
  const searchWidget = new Search({
    view: view
  });
  view.ui.add(searchWidget, "bottom-right");

  // // Add Fullscreen widget
  // const fullscreenWidget = new Fullscreen({
  //   view: view
  // });
  // view.ui.add(fullscreenWidget, "top-left");




// =======================
// Accordion Functionality
// =======================
document.querySelectorAll('.accordion-button').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    const caret = button.querySelector('.caret');

    if (content) {
      const isVisible = content.style.display === 'block';

      // Toggle the display property of the content
      content.style.display = isVisible ? 'none' : 'block';

      // Update the button text
      button.firstChild.textContent = isVisible ? 'More ' : 'Less ';

      // Rotate the caret
      if (caret) {
        caret.classList.toggle('rotate', !isVisible);
      }
    }
  });
});

  // Show and hide disclaimer popup
  document.getElementById("disclaimerButton").addEventListener("click", () => {
    document.getElementById("disclaimerModal").style.display = "block";
  });
  
  document.getElementById("closeDisclaimer").addEventListener("click", () => {
    document.getElementById("disclaimerModal").style.display = "none";
  });
  


// Create the LayerList widget
const layerListDiv = document.createElement("div"); // Create a dynamic container
layerListDiv.style.display = "none"; // Initially hide the LayerList

const layerList = new LayerList({
  view: view,
  container: layerListDiv,
  listItemCreatedFunction: function (event) {
    const item = event.item;

    // Enable the display of legend within the LayerList
    item.panel = {
      content: "legend", // This displays the legend for the layer
      open: false // Set to false so the legend is initially collapsed
    };

    // Optional: Add a custom title or other settings for the layer items
    if (item.layer.title === "Travel Risk Map based on Anti or Pro-Trans Legislation") {
      item.title = "Travel Risk Map";
    }
  }
});




// Add the LayerList widget to the UI
view.ui.add(layerListDiv, {
  position: "top-right" // Place the container in the top-right corner
});

// =======================
// Helper Function to Create Toggle Buttons
// =======================
function createToggleButton(buttonText, targetDiv) {
  const button = document.createElement("button");
  button.innerHTML = buttonText;
  button.style.padding = "10px";
  button.style.backgroundColor = "#6c4aad";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.borderRadius = "4px";
  button.style.margin = "5px";

  // Toggle visibility of the target div
  button.addEventListener("click", function () {
    if (targetDiv.style.display === "none") {
      targetDiv.style.display = "block"; // Show the widget
      button.textContent = "Hide Layer List"; // Update button text
    } else {
      targetDiv.style.display = "none"; // Hide the widget
      button.textContent = "Show Layer List and Legend"; // Update button text
    }
  });

  return button;
}

// Create the toggle button for the LayerList
const layerListToggleButton = createToggleButton("Show Layer List and Legend", layerListDiv);
view.ui.add(layerListToggleButton, "top-right"); // Add the toggle button to the UI




// Geolocation function
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      document.getElementById("Latitude").value = position.coords.latitude;
      document.getElementById("Longitude").value = position.coords.longitude;
    }, function (error) {
      alert("Error fetching location: " + error.message);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Map click event for getting coordinates
view.on("click", function (event) {
  const latitude = event.mapPoint.latitude.toFixed(6);
  const longitude = event.mapPoint.longitude.toFixed(6);
  document.getElementById("Latitude").value = latitude;
  document.getElementById("Longitude").value = longitude;
});


  // Define a helper function to create a FeatureLayer with dynamic field info
  function createDynamicFeatureLayer(url, title) {
    const featureLayer = new FeatureLayer({
      url: url,
      title: title,
      visible: false
    });

    featureLayer.on("layerview-create", function () {
      const fieldInfos = array.map(featureLayer.fields, function (field) {
        return {
          fieldName: field.name,
          label: field.alias,
          visible: true
        };
      });

      const popupTemplate = new PopupTemplate({
        title: title,
        content: [
          {
            type: "fields",
            fieldInfos: fieldInfos
          }
        ]
      });

      featureLayer.popupTemplate = popupTemplate;
    });

    return featureLayer;
  }



  
 
  const groupedLayers = [
    new GroupLayer({
      title: "Environmental Layers",
      layers: [
        new FeatureLayer({
          title: "USA Forest Service Lands - USA Federal Lands",
          url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Forest_Service_Lands/FeatureServer/0",
          visible: false,
          popupTemplate: {
            title: "{Name}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "Agency",
                    label: "Agency"
                  },
                  {
                    fieldName: "unit_name",
                    label: "Name"
                  }
                ]
              }
            ]
          }
        }),
        new FeatureLayer({
          title: "USA Detailed Parks - USA Parks",
          url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Detailed_Parks/FeatureServer/0",
          visible: false,
          popupTemplate: {
            title: "{Name}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "NAME",
                    label: "Name"
                  },
                  {
                    fieldName: "FEATTYPE",
                    label: "Feature Type"
                  },
                  {
                    fieldName: "MNFC",
                    label: "MNFC",
                    format: {
                      digitSeparator: true,
                      places: 2
                    }
                  },
                  {
                    fieldName: "SQMI",
                    label: "Area in square miles",
                    format: {
                      digitSeparator: true,
                      places: 2
                    }
                  }
                ]
              }
            ]
          }
        }),
  
        new FeatureLayer({
          title: "U.S. Army Corps of Engineers Reservoirs",
          url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/USACE_Reservoirs/FeatureServer/0",
          visible: false,
          popupTemplate: {
            title: "{Reservoir_Name}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "OMBIL_SITE",
                    label: "OMBIL_SITE"
                  },
                  {
                    fieldName: "NAME",
                    label: "Reservoir Name"
                  },
                  {
                    fieldName: "DISTRICT",
                    label: "District Name"
                  },
                  {
                    fieldName: "DIST_SYM",
                    label: "District Abbreviation"
                  },
                  {
                    fieldName: "DIVISION",
                    label: "Division Name"
                  },
                  {
                    fieldName: "DIV_SYM",
                    label: "Division Abbreviation"
                  },
                  {
                    fieldName: "DRY",
                    label: "Dry Land"
                  },
                  {
                    fieldName: "DAM_NAME",
                    label: "Dam Name"
                  },
                  {
                    fieldName: "NIDID",
                    label: "NIDID"
                  }
                ]
              }
            ]
          }
        }),
  
      new FeatureLayer({
        title: "River Flowlines",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/NHDPlusV21/FeatureServer/2",
        visible: false,
        popupTemplate: {
          title: "{Flowline_Name}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "USA Detailed Water Bodies",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Detailed_Water_Bodies/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "{NAME}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "NAME",
                  label: "NAME"
                },
                {
                  fieldName: "FTYPE",
                  label: "FTYPE"
                },
                {
                  fieldName: "FCODE",
                  label: "FCODE",
                  format: {
                    digitSeparator: true,
                    places: 2
                  }
                },
                {
                  fieldName: "FCODE_DESC",
                  label: "FCODE_DESC"
                },
                {
                  fieldName: "SQKM",
                  label: "SQKM",
                  format: {
                    digitSeparator: true,
                    places: 2
                  }
                },
                {
                  fieldName: "SQMI",
                  label: "SQMI",
                  format: {
                    digitSeparator: true,
                    places: 2
                  }
                }
              ]
            }
          ]
        }
      }),

      new FeatureLayer({
        title: "Current US Drought",
        url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_Drought_Intensity_v1/FeatureServer/3",
        visible: false,
        popupTemplate: {
          title: "{Drought_Level}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "US Drought Intensity",
        url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_Drought_Intensity_v1/FeatureServer/2",
        visible: false,
        popupTemplate: {
          title: "{Intensity_Level}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      })
    ]
  }),
  new GroupLayer({
    title: "Society and Economy Layers",
    layers: [
      new FeatureLayer({
        title: "USDA Census of Agriculture 2022",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USDA_Census_of_Agriculture_2022_All/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "Agriculture Data for {FieldName}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  "fieldName": "PRODS_RES_ON_OPR_NUM_OF_PRODS",
                  "label": "Producers - Residence - On Operation - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_WHT_AC_OPD_TOT",
                  "label": "Producers - White - Acres Operated",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_WHT_NUM_OF_OPS_TOT",
                  "label": "Producers - White - Number Of Operations",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_WHT_NUM_OF_PRODS_TOT",
                  "label": "Producers - White - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_OPR_6_10_NUM_PRO",
                  "label": "Producers - Years On Any Operation - 6 To 10 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_OPR_GE_11_NUM_PRO",
                  "label": "Producers - Years On Any Operation - Greater Than or Equal To 11 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_OPR_LT_11_AC_OPD",
                  "label": "Producers - Years On Any Operation - Less Than 11 Years - Acres Operated",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_OPR_LT_11_NUM_OPS",
                  "label": "Producers - Years On Any Operation - Less Than 11 Years - Number Of Operations",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_OPR_LT_11_NUM_PRO",
                  "label": "Producers - Years On Any Operation - Less Than 11 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_OPR_LT_6_NUM_PRO",
                  "label": "Producers - Years On Any Operation - Less Than 6 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_PST_OPR_3_4_N_PRO",
                  "label": "Producers - Years On Present Operation - 3 To 4 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_PST_OPR_5_9_N_PRO",
                  "label": "Producers - Years On Present Operation - 5 To 9 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_PST_OPR_GE10_N_PRO",
                  "label": "Producers - Years On Present Operation - Greater Than or Equal To 10 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "PRODS_YRS_ON_PST_OPR_LT3_N_PRO",
                  "label": "Producers - Years On Present Operation - Less Than 3 Years - Number Of Producers",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_ACRES_HVSD_TOT",
                  "label": "Rice - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_1000_PLS",
                  "label": "Rice - Operations With Area Harvested - Area Harvested: (1,000 Or More Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_1_24_9",
                  "label": "Rice - Operations With Area Harvested - Area Harvested: (1.0 To 24.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_100_249",
                  "label": "Rice - Operations With Area Harvested - Area Harvested: (100 To 249 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_25_99_9",
                  "label": "Rice - Operations With Area Harvested - Area Harvested: (25.0 To 99.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_250_499",
                  "label": "Rice - Operations With Area Harvested - Area Harvested: (250 To 499 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_500_999",
                  "label": "Rice - Operations With Area Harvested - Area Harvested: (500 To 999 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_AREA_HVSD_TOT",
                  "label": "Rice - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_OPS_W_SALES_TOT",
                  "label": "Rice - Operations With Sales",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_PROD_CWT_TOT",
                  "label": "Rice - Production, Measured In Hundredweight",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_SALES_DOL_TOT",
                  "label": "Rice - Sales, Measured In US Dollars ($)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_IRRD_ACRES_HVSD_TOT",
                  "label": "Rice, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "RICE_IRRD_OPS_W_AREA_HVSD_TOT",
                  "label": "Rice, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_OPS_W_SALES_TOT",
                  "label": "Sorghum - Operations With Sales",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SALES_DOL_TOT",
                  "label": "Sorghum - Sales, Measured In US Dollars ($)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_ACRES_HVSD_TOT",
                  "label": "Sorghum, Grain - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_A_HVSD_1000_PLS",
                  "label": "Sorghum, Grain - Operations With Area Harvested - Area Harvested: (1,000 Or More Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_A_HVSD_1_24_9",
                  "label": "Sorghum, Grain - Operations With Area Harvested - Area Harvested: (1.0 To 24.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_A_HVSD_100_249",
                  "label": "Sorghum, Grain - Operations With Area Harvested - Area Harvested: (100 To 249 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_A_HVSD_25_99_9",
                  "label": "Sorghum, Grain - Operations With Area Harvested - Area Harvested: (25.0 To 99.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_A_HVSD_250_499",
                  "label": "Sorghum, Grain - Operations With Area Harvested - Area Harvested: (250 To 499 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_A_HVSD_500_999",
                  "label": "Sorghum, Grain - Operations With Area Harvested - Area Harvested: (500 To 999 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_OPS_W_A_HVSD_TOT",
                  "label": "Sorghum, Grain - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_PROD_BU_TOT",
                  "label": "Sorghum, Grain - Production, Measured In Bushels",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_IRRD_ACRES_HVSD_TOT",
                  "label": "Sorghum, Grain, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_GRN_IRRD_OPS_A_HVSD_TOT",
                  "label": "Sorghum, Grain, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_IRR_SYP_ACRES_HVSD_TOT",
                  "label": "Sorghum, Irrigated, Syrup - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_IRR_SYP_OPS_A_HVSD_TOT",
                  "label": "Sorghum, Irrigated, Syrup - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SILAGE_ACRES_HVSD_TOT",
                  "label": "Sorghum, Silage - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SILAGE_OPS_W_A_HVSD_TOT",
                  "label": "Sorghum, Silage - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SILAGE_PROD_TONS_TOT",
                  "label": "Sorghum, Silage - Production, Measured In Tons",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SILAGE_IRR_ACR_HVSD_TOT",
                  "label": "Sorghum, Silage, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SILAGE_IRR_OPS_HVSD_TOT",
                  "label": "Sorghum, Silage, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SYRUP_ACRES_HVSD_TOT",
                  "label": "Sorghum, Syrup - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SYRUP_OPS_W_A_HVSD_TOT",
                  "label": "Sorghum, Syrup - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SORGHUM_SYRUP_PROD_GAL_TOT",
                  "label": "Sorghum, Syrup - Production, Measured In Gallons",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_ACRES_HVSD_TOT",
                  "label": "Soybeans - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_1000_PLS",
                  "label": "Soybeans - Operations With Area Harvested - Area Harvested: (1,000 Or More Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_1_24_9",
                  "label": "Soybeans - Operations With Area Harvested - Area Harvested: (1.0 To 24.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_100_249",
                  "label": "Soybeans - Operations With Area Harvested - Area Harvested: (100 To 249 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_25_99",
                  "label": "Soybeans - Operations With Area Harvested - Area Harvested: (25.0 To 99.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_250_499",
                  "label": "Soybeans - Operations With Area Harvested - Area Harvested: (250 To 499 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_500_999",
                  "label": "Soybeans - Operations With Area Harvested - Area Harvested: (500 To 999 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_W_A_HVSD_TOT",
                  "label": "Soybeans - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_OPS_WITH_SALES_TOT",
                  "label": "Soybeans - Operations With Sales",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_PROD_BU_TOT",
                  "label": "Soybeans - Production, Measured In Bushels",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_SALES_DOL_TOT",
                  "label": "Soybeans - Sales, Measured In US Dollars",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_IRRD_ACRES_HVSD_TOT",
                  "label": "Soybeans, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "SOYBEANS_IRRD_OPS_W_A_HVSD_TOT",
                  "label": "Soybeans, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_INV",
                  "label": "Tractors - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_OPS_WITH_INV",
                  "label": "Tractors - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_40_99HP_INV",
                  "label": "Tractors, 40-99 PTO-HP - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_40_99HP_OPS_W_INV",
                  "label": "Tractors, 40-99 PTO-HP - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_40_99HP_GE5Y_INV",
                  "label": "Tractors, 40-99 PTO-HP, >= 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_40_99HP_GE5Y_OPS_W_INV",
                  "label": "Tractors, 40-99 PTO-HP, >= 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_40_99HP_LT5Y_INV",
                  "label": "Tractors, 40-99 PTO-HP, < 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_40_99HP_LT5Y_OPS_W_INV",
                  "label": "Tractors, 40-99 PTO-HP, < 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE100HP_INV",
                  "label": "Tractors, >= 100 PTO-HP - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE100HP_OPS_W_INV",
                  "label": "Tractors, >= 100 PTO-HP - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE100HP_GE5Y_INV",
                  "label": "Tractors, >= 100 PTO-HP, >= 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE100HP_GE5Y_OPS_W_INV",
                  "label": "Tractors, >= 100 PTO-HP, >= 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE100HP_LT5Y_INV",
                  "label": "Tractors, >= 100 PTO-HP, < 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE100HP_LT5Y_OPS_W_INV",
                  "label": "Tractors, >= 100 PTO-HP, < 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE5Y_INV_TOT",
                  "label": "Tractors, >= 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_GE5Y_OPS_W_INV",
                  "label": "Tractors, >= 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT40HP_INV",
                  "label": "Tractors, < 40 PTO-HP - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT40HP_OPS_W_INV",
                  "label": "Tractors, < 40 PTO-HP - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT40HP_GE5Y_INV",
                  "label": "TRACTORS_LT40HP_GE5Y_INV",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT40HP_GE5Y_OPS_W_INV",
                  "label": "TRACTORS_LT40HP_GE5Y_OPS_W_INV",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT40HP_LT5Y_INV",
                  "label": "Tractors, < 40 PTO-HP, < 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT40HP_LT5Y_OPS_W_INV",
                  "label": "Tractors, < 40 PTO-HP, < 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT5Y_INV",
                  "label": "Tractors, < 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRACTORS_LT5Y_OPS_W_INV",
                  "label": "Tractors, < 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRUCKS_INCL_P_UPS_INV_TOT",
                  "label": "Trucks, Incl Pickups - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRUCKS_INCL_P_UPS_OPS_W_INV",
                  "label": "Trucks, Incl Pickups - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRUCKS_INCL_P_UPS_GE5Y_INV",
                  "label": "Trucks, Incl Pickups, >= 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRUCKS_INCL_P_UPS_GE5Y_OPS_INV",
                  "label": "Trucks, Incl Pickups, >= 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRUCKS_INCL_P_UPS_LT5Y_INV",
                  "label": "Trucks, Incl Pickups, < 5 Years Old - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TRUCKS_INCL_P_UPS_LT5Y_OPS_INV",
                  "label": "Trucks, Incl Pickups, < 5 Years Old - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TURKEYS_INV_TOT",
                  "label": "Turkeys - Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TURKEYS_OPS_WITH_INV_TOT",
                  "label": "Turkeys - Operations With Inventory",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TURKEYS_OPS_WITH_SALES_TOT",
                  "label": "Turkeys - Operations With Sales",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TURKEYS_SALES_IN_H_TOT",
                  "label": "Turkeys - Sales, Measured In Head",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TURKEYS_PRODCON_OPS_W_PROD",
                  "label": "Turkeys, Production Contract - Operations With Production",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "TURKEYS_PRODCON_PROD_IN_H",
                  "label": "Turkeys, Production Contract - Production, Measured In Head",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_ACRES_HVSD_TOT",
                  "label": "Wheat - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_1000_PLS",
                  "label": "Wheat - Operations With Area Harvested - Area Harvested: (1,000 Or More Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_1_24_9",
                  "label": "Wheat - Operations With Area Harvested - Area Harvested: (1.0 To 24.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_100_249",
                  "label": "Wheat - Operations With Area Harvested - Area Harvested: (100 To 249 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_25_99_9",
                  "label": "Wheat - Operations With Area Harvested - Area Harvested: (25.0 To 99.9 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_250_499",
                  "label": "Wheat - Operations With Area Harvested - Area Harvested: (250 To 499 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_500_999",
                  "label": "Wheat - Operations With Area Harvested - Area Harvested: (500 To 999 Acres)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_A_HVSD_TOT",
                  "label": "Wheat - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_OPS_W_SALES_TOT",
                  "label": "Wheat - Operations With Sales",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_PROD_BU_TOT",
                  "label": "Wheat - Production, Measured In Bushels (BU)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SALES_DOL_TOT",
                  "label": "Wheat - Sales, Measured In US Dollars ($)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_IRRD_ACRES_HVSD_TOT",
                  "label": "Wheat, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_IRRD_OPS_W_A_HVSD_TOT",
                  "label": "Wheat, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_EX_DUR_ACRES_HVSD_TOT",
                  "label": "Wheat, Spring, (Excl Durum) - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_EX_DUR_OPS_W_A_HVSD",
                  "label": "Wheat, Spring, (Excl Durum) - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_EX_DUR_PROD_BU_TOT",
                  "label": "Wheat, Spring, (Excl Durum) - Production, Measured In Bu",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_EX_DUR_IR_AC_HVSD_TOT",
                  "label": "Wheat, Spring, (Excl Durum), Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_EX_DUR_IR_OPS_A_HVSD",
                  "label": "Wheat, Spring, (Excl Durum), Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_DUR_AC_HVSD_TOT",
                  "label": "Wheat, Spring, Durum - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_DUR_OPS_W_A_HVSD_TOT",
                  "label": "Wheat, Spring, Durum - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_DUR_PROD_BU_TOT",
                  "label": "Wheat, Spring, Durum - Production, Measured In Bu",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_DUR_IRRD_AC_HVSD_TOT",
                  "label": "Wheat, Spring, Durum, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_SPR_DUR_IRRD_OPS_W_A_HVSD",
                  "label": "Wheat, Spring, Durum, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_WINTER_ACRES_HVSD_TOT",
                  "label": "Wheat, Winter - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_WINTER_OPS_W_A_HVSD_TOT",
                  "label": "Wheat, Winter - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_WINTER_PROD_BU_TOT",
                  "label": "Wheat, Winter - Production, Measured In Bushels (BU)",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_WINTER_IRR_ACRES_HVSD_TOT",
                  "label": "Wheat, Winter, Irrigated - Acres Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                },
                {
                  "fieldName": "WHEAT_WINT_IRR_OPS_W_A_HVSD_TOT",
                  "label": "Wheat, Winter, Irrigated - Operations With Area Harvested",
                  "format": {
                    "digitSeparator": true,
                    "places": 2
                  }
                }   
              ]
            }
          ]
        }
      }),
      new FeatureLayer({
        title: "U.S. Congressional Districts",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_119th_Congressional_Districts/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "Congressional District Details",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "STATE_ABBR", label: "State Abbreviation" },
                { fieldName: "NAME", label: "Representative Name" },
                { fieldName: "LAST_NAME", label: "Last Name" },
                { fieldName: "PARTY", label: "Political Party" },
                { fieldName: "SQMI", label: "Area (sq. miles)", format: { digitSeparator: true, places: 2 } },
                { fieldName: "STATE_NAME", label: "State Name" }
              ]
            }
          ]
        }
      }),
      
      new FeatureLayer({
        title: "U.S. Population Projections for 2020 through 2100 (SEDAC)",
        url: "https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/US_County_Level_Population_Projections_for_2020_%e2%80%93_2100/FeatureServer/layers",
        visible: false,
        popupTemplate: {
          title: "County Level Population Data:",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "ssp12020", label: "Total county projected population under SSP1 in 2020" },
                { fieldName: "ssp22020", label: "Total county projected population under SSP2 in 2020" },
                { fieldName: "ssp32020", label: "Total county projected population under SSP3 in 2020" },
                { fieldName: "ssp42020", label: "Total county projected population under SSP4 in 2020" },
                { fieldName: "ssp52020", label: "Total county projected population under SSP5 in 2020" },
                { fieldName: "ssp12025", label: "Total county projected population under SSP1 in 2025" },
                { fieldName: "ssp22025", label: "Total county projected population under SSP2 in 2025" },
                { fieldName: "ssp32025", label: "Total county projected population under SSP3 in 2025" },
                { fieldName: "ssp42025", label: "Total county projected population under SSP4 in 2025" },
                { fieldName: "ssp52025", label: "Total county projected population under SSP5 in 2025" },
                { fieldName: "ssp12030", label: "Total county projected population under SSP1 in 2030" },
                { fieldName: "ssp22030", label: "Total county projected population under SSP2 in 2030" },
                { fieldName: "ssp32030", label: "Total county projected population under SSP3 in 2030" },
                { fieldName: "ssp42030", label: "Total county projected population under SSP4 in 2030" },
                { fieldName: "ssp52030", label: "Total county projected population under SSP5 in 2030" },
                { fieldName: "ssp12035", label: "Total county projected population under SSP1 in 2035" },
                { fieldName: "ssp22035", label: "Total county projected population under SSP2 in 2035" },
                { fieldName: "ssp32035", label: "Total county projected population under SSP3 in 2035" },
                { fieldName: "ssp42035", label: "Total county projected population under SSP4 in 2035" },
                { fieldName: "ssp52035", label: "Total county projected population under SSP5 in 2035" },
                { fieldName: "ssp12040", label: "Total county projected population under SSP1 in 2040" },
                { fieldName: "ssp22040", label: "Total county projected population under SSP2 in 2040" },
                { fieldName: "ssp32040", label: "Total county projected population under SSP3 in 2040" },
                { fieldName: "ssp42040", label: "Total county projected population under SSP4 in 2040" },
                { fieldName: "ssp52040", label: "Total county projected population under SSP5 in 2040" },
                { fieldName: "ssp12045", label: "Total county projected population under SSP1 in 2045" },
                { fieldName: "ssp22045", label: "Total county projected population under SSP2 in 2045" },
                { fieldName: "ssp32045", label: "Total county projected population under SSP3 in 2045" },
                { fieldName: "ssp42045", label: "Total county projected population under SSP4 in 2045" },
                { fieldName: "ssp52045", label: "Total county projected population under SSP5 in 2045" },
                { fieldName: "ssp12050", label: "Total county projected population under SSP1 in 2050" },
                { fieldName: "ssp22050", label: "Total county projected population under SSP2 in 2050" },
                { fieldName: "ssp32050", label: "Total county projected population under SSP3 in 2050" },
                { fieldName: "ssp42050", label: "Total county projected population under SSP4 in 2050" },
                { fieldName: "ssp52050", label: "Total county projected population under SSP5 in 2050" },
                { fieldName: "ssp12055", label: "Total county projected population under SSP1 in 2055" },
                { fieldName: "ssp22055", label: "Total county projected population under SSP2 in 2055" },
                { fieldName: "ssp32055", label: "Total county projected population under SSP3 in 2055" },
                { fieldName: "ssp42055", label: "Total county projected population under SSP4 in 2055" },
                { fieldName: "ssp52055", label: "Total county projected population under SSP5 in 2055" },
                { fieldName: "ssp12060", label: "Total county projected population under SSP1 in 2060" },
                { fieldName: "ssp22060", label: "Total county projected population under SSP2 in 2060" },
                { fieldName: "ssp32060", label: "Total county projected population under SSP3 in 2060" },
                { fieldName: "ssp42060", label: "Total county projected population under SSP4 in 2060" },
                { fieldName: "ssp52060", label: "Total county projected population under SSP5 in 2060" },
                { fieldName: "ssp12065", label: "Total county projected population under SSP1 in 2065" },
                { fieldName: "ssp22065", label: "Total county projected population under SSP2 in 2065" },
                { fieldName: "ssp32065", label: "Total county projected population under SSP3 in 2065" },
                { fieldName: "ssp42065", label: "Total county projected population under SSP4 in 2065" },
                { fieldName: "ssp52065", label: "Total county projected population under SSP5 in 2065" },
                { fieldName: "ssp12070", label: "Total county projected population under SSP1 in 2070" },
                { fieldName: "ssp22070", label: "Total county projected population under SSP2 in 2070" },
                { fieldName: "ssp32070", label: "Total county projected population under SSP3 in 2070" },
                { fieldName: "ssp42070", label: "Total county projected population under SSP4 in 2070" },
                { fieldName: "ssp52070", label: "Total county projected population under SSP5 in 2070" },
                { fieldName: "ssp12075", label: "Total county projected population under SSP1 in 2075" },
                { fieldName: "ssp22075", label: "Total county projected population under SSP2 in 2075" },
                { fieldName: "ssp32075", label: "Total county projected population under SSP3 in 2075" },
                { fieldName: "ssp42075", label: "Total county projected population under SSP4 in 2075" },
                { fieldName: "ssp52075", label: "Total county projected population under SSP5 in 2075" },
                { fieldName: "ssp12080", label: "Total county projected population under SSP1 in 2080" },
                { fieldName: "ssp22080", label: "Total county projected population under SSP2 in 2080" },
                { fieldName: "ssp32080", label: "Total county projected population under SSP3 in 2080" },
                { fieldName: "ssp42080", label: "Total county projected population under SSP4 in 2080" },
                { fieldName: "ssp52080", label: "Total county projected population under SSP5 in 2080" },
                { fieldName: "ssp12085", label: "Total county projected population under SSP1 in 2085" },
                { fieldName: "ssp22085", label: "Total county projected population under SSP2 in 2085" },
                { fieldName: "ssp32085", label: "Total county projected population under SSP3 in 2085" },
                { fieldName: "ssp42085", label: "Total county projected population under SSP4 in 2085" },
                { fieldName: "ssp52085", label: "Total county projected population under SSP5 in 2085" },
                { fieldName: "ssp12090", label: "Total county projected population under SSP1 in 2090" },
                { fieldName: "ssp22090", label: "Total county projected population under SSP2 in 2090" },
                { fieldName: "ssp32090", label: "Total county projected population under SSP3 in 2090" },
                { fieldName: "ssp42090", label: "Total county projected population under SSP4 in 2090" },
                { fieldName: "ssp52090", label: "Total county projected population under SSP5 in 2090" },
                { fieldName: "ssp12095", label: "Total county projected population under SSP1 in 2095" },
                { fieldName: "ssp22095", label: "Total county projected population under SSP2 in 2095" },
                { fieldName: "ssp32095", label: "Total county projected population under SSP3 in 2095" },
                { fieldName: "ssp42095", label: "Total county projected population under SSP4 in 2095" },
                { fieldName: "ssp52095", label: "Total county projected population under SSP5 in 2095" },
                { fieldName: "ssp12100", label: "Total county projected population under SSP1 in 2100" },
                { fieldName: "ssp22100", label: "Total county projected population under SSP2 in 2100" },
                { fieldName: "ssp32100", label: "Total county projected population under SSP3 in 2100" },
                { fieldName: "ssp42100", label: "Total county projected population under SSP4 in 2100" },
                { fieldName: "ssp52100", label: "Total county projected population under SSP5 in 2100" },
                { fieldName: "NAMELSAD10", label: "2010 Census Legal and Statistical Area Description" },
                { fieldName: "LSAD10", label: "2010 Census Legal and Statistical Area Description Code" },
                { fieldName: "CLASSFP10", label: "2010 Census Class Code" },
                { fieldName: "MTFCC10", label: "2010 Census MAF/TIGER Feature Class Code" },
                { fieldName: "CSAFP10", label: "2010 Census Combined Statistical Area Code" },
                { fieldName: "CBSAFP10", label: "2010 Census CBSA Code" },
                { fieldName: "METDIVFP10", label: "2010 Census Metropolitan Division Code" },
                { fieldName: "FUNCSTAT10", label: "2010 Census functional status" },
                { fieldName: "ALAND10", label: "2010 Census land area" },
                { fieldName: "AWATER10", label: "2010 Census water area" },
                { fieldName: "INTPTLAT10", label: "2010 Census latitude of internal point" },
                { fieldName: "INTPTLON10", label: "2010 Census longitude of internal point" },
                { fieldName: "geoid", label: "County identifier" },
                { fieldName: "ssp12020", label: "Male county projected population under SSP1 in 2020" },
                { fieldName: "ssp22020", label: "Male county projected population under SSP2 in 2020" },
                { fieldName: "ssp32020", label: "Male county projected population under SSP3 in 2020" },
                { fieldName: "ssp42020", label: "Male county projected population under SSP4 in 2020" },
                { fieldName: "ssp52020", label: "Male county projected population under SSP5 in 2020" },
                { fieldName: "ssp12025", label: "Male county projected population under SSP1 in 2025" },
                { fieldName: "ssp22025", label: "Male county projected population under SSP2 in 2025" },
                { fieldName: "ssp32025", label: "Male county projected population under SSP3 in 2025" },
                { fieldName: "ssp42025", label: "Male county projected population under SSP4 in 2025" },
                { fieldName: "ssp52025", label: "Male county projected population under SSP5 in 2025" },
                { fieldName: "ssp12030", label: "Male county projected population under SSP1 in 2030" },
                { fieldName: "ssp22030", label: "Male county projected population under SSP2 in 2030" },
                { fieldName: "ssp32030", label: "Male county projected population under SSP3 in 2030" },
                { fieldName: "ssp42030", label: "Male county projected population under SSP4 in 2030" },
                { fieldName: "ssp52030", label: "Male county projected population under SSP5 in 2030" },
                { fieldName: "ssp12035", label: "Male county projected population under SSP1 in 2035" },
                { fieldName: "ssp22035", label: "Male county projected population under SSP2 in 2035" },
                { fieldName: "ssp32035", label: "Male county projected population under SSP3 in 2035" },
                { fieldName: "ssp42035", label: "Male county projected population under SSP4 in 2035" },
                { fieldName: "ssp52035", label: "Male county projected population under SSP5 in 2035" },
                { fieldName: "ssp12040", label: "Male county projected population under SSP1 in 2040" },
                { fieldName: "ssp22040", label: "Male county projected population under SSP2 in 2040" },
                { fieldName: "ssp32040", label: "Male county projected population under SSP3 in 2040" },
                { fieldName: "ssp42040", label: "Male county projected population under SSP4 in 2040" },
                { fieldName: "ssp52040", label: "Male county projected population under SSP5 in 2040" },
                { fieldName: "ssp12045", label: "Male county projected population under SSP1 in 2045" },
                { fieldName: "ssp22045", label: "Male county projected population under SSP2 in 2045" },
                { fieldName: "ssp32045", label: "Male county projected population under SSP3 in 2045" },
                { fieldName: "ssp42045", label: "Male county projected population under SSP4 in 2045" },
                { fieldName: "ssp52045", label: "Male county projected population under SSP5 in 2045" },
                { fieldName: "ssp12050", label: "Male county projected population under SSP1 in 2050" },
                { fieldName: "ssp22050", label: "Male county projected population under SSP2 in 2050" },
                { fieldName: "ssp32050", label: "Male county projected population under SSP3 in 2050" },
                { fieldName: "ssp42050", label: "Male county projected population under SSP4 in 2050" },
                { fieldName: "ssp52050", label: "Male county projected population under SSP5 in 2050" },
                { fieldName: "ssp12055", label: "Male county projected population under SSP1 in 2055" },
                { fieldName: "ssp22055", label: "Male county projected population under SSP2 in 2055" },
                { fieldName: "ssp32055", label: "Male county projected population under SSP3 in 2055" },
                { fieldName: "ssp42055", label: "Male county projected population under SSP4 in 2055" },
                { fieldName: "ssp52055", label: "Male county projected population under SSP5 in 2055" },
                { fieldName: "ssp12060", label: "Male county projected population under SSP1 in 2060" },
                { fieldName: "ssp22060", label: "Male county projected population under SSP2 in 2060" },
                { fieldName: "ssp32060", label: "Male county projected population under SSP3 in 2060" },
                { fieldName: "ssp42060", label: "Male county projected population under SSP4 in 2060" },
                { fieldName: "ssp52060", label: "Male county projected population under SSP5 in 2060" },
                { fieldName: "ssp12065", label: "Male county projected population under SSP1 in 2065" },
                { fieldName: "ssp22065", label: "Male county projected population under SSP2 in 2065" },
                { fieldName: "ssp32065", label: "Male county projected population under SSP3 in 2065" },
                { fieldName: "ssp42065", label: "Male county projected population under SSP4 in 2065" },
                { fieldName: "ssp52065", label: "Male county projected population under SSP5 in 2065" },
                { fieldName: "ssp12070", label: "Male county projected population under SSP1 in 2070" },
                { fieldName: "ssp22070", label: "Male county projected population under SSP2 in 2070" },
                { fieldName: "ssp32070", label: "Male county projected population under SSP3 in 2070" },
                { fieldName: "ssp42070", label: "Male county projected population under SSP4 in 2070" },
                { fieldName: "ssp52070", label: "Male county projected population under SSP5 in 2070" },
                { fieldName: "ssp12075", label: "Male county projected population under SSP1 in 2075" },
                { fieldName: "ssp22075", label: "Male county projected population under SSP2 in 2075" },
                { fieldName: "ssp32075", label: "Male county projected population under SSP3 in 2075" },
                { fieldName: "ssp42075", label: "Male county projected population under SSP4 in 2075" },
                { fieldName: "ssp52075", label: "Male county projected population under SSP5 in 2075" },
                { fieldName: "ssp12080", label: "Male county projected population under SSP1 in 2080" },
                { fieldName: "ssp22080", label: "Male county projected population under SSP2 in 2080" },
                { fieldName: "ssp32080", label: "Male county projected population under SSP3 in 2080" },
                { fieldName: "ssp42080", label: "Male county projected population under SSP4 in 2080" },
                { fieldName: "ssp52080", label: "Male county projected population under SSP5 in 2080" },
                { fieldName: "ssp12085", label: "Male county projected population under SSP1 in 2085" },
                { fieldName: "ssp22085", label: "Male county projected population under SSP2 in 2085" },
                { fieldName: "ssp32085", label: "Male county projected population under SSP3 in 2085" },
                { fieldName: "ssp42085", label: "Male county projected population under SSP4 in 2085" },
                { fieldName: "ssp52085", label: "Male county projected population under SSP5 in 2085" },
                { fieldName: "ssp12090", label: "Male county projected population under SSP1 in 2090" },
                { fieldName: "ssp22090", label: "Male county projected population under SSP2 in 2090" },
                { fieldName: "ssp32090", label: "Male county projected population under SSP3 in 2090" },
                { fieldName: "ssp42090", label: "Male county projected population under SSP4 in 2090" },
                { fieldName: "ssp52090", label: "Male county projected population under SSP5 in 2090" },
                { fieldName: "ssp12095", label: "Male county projected population under SSP1 in 2095" },
                { fieldName: "ssp22095", label: "Male county projected population under SSP2 in 2095" },
                { fieldName: "ssp32095", label: "Male county projected population under SSP3 in 2095" },
                { fieldName: "ssp42095", label: "Male county projected population under SSP4 in 2095" },
                { fieldName: "ssp52095", label: "Male county projected population under SSP5 in 2095" },
                { fieldName: "ssp12100", label: "Male county projected population under SSP1 in 2100" },
                { fieldName: "ssp22100", label: "Male county projected population under SSP2 in 2100" },
                { fieldName: "ssp32100", label: "Male county projected population under SSP3 in 2100" },
                { fieldName: "ssp42100", label: "Male county projected population under SSP4 in 2100" },
                { fieldName: "ssp52100", label: "Male county projected population under SSP5 in 2100" },
                { fieldName: "ssp12020", label: "Female county projected population under SSP1 in 2020" },
                { fieldName: "ssp22020", label: "Female county projected population under SSP2 in 2020" },
                { fieldName: "ssp32020", label: "Female county projected population under SSP3 in 2020" },
                { fieldName: "ssp42020", label: "Female county projected population under SSP4 in 2020" },
                { fieldName: "ssp52020", label: "Female county projected population under SSP5 in 2020" },
                { fieldName: "ssp12025", label: "Female county projected population under SSP1 in 2025" },
                { fieldName: "ssp22025", label: "Female county projected population under SSP2 in 2025" },
                { fieldName: "ssp32025", label: "Female county projected population under SSP3 in 2025" },
                { fieldName: "ssp42025", label: "Female county projected population under SSP4 in 2025" },
                { fieldName: "ssp52025", label: "Female county projected population under SSP5 in 2025" },
                { fieldName: "ssp12030", label: "Female county projected population under SSP1 in 2030" },
                { fieldName: "ssp22030", label: "Female county projected population under SSP2 in 2030" },
                { fieldName: "ssp32030", label: "Female county projected population under SSP3 in 2030" },
                { fieldName: "ssp42030", label: "Female county projected population under SSP4 in 2030" },
                { fieldName: "ssp52030", label: "Female county projected population under SSP5 in 2030" },
                { fieldName: "ssp12035", label: "Female county projected population under SSP1 in 2035" },
                { fieldName: "ssp22035", label: "Female county projected population under SSP2 in 2035" },
                { fieldName: "ssp32035", label: "Female county projected population under SSP3 in 2035" },
                { fieldName: "ssp42035", label: "Female county projected population under SSP4 in 2035" },
                { fieldName: "ssp52035", label: "Female county projected population under SSP5 in 2035" },
                { fieldName: "ssp12040", label: "Female county projected population under SSP1 in 2040" },
                { fieldName: "ssp22040", label: "Female county projected population under SSP2 in 2040" },
                { fieldName: "ssp32040", label: "Female county projected population under SSP3 in 2040" },
                { fieldName: "ssp42040", label: "Female county projected population under SSP4 in 2040" },
                { fieldName: "ssp52040", label: "Female county projected population under SSP5 in 2040" },
                { fieldName: "ssp12045", label: "Female county projected population under SSP1 in 2045" },
                { fieldName: "ssp22045", label: "Female county projected population under SSP2 in 2045" },
                { fieldName: "ssp32045", label: "Female county projected population under SSP3 in 2045" },
                { fieldName: "ssp42045", label: "Female county projected population under SSP4 in 2045" },
                { fieldName: "ssp52045", label: "Female county projected population under SSP5 in 2045" },
                { fieldName: "ssp12050", label: "Female county projected population under SSP1 in 2050" },
                { fieldName: "ssp22050", label: "Female county projected population under SSP2 in 2050" },
                { fieldName: "ssp32050", label: "Female county projected population under SSP3 in 2050" },
                { fieldName: "ssp42050", label: "Female county projected population under SSP4 in 2050" },
                { fieldName: "ssp52050", label: "Female county projected population under SSP5 in 2050" },
                { fieldName: "ssp12055", label: "Female county projected population under SSP1 in 2055" },
                { fieldName: "ssp22055", label: "Female county projected population under SSP2 in 2055" },
                { fieldName: "ssp32055", label: "Female county projected population under SSP3 in 2055" },
                { fieldName: "ssp42055", label: "Female county projected population under SSP4 in 2055" },
                { fieldName: "ssp52055", label: "Female county projected population under SSP5 in 2055" },
                { fieldName: "ssp12060", label: "Female county projected population under SSP1 in 2060" },
                { fieldName: "ssp22060", label: "Female county projected population under SSP2 in 2060" },
                { fieldName: "ssp32060", label: "Female county projected population under SSP3 in 2060" },
                { fieldName: "ssp42060", label: "Female county projected population under SSP4 in 2060" },
                { fieldName: "ssp52060", label: "Female county projected population under SSP5 in 2060" },
                { fieldName: "ssp12065", label: "Female county projected population under SSP1 in 2065" },
                { fieldName: "ssp22065", label: "Female county projected population under SSP2 in 2065" },
                { fieldName: "ssp32065", label: "Female county projected population under SSP3 in 2065" },
                { fieldName: "ssp42065", label: "Female county projected population under SSP4 in 2065" },
                { fieldName: "ssp52065", label: "Female county projected population under SSP5 in 2065" },
                { fieldName: "ssp12070", label: "Female county projected population under SSP1 in 2070" },
                { fieldName: "ssp22070", label: "Female county projected population under SSP2 in 2070" },
                { fieldName: "ssp32070", label: "Female county projected population under SSP3 in 2070" },
                { fieldName: "ssp42070", label: "Female county projected population under SSP4 in 2070" },
                { fieldName: "ssp52070", label: "Female county projected population under SSP5 in 2070" },
                { fieldName: "ssp12075", label: "Female county projected population under SSP1 in 2075" },
                { fieldName: "ssp22075", label: "Female county projected population under SSP2 in 2075" },
                { fieldName: "ssp32075", label: "Female county projected population under SSP3 in 2075" },
                { fieldName: "ssp42075", label: "Female county projected population under SSP4 in 2075" },
                { fieldName: "ssp52075", label: "Female county projected population under SSP5 in 2075" },
                { fieldName: "ssp12080", label: "Female county projected population under SSP1 in 2080" },
                { fieldName: "ssp22080", label: "Female county projected population under SSP2 in 2080" },
                { fieldName: "ssp32080", label: "Female county projected population under SSP3 in 2080" },
                { fieldName: "ssp42080", label: "Female county projected population under SSP4 in 2080" },
                { fieldName: "ssp52080", label: "Female county projected population under SSP5 in 2080" },
                { fieldName: "ssp12085", label: "Female county projected population under SSP1 in 2085" },
                { fieldName: "ssp22085", label: "Female county projected population under SSP2 in 2085" },
                { fieldName: "ssp32085", label: "Female county projected population under SSP3 in 2085" },
                { fieldName: "ssp42085", label: "Female county projected population under SSP4 in 2085" },
                { fieldName: "ssp52085", label: "Female county projected population under SSP5 in 2085" },
                { fieldName: "ssp12090", label: "Female county projected population under SSP1 in 2090" },
                { fieldName: "ssp22090", label: "Female county projected population under SSP2 in 2090" },
                { fieldName: "ssp32090", label: "Female county projected population under SSP3 in 2090" },
                { fieldName: "ssp42090", label: "Female county projected population under SSP4 in 2090" },
                { fieldName: "ssp52090", label: "Female county projected population under SSP5 in 2090" },
                { fieldName: "ssp12095", label: "Female county projected population under SSP1 in 2095" },
                { fieldName: "ssp22095", label: "Female county projected population under SSP2 in 2095" },
                { fieldName: "ssp32095", label: "Female county projected population under SSP3 in 2095" },
                { fieldName: "ssp42095", label: "Female county projected population under SSP4 in 2095" },
                { fieldName: "ssp52095", label: "Female county projected population under SSP5 in 2095" },
                { fieldName: "ssp12100", label: "Female county projected population under SSP1 in 2100" },
                { fieldName: "ssp22100", label: "Female county projected population under SSP2 in 2100" },
                { fieldName: "ssp32100", label: "Female county projected population under SSP3 in 2100" },
                { fieldName: "ssp42100", label: "Female county projected population under SSP4 in 2100" },
                { fieldName: "ssp52100", label: "Female county projected population under SSP5 in 2100" },
                { fieldName: "ssp12020", label: "White non-Hispanic population SSP1 (2020)" },
                { fieldName: "ssp22020", label: "White non-Hispanic population SSP2 (2020)" },
                { fieldName: "ssp32020", label: "White non-Hispanic population SSP3 (2020)" },
                { fieldName: "ssp42020", label: "White non-Hispanic population SSP4 (2020)" },
                { fieldName: "ssp52020", label: "White non-Hispanic population SSP5 (2020)" },
                { fieldName: "ssp12025", label: "White non-Hispanic population SSP1 (2025)" },
                { fieldName: "ssp22025", label: "White non-Hispanic population SSP2 (2025)" },
                { fieldName: "ssp32025", label: "White non-Hispanic population SSP3 (2025)" },
                { fieldName: "ssp42025", label: "White non-Hispanic population SSP4 (2025)" },
                { fieldName: "ssp52025", label: "White non-Hispanic population SSP5 (2025)" },
                { fieldName: "ssp12030", label: "White non-Hispanic population SSP1 (2030)" },
                { fieldName: "ssp22030", label: "White non-Hispanic population SSP2 (2030)" },
                { fieldName: "ssp32030", label: "White non-Hispanic population SSP3 (2030)" },
                { fieldName: "ssp42030", label: "White non-Hispanic population SSP4 (2030)" },
                { fieldName: "ssp52030", label: "White non-Hispanic population SSP5 (2030)" },
                { fieldName: "ssp12035", label: "White non-Hispanic population SSP1 (2035)" },
                { fieldName: "ssp22035", label: "White non-Hispanic population SSP2 (2035)" },
                { fieldName: "ssp32035", label: "White non-Hispanic population SSP3 (2035)" },
                { fieldName: "ssp42035", label: "White non-Hispanic population SSP4 (2035)" },
                { fieldName: "ssp52035", label: "White non-Hispanic population SSP5 (2035)" },
                { fieldName: "ssp12040", label: "White non-Hispanic population SSP1 (2040)" },
                { fieldName: "ssp22040", label: "White non-Hispanic population SSP2 (2040)" },
                { fieldName: "ssp32040", label: "White non-Hispanic population SSP3 (2040)" },
                { fieldName: "ssp42040", label: "White non-Hispanic population SSP4 (2040)" },
                { fieldName: "ssp52040", label: "White non-Hispanic population SSP5 (2040)" },
                { fieldName: "ssp12045", label: "White non-Hispanic population SSP1 (2045)" },
                { fieldName: "ssp22045", label: "White non-Hispanic population SSP2 (2045)" },
                { fieldName: "ssp32045", label: "White non-Hispanic population SSP3 (2045)" },
                { fieldName: "ssp42045", label: "White non-Hispanic population SSP4 (2045)" },
                { fieldName: "ssp52045", label: "White non-Hispanic population SSP5 (2045)" },
                { fieldName: "ssp12050", label: "White non-Hispanic population SSP1 (2050)" },
                { fieldName: "ssp22050", label: "White non-Hispanic population SSP2 (2050)" },
                { fieldName: "ssp32050", label: "White non-Hispanic population SSP3 (2050)" },
                { fieldName: "ssp42050", label: "White non-Hispanic population SSP4 (2050)" },
                { fieldName: "ssp52050", label: "White non-Hispanic population SSP5 (2050)" },
                { fieldName: "ssp12055", label: "White non-Hispanic population SSP1 (2055)" },
                { fieldName: "ssp22055", label: "White non-Hispanic population SSP2 (2055)" },
                { fieldName: "ssp32055", label: "White non-Hispanic population SSP3 (2055)" },
                { fieldName: "ssp42055", label: "White non-Hispanic population SSP4 (2055)" },
                { fieldName: "ssp52055", label: "White non-Hispanic population SSP5 (2055)" },
                { fieldName: "ssp12060", label: "White non-Hispanic population SSP1 (2060)" },
                { fieldName: "ssp22060", label: "White non-Hispanic population SSP2 (2060)" },
                { fieldName: "ssp32060", label: "White non-Hispanic population SSP3 (2060)" },
                { fieldName: "ssp42060", label: "White non-Hispanic population SSP4 (2060)" },
                { fieldName: "ssp52060", label: "White non-Hispanic population SSP5 (2060)" },
                { fieldName: "ssp12065", label: "White non-Hispanic population SSP1 (2065)" },
                { fieldName: "ssp22065", label: "White non-Hispanic population SSP2 (2065)" },
                { fieldName: "ssp32065", label: "White non-Hispanic population SSP3 (2065)" },
                { fieldName: "ssp42065", label: "White non-Hispanic population SSP4 (2065)" },
                { fieldName: "ssp52065", label: "White non-Hispanic population SSP5 (2065)" },
                { fieldName: "ssp12070", label: "White non-Hispanic population SSP1 (2070)" },
                { fieldName: "ssp22070", label: "White non-Hispanic population SSP2 (2070)" },
                { fieldName: "ssp32070", label: "White non-Hispanic population SSP3 (2070)" },
                { fieldName: "ssp42070", label: "White non-Hispanic population SSP4 (2070)" },
                { fieldName: "ssp52070", label: "White non-Hispanic population SSP5 (2070)" },
                { fieldName: "ssp12075", label: "White non-Hispanic population SSP1 (2075)" },
                { fieldName: "ssp22075", label: "White non-Hispanic population SSP2 (2075)" },
                { fieldName: "ssp32075", label: "White non-Hispanic population SSP3 (2075)" },
                { fieldName: "ssp42075", label: "White non-Hispanic population SSP4 (2075)" },
                { fieldName: "ssp52075", label: "White non-Hispanic population SSP5 (2075)" },
                { fieldName: "ssp12080", label: "White non-Hispanic population SSP1 (2080)" },
                { fieldName: "ssp22080", label: "White non-Hispanic population SSP2 (2080)" },
                { fieldName: "ssp32080", label: "White non-Hispanic population SSP3 (2080)" },
                { fieldName: "ssp42080", label: "White non-Hispanic population SSP4 (2080)" },
                { fieldName: "ssp52080", label: "White non-Hispanic population SSP5 (2080)" },
                { fieldName: "ssp12085", label: "White non-Hispanic population SSP1 (2085)" },
                { fieldName: "ssp22085", label: "White non-Hispanic population SSP2 (2085)" },
                { fieldName: "ssp32085", label: "White non-Hispanic population SSP3 (2085)" },
                { fieldName: "ssp42085", label: "White non-Hispanic population SSP4 (2085)" },
                { fieldName: "ssp52085", label: "White non-Hispanic population SSP5 (2085)" },
                { fieldName: "ssp12090", label: "White non-Hispanic population SSP1 (2090)" },
                { fieldName: "ssp22090", label: "White non-Hispanic population SSP2 (2090)" },
                { fieldName: "ssp32090", label: "White non-Hispanic population SSP3 (2090)" },
                { fieldName: "ssp42090", label: "White non-Hispanic population SSP4 (2090)" },
                { fieldName: "ssp52090", label: "White non-Hispanic population SSP5 (2090)" },
                { fieldName: "ssp12095", label: "White non-Hispanic population SSP1 (2095)" },
                { fieldName: "ssp22095", label: "White non-Hispanic population SSP2 (2095)" },
                { fieldName: "ssp32095", label: "White non-Hispanic population SSP3 (2095)" },
                { fieldName: "ssp42095", label: "White non-Hispanic population SSP4 (2095)" },
                { fieldName: "ssp52095", label: "White non-Hispanic population SSP5 (2095)" },
                { fieldName: "ssp12100", label: "White non-Hispanic population SSP1 (2100)" },
                { fieldName: "ssp22100", label: "White non-Hispanic population SSP2 (2100)" },
                { fieldName: "ssp32100", label: "White non-Hispanic population SSP3 (2100)" },
                { fieldName: "ssp42100", label: "White non-Hispanic population SSP4 (2100)" },
                { fieldName: "ssp52100", label: "White non-Hispanic population SSP5 (2100)" },
                { fieldName: "ssp12020", label: "Black non-Hispanic county projected population under SSP1 in 2020" },
                { fieldName: "ssp22020", label: "Black non-Hispanic county projected population under SSP2 in 2020" },
                { fieldName: "ssp32020", label: "Black non-Hispanic county projected population under SSP3 in 2020" },
                { fieldName: "ssp42020", label: "Black non-Hispanic county projected population under SSP4 in 2020" },
                { fieldName: "ssp52020", label: "Black non-Hispanic county projected population under SSP5 in 2020" },
                { fieldName: "ssp12025", label: "Black non-Hispanic county projected population under SSP1 in 2025" },
                { fieldName: "ssp22025", label: "Black non-Hispanic county projected population under SSP2 in 2025" },
                { fieldName: "ssp32025", label: "Black non-Hispanic county projected population under SSP3 in 2025" },
                { fieldName: "ssp42025", label: "Black non-Hispanic county projected population under SSP4 in 2025" },
                { fieldName: "ssp52025", label: "Black non-Hispanic county projected population under SSP5 in 2025" },
                { fieldName: "ssp12030", label: "Black non-Hispanic county projected population under SSP1 in 2030" },
                { fieldName: "ssp22030", label: "Black non-Hispanic county projected population under SSP2 in 2030" },
                { fieldName: "ssp32030", label: "Black non-Hispanic county projected population under SSP3 in 2030" },
                { fieldName: "ssp42030", label: "Black non-Hispanic county projected population under SSP4 in 2030" },
                { fieldName: "ssp52030", label: "Black non-Hispanic county projected population under SSP5 in 2030" },
                { fieldName: "ssp12035", label: "Black non-Hispanic county projected population under SSP1 in 2035" },
                { fieldName: "ssp22035", label: "Black non-Hispanic county projected population under SSP2 in 2035" },
                { fieldName: "ssp32035", label: "Black non-Hispanic county projected population under SSP3 in 2035" },
                { fieldName: "ssp42035", label: "Black non-Hispanic county projected population under SSP4 in 2035" },
                { fieldName: "ssp52035", label: "Black non-Hispanic county projected population under SSP5 in 2035" },
                { fieldName: "ssp12040", label: "Black non-Hispanic county projected population under SSP1 in 2040" },
                { fieldName: "ssp22040", label: "Black non-Hispanic county projected population under SSP2 in 2040" },
                { fieldName: "ssp32040", label: "Black non-Hispanic county projected population under SSP3 in 2040" },
                { fieldName: "ssp42040", label: "Black non-Hispanic county projected population under SSP4 in 2040" },
                { fieldName: "ssp52040", label: "Black non-Hispanic county projected population under SSP5 in 2040" },
                { fieldName: "ssp12045", label: "Black non-Hispanic county projected population under SSP1 in 2045" },
                { fieldName: "ssp22045", label: "Black non-Hispanic county projected population under SSP2 in 2045" },
                { fieldName: "ssp32045", label: "Black non-Hispanic county projected population under SSP3 in 2045" },
                { fieldName: "ssp42045", label: "Black non-Hispanic county projected population under SSP4 in 2045" },
                { fieldName: "ssp52045", label: "Black non-Hispanic county projected population under SSP5 in 2045" },
                { fieldName: "ssp12050", label: "Black non-Hispanic county projected population under SSP1 in 2050" },
                { fieldName: "ssp22050", label: "Black non-Hispanic county projected population under SSP2 in 2050" },
                { fieldName: "ssp32050", label: "Black non-Hispanic county projected population under SSP3 in 2050" },
                { fieldName: "ssp42050", label: "Black non-Hispanic county projected population under SSP4 in 2050" },
                { fieldName: "ssp52050", label: "Black non-Hispanic county projected population under SSP5 in 2050" },
                { fieldName: "ssp12055", label: "Black non-Hispanic county projected population under SSP1 in 2055" },
                { fieldName: "ssp22055", label: "Black non-Hispanic county projected population under SSP2 in 2055" },
                { fieldName: "ssp32055", label: "Black non-Hispanic county projected population under SSP3 in 2055" },
                { fieldName: "ssp42055", label: "Black non-Hispanic county projected population under SSP4 in 2055" },
                { fieldName: "ssp52055", label: "Black non-Hispanic county projected population under SSP5 in 2055" },
                { fieldName: "ssp12060", label: "Black non-Hispanic county projected population under SSP1 in 2060" },
                { fieldName: "ssp22060", label: "Black non-Hispanic county projected population under SSP2 in 2060" },
                { fieldName: "ssp32060", label: "Black non-Hispanic county projected population under SSP3 in 2060" },
                { fieldName: "ssp42060", label: "Black non-Hispanic county projected population under SSP4 in 2060" },
                { fieldName: "ssp52060", label: "Black non-Hispanic county projected population under SSP5 in 2060" },
                { fieldName: "ssp12065", label: "Black non-Hispanic county projected population under SSP1 in 2065" },
                { fieldName: "ssp22065", label: "Black non-Hispanic county projected population under SSP2 in 2065" },
                { fieldName: "ssp32065", label: "Black non-Hispanic county projected population under SSP3 in 2065" },
                { fieldName: "ssp42065", label: "Black non-Hispanic county projected population under SSP4 in 2065" },
                { fieldName: "ssp52065", label: "Black non-Hispanic county projected population under SSP5 in 2065" },
                { fieldName: "ssp12070", label: "Black non-Hispanic county projected population under SSP1 in 2070" },
                { fieldName: "ssp22070", label: "Black non-Hispanic county projected population under SSP2 in 2070" },
                { fieldName: "ssp32070", label: "Black non-Hispanic county projected population under SSP3 in 2070" },
                { fieldName: "ssp42070", label: "Black non-Hispanic county projected population under SSP4 in 2070" },
                { fieldName: "ssp52070", label: "Black non-Hispanic county projected population under SSP5 in 2070" },
                { fieldName: "ssp12075", label: "Black non-Hispanic county projected population under SSP1 in 2075" },
                { fieldName: "ssp22075", label: "Black non-Hispanic county projected population under SSP2 in 2075" },
                { fieldName: "ssp32075", label: "Black non-Hispanic county projected population under SSP3 in 2075" },
                { fieldName: "ssp42075", label: "Black non-Hispanic county projected population under SSP4 in 2075" },
                { fieldName: "ssp52075", label: "Black non-Hispanic county projected population under SSP5 in 2075" },
                { fieldName: "ssp12080", label: "Black non-Hispanic county projected population under SSP1 in 2080" },
                { fieldName: "ssp22080", label: "Black non-Hispanic county projected population under SSP2 in 2080" },
                { fieldName: "ssp32080", label: "Black non-Hispanic county projected population under SSP3 in 2080" },
                { fieldName: "ssp42080", label: "Black non-Hispanic county projected population under SSP4 in 2080" },
                { fieldName: "ssp52080", label: "Black non-Hispanic county projected population under SSP5 in 2080" },
                { fieldName: "ssp12085", label: "Black non-Hispanic county projected population under SSP1 in 2085" },
                { fieldName: "ssp22085", label: "Black non-Hispanic county projected population under SSP2 in 2085" },
                { fieldName: "ssp32085", label: "Black non-Hispanic county projected population under SSP3 in 2085" },
                { fieldName: "ssp42085", label: "Black non-Hispanic county projected population under SSP4 in 2085" },
                { fieldName: "ssp52085", label: "Black non-Hispanic county projected population under SSP5 in 2085" },
                { fieldName: "ssp12090", label: "Black non-Hispanic county projected population under SSP1 in 2090" },
                { fieldName: "ssp22090", label: "Black non-Hispanic county projected population under SSP2 in 2090" },
                { fieldName: "ssp32090", label: "Black non-Hispanic county projected population under SSP3 in 2090" },
                { fieldName: "ssp42090", label: "Black non-Hispanic county projected population under SSP4 in 2090" },
              ]
            }
          ]
        }
      }),
      
      new FeatureLayer({
        title: "American Indian Alaska Native Native Hawaiian Areas",
        url: "https://services3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/Climate_Mapping_Resilience_and_Adaptation_(CMRA)_Climate_and_Coastal_Inundation_Projections/FeatureServer/2",
        visible: false,
        popupTemplate: {
          title: "{NAME}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "FSRFLG", label: "Federal/State Recognition Flag" },
                { fieldName: "AIANNHNS", label: "National Standard Code" },
                { fieldName: "AREALAND", label: "Land Area (sq. meters)", format: { digitSeparator: true, places: 0 } },
                { fieldName: "AREAWATER", label: "Water Area (sq. meters)", format: { digitSeparator: true, places: 0 } },
                { fieldName: "AIANNHCC", label: "FIPS Class Codes" },
                { fieldName: "EFFDATE", label: "Effective Date", format: { dateFormat: "shortDate" } },
                { fieldName: "FUNCSTAT", label: "Functional Status" },
                { fieldName: "GEOID", label: "Geographic Identifier" },
                { fieldName: "LSADC", label: "Legal/Statistical Area Code" },
                { fieldName: "BASENAME", label: "Base Name" },
                { fieldName: "NAME", label: "Name" },
                { fieldName: "AIANNHCOMP", label: "Trust Land Component Indicator" },
                { fieldName: "STATEFP1", label: "State-FIPS Code 1" },
                { fieldName: "UR", label: "Urban/Rural Flag" },
                { fieldName: "VINTAGE", label: "Vintage" },
                { fieldName: "HU100", label: "Decennial Housing Count", format: { digitSeparator: true, places: 0 } },
                { fieldName: "POP100", label: "Decennial Population Count", format: { digitSeparator: true, places: 0 } }
              ]
            }
          ]
        }
      })
    ]
  }),


  
  new GroupLayer({
    title: "Climate Change Layers",
    layers: [
      new FeatureLayer({
        title: "Climate Change Disadvantaged Tracts",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Climate_Impact_Lab_view/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "Climate Change Data for this Tract:",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "DF_PFS", label: "Diagnosed diabetes among adults aged greater than or equal to 18 years (percentile)" },
                { fieldName: "AF_PFS", label: "Current asthma among adults aged greater than or equal to 18 years (percentile)" },
                { fieldName: "HDF_PFS", label: "Coronary heart disease among adults aged greater than or equal to 18 years (percentile)" },
                { fieldName: "DSF_PFS", label: "Diesel particulate matter exposure (percentile)" },
                { fieldName: "EBF_PFS", label: "Energy burden (percentile)" },
                { fieldName: "EALR_PFS", label: "Expected agricultural loss rate (Natural Hazards Risk Index) (percentile)" },
                { fieldName: "EBLR_PFS", label: "Expected building loss rate (Natural Hazards Risk Index) (percentile)" },
                { fieldName: "EPLR_PFS", label: "Expected population loss rate (Natural Hazards Risk Index) (percentile)" },
                { fieldName: "HBF_PFS", label: "Housing burden (percent) (percentile)" },
                { fieldName: "LLEF_PFS", label: "Low life expectancy (percentile)" },
                { fieldName: "LIF_PFS", label: "Linguistic isolation (percent) (percentile)" },
                { fieldName: "LMI_PFS", label: "Low median household income as a percent of area median income (percentile)" },
                { fieldName: "PM25F_PFS", label: "PM2.5 in the air (percentile)" },
                { fieldName: "HSEF", label: "Percent individuals age 25 or over with less than high school degree" },
                { fieldName: "P100_PFS", label: "Percent of individuals < 100% Federal Poverty Line (percentile)" },
                { fieldName: "P200_I_PFS", label: "Percent of individuals below 200% Federal Poverty Line (percentile)" },
                { fieldName: "AJDLI_ET", label: "Meets the less stringent low income criterion for the adjacency index?" },
                { fieldName: "LPF_PFS", label: "Percent pre-1960s housing (lead paint indicator) (percentile)" },
                { fieldName: "KP_PFS", label: "Share of homes with no kitchen or indoor plumbing (percent) (percentile)" },
                { fieldName: "NPL_PFS", label: "Proximity to NPL sites (percentile)" },
                { fieldName: "RMP_PFS", label: "Proximity to Risk Management Plan (RMP) facilities (percentile)" },
                { fieldName: "TSDF_PFS", label: "Proximity to hazardous waste sites (percentile)" },
                { fieldName: "TPF", label: "Total population" },
                { fieldName: "TF_PFS", label: "Traffic proximity and volume (percentile)" },
                { fieldName: "UF_PFS", label: "Unemployment (percent) (percentile)" },
                { fieldName: "WF_PFS", label: "Wastewater discharge (percentile)" },
                { fieldName: "UST_PFS", label: "Leaky underground storage tanks (percentile)" },
                { fieldName: "N_WTR", label: "Water and Wastewater Disadvantaged" },
                { fieldName: "N_WKFC", label: "Workforce Development Disadvantaged" },
                { fieldName: "N_CLT", label: "Climate Change Disadvantaged" },
                { fieldName: "N_ENY", label: "Energy Disadvantaged" },
                { fieldName: "N_TRN", label: "Transportation Disadvantaged" },
                { fieldName: "N_HSG", label: "Housing Disadvantaged" },
                { fieldName: "N_PLN", label: "Legacy Pollution Disadvantaged" },
                { fieldName: "N_HLTH", label: "Health Disadvantaged" },
                { fieldName: "SN_C", label: "Identified as disadvantaged" },
                { fieldName: "SN_T", label: "Identified as disadvantaged due to tribal overlap" },
                { fieldName: "DLI", label: "Greater than or equal to the 90th percentile for diabetes, is low income, and has a low percent of higher ed students?" },
                { fieldName: "ALI", label: "Greater than or equal to the 90th percentile for asthma, is low income, and has a low percent of higher ed students?" },
                { fieldName: "PLHSE", label: "Greater than or equal to the 90th percentile for households at or below 100% federal poverty level, has low HS attainment, and has a low percent of higher ed students?" } 
               
              ]
              }
             ]
            }
          }),
      new FeatureLayer({
        title: "Economic Damage Climate Change Projections",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Climate_Impact_Lab_view/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "Economic Damage Data for {County_Name}, {State_Name}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "County_FIPS", label: "County FIPS Code" },
                { fieldName: "County_Name", label: "County Name" },
                { fieldName: "State_Name", label: "State Name" },
                { fieldName: "energy_RCP45_2030", label: "Change in Energy Expenditures RCP45 2020-2039" },
                { fieldName: "energy_RCP45_2050", label: "Change in Energy Expenditures RCP45 2040-2059" },
                { fieldName: "energy_RCP45_2090", label: "Change in Energy Expenditures RCP45 2080-2099" },
                { fieldName: "energy_RCP85_2030", label: "Change in Energy Expenditures RCP85 2020-2039" },
                { fieldName: "energy_RCP85_2050", label: "Change in Energy Expenditures RCP85 2040-2059" },
                { fieldName: "energy_RCP85_2090", label: "Change in Energy Expenditures RCP85 2080-2099" },
                { fieldName: "laborhigh_RCP45_2030", label: "Change in Labor Productivity (High Risk Sectors) RCP45 2020-2039" },
                { fieldName: "laborhigh_RCP45_2050", label: "Change in Labor Productivity (High Risk Sectors) RCP45 2040-2059" },
                { fieldName: "laborhigh_RCP45_2090", label: "Change in Labor Productivity (High Risk Sectors) RCP45 2080-2099" },
                { fieldName: "laborhigh_RCP85_2030", label: "Change in Labor Productivity (High Risk Sectors) RCP85 2020-2039" },
                { fieldName: "laborhigh_RCP85_2050", label: "Change in Labor Productivity (High Risk Sectors) RCP85 2040-2059" },
                { fieldName: "laborhigh_RCP85_2090", label: "Change in Labor Productivity (High Risk Sectors) RCP85 2080-2099" },
                { fieldName: "labortotal_RCP45_2030", label: "Change in Labor Productivity RCP45 2020-2039" },
                { fieldName: "labortotal_RCP45_2050", label: "Change in Labor Productivity RCP45 2040-2059" },
                { fieldName: "labortotal_RCP45_2090", label: "Change in Labor Productivity RCP45 2080-2099" },
                { fieldName: "labortotal_RCP85_2030", label: "Change in Labor Productivity RCP85 2020-2039" },
                { fieldName: "labortotal_RCP85_2050", label: "Change in Labor Productivity RCP85 2040-2059" },
                { fieldName: "labortotal_RCP85_2090", label: "Change in Labor Productivity RCP85 2080-2099" },
                { fieldName: "mortality_RCP45_2030", label: "Change in Mortality Rate RCP45 2020-2039" },
                { fieldName: "mortality_RCP45_2050", label: "Change in Mortality Rate RCP45 2040-2059" },
                { fieldName: "mortality_RCP45_2090", label: "Change in Mortality Rate RCP45 2080-2099" },
                { fieldName: "mortality_RCP85_2030", label: "Change in Mortality Rate RCP85 2020-2039" },
                { fieldName: "mortality_RCP85_2050", label: "Change in Mortality Rate RCP85 2040-2059" },
                { fieldName: "mortality_RCP85_2090", label: "Change in Mortality Rate RCP85 2080-2099" },
                { fieldName: "LMILHSE", label: "Greater than or equal to the 90th percentile for low median household income as a percent of area median income, has low HS attainment, and has a low percent of higher ed students?" },
                { fieldName: "ULHSE", label: "Greater than or equal to the 90th percentile for unemployment, has low HS attainment, and has a low percent of higher ed students?" },
                { fieldName: "EPL_ET", label: "Greater than or equal to the 90th percentile for expected population loss" },
                { fieldName: "EAL_ET", label: "Greater than or equal to the 90th percentile for expected agricultural loss" },
                { fieldName: "EBL_ET", label: "Greater than or equal to the 90th percentile for expected building loss" },
                { fieldName: "EB_ET", label: "Greater than or equal to the 90th percentile for energy burden" },
                { fieldName: "PM25_ET", label: "Greater than or equal to the 90th percentile for PM 2.5 exposure" },
                { fieldName: "DS_ET", label: "Greater than or equal to the 90th percentile for diesel particulate matter" },
                { fieldName: "TP_ET", label: "Greater than or equal to the 90th percentile for traffic proximity" },
                { fieldName: "LPP_ET", label: "Greater than or equal to the 90th percentile for lead paint and the median house value is less than 90th percentile" },
                { fieldName: "HRS_ET", label: "Tract-level redlining score meets or exceeds 3.25" },
                { fieldName: "KP_ET", label: "Greater than or equal to the 90th percentile for share of homes without indoor plumbing or a kitchen" },
                { fieldName: "HB_ET", label: "Greater than or equal to the 90th percentile for housing burden" },
                { fieldName: "RMP_ET", label: "Greater than or equal to the 90th percentile for Risk Management Plan (RMP) proximity" },
                { fieldName: "NPL_ET", label: "Greater than or equal to the 90th percentile for NPL (superfund sites) proximity" },
                { fieldName: "TSDF_ET", label: "Greater than or equal to the 90th percentile for proximity to hazardous waste sites" },
                { fieldName: "WD_ET", label: "Greater than or equal to the 90th percentile for wastewater discharge" },
                { fieldName: "UST_ET", label: "Greater than or equal to the 90th percentile for leaky underwater storage tanks" },
                { fieldName: "DB_ET", label: "Greater than or equal to the 90th percentile for diabetes" },
                { fieldName: "A_ET", label: "Greater than or equal to the 90th percentile for asthma" },
                { fieldName: "HD_ET", label: "Greater than or equal to the 90th percentile for heart disease" },
                { fieldName: "LLE_ET", label: "Greater than or equal to the 90th percentile for low life expectancy" },
                { fieldName: "UN_ET", label: "Greater than or equal to the 90th percentile for unemployment" },
                { fieldName: "LISO_ET", label: "Greater than or equal to the 90th percentile for households in linguistic isolation" },
                { fieldName: "POV_ET", label: "Greater than or equal to the 90th percentile for households at or below 100% federal poverty level" },
                { fieldName: "LMI_ET", label: "Greater than or equal to the 90th percentile for low median household income as a percent of area median income" },
                { fieldName: "IA_LMI_ET", label: "Low median household income as a percent of territory median income in 2009 exceeds 90th percentile" },
                { fieldName: "IA_UN_ET", label: "Unemployment (percent) in 2009 exceeds 90th percentile" },
                { fieldName: "IA_POV_ET", label: "Percentage households below 100% of federal poverty line in 2009 exceeds 90th percentile" },
                { fieldName: "TC", label: "Total threshold criteria exceeded" },
                { fieldName: "CC", label: "Total categories exceeded" },
                { fieldName: "IAULHSE", label: "Greater than or equal to the 90th percentile for unemployment and has low HS education in 2009 (island areas)?" },
                { fieldName: "IAPLHSE", label: "Greater than or equal to the 90th percentile for households at or below 100% federal poverty level and has low HS education in 2009 (island areas)?" },
                { fieldName: "IALMILHSE", label: "Greater than or equal to the 90th percentile for low median household income as a percent of area median income and has low HS education in 2009 (island areas)?" },
                { fieldName: "IALMIL_76", label: "Low median household income as a percent of territory median income in 2009 (percentile)" },
                { fieldName: "IAPLHS_77", label: "Percentage households below 100% of federal poverty line in 2009 for island areas (percentile)" },
                { fieldName: "IAULHS_78", label: "Unemployment (percent) in 2009 for island areas (percentile)" },
                { fieldName: "LHE", label: "Low high school education and low percent of higher ed students" },
                { fieldName: "IALHE", label: "Low high school education in 2009 (island areas)" },
                { fieldName: "IAHSEF", label: "Percent individuals age 25 or over with less than high school degree in 2009" },
                { fieldName: "N_CLT_EOMI", label: "At least one climate threshold exceeded" },
                { fieldName: "N_ENY_EOMI", label: "At least one energy threshold exceeded" },
                { fieldName: "N_TRN_EOMI", label: "At least one traffic threshold exceeded" },
                { fieldName: "N_HSG_EOMI", label: "At least one housing threshold exceeded" },
                { fieldName: "N_PLN_EOMI", label: "At least one pollution threshold exceeded" },
                { fieldName: "N_WTR_EOMI", label: "At least one water threshold exceeded" },
                { fieldName: "N_HLTH_88", label: "At least one health threshold exceeded" },
                { fieldName: "N_WKFC_89", label: "At least one workforce threshold exceeded" },
                { fieldName: "FPL200S", label: "Exceeds Federal Poverty Level 200 threshold" },
                { fieldName: "N_WKFC_91", label: "Both workforce socioeconomic indicators exceeded" },
                { fieldName: "TD_ET", label: "Greater than or equal to the 90th percentile for DOT travel barriers" },
                { fieldName: "TD_PFS", label: "DOT Travel Barriers Score (percentile)" },
                { fieldName: "FLD_PFS", label: "Share of properties at risk of flood in 30 years (percentile)" },
                { fieldName: "WFR_PFS", label: "Share of properties at risk of fire in 30 years (percentile)" },
                { fieldName: "FLD_ET", label: "Greater than or equal to the 90th percentile for share of properties at risk of flood in 30 years" },
                { fieldName: "WFR_ET", label: "Greater than or equal to the 90th percentile for share of properties at risk of fire in 30 years" },
                { fieldName: "ADJ_ET", label: "Is the tract surrounded by disadvantaged communities?" },
                { fieldName: "IS_PFS", label: "Share of the tract's land area that is covered by impervious surface or cropland as a percent (percentile)" },
                { fieldName: "IS_ET", label: "Greater than or equal to the 90th percentile for share of the tract's land area that is covered by impervious surface or cropland as a percent and is low income?" },
                { fieldName: "AML_ET", label: "Is there at least one abandoned mine in this census tract, where missing data is treated as False?" },
                { fieldName: "FUDS_RAW", label: "Is there at least one Formerly Used Defense Site (FUDS) in the tract?" },
                { fieldName: "FUDS_ET", label: "Is there at least one Formerly Used Defense Site (FUDS) in the tract, where missing data is treated as False?" },
                { fieldName: "IMP_FLG", label: "Income data has been estimated (imputed) based on neighbor income" },
                { fieldName: "DM_B", label: "Percent Black or African American" },
                { fieldName: "DM_AI", label: "Percent American Indian / Alaska Native" },
                { fieldName: "DM_A", label: "Percent Asian" },
                { fieldName: "DM_HI", label: "Percent Native Hawaiian or Pacific" },
                { fieldName: "DM_T", label: "Percent two or more races" },
                { fieldName: "DM_W", label: "Percent White" },
                { fieldName: "DM_H", label: "Percent Hispanic or Latino" },
                { fieldName: "DM_O", label: "Percent other races" },
                { fieldName: "AGE_10", label: "Percent age under 10" },
                { fieldName: "AGE_MIDDLE", label: "Percent age 10 to 64" },
                { fieldName: "AGE_OLD", label: "Percent age over 64" },
                { fieldName: "TA_COU_116", label: "Number of Tribal areas within Census tract for Alaska" },
                { fieldName: "TA_COUNT_C", label: "Number of Tribal areas within Census tract" },
                { fieldName: "TA_PERC", label: "Percent of the Census tract that is within Tribal areas" },
                { fieldName: "TA_PERC_FE", label: "Percent of the Census tract that is within Tribal areas, for display" },
                { fieldName: "UI_EXP", label: "Methodology type used" },
                { fieldName: "THRHLD", label: "Total thresholds possible" }
                 
              ]
            }
          ]
        }
      })
    ]
  }),
  new GroupLayer({
    title: "Health Layers",
    layers: [
      new FeatureLayer({
        title: "National Health Data",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/CountyHealthRankings2020_WFL1/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "National Health Data",
          content: [
            {
              type: "fields", // Enables all fields dynamically
              fieldInfos: [
                { fieldName: "v001_race_aian", label: "Age-adjusted YPLL rate (American Indian/Alaska Natives)" },
                { fieldName: "v001_race_aian_flag", label: "Premature Death Flag (American Indian/Alaska Natives)" },
                { fieldName: "v001_race_asian", label: "Age-adjusted YPLL rate (Asians)" },
                { fieldName: "v001_race_asian_flag", label: "Premature Death Flag (Asians)" },
                { fieldName: "v001_race_black", label: "Age-adjusted YPLL rate (Blacks)" },
                { fieldName: "v001_race_black_flag", label: "Premature Death Flag (Blacks)" },
                { fieldName: "v001_race_hispanic", label: "Age-adjusted YPLL rate (Hispanics)" },
                { fieldName: "v001_race_hispanic_flag", label: "Premature Death Flag (Hispanics)" },
                { fieldName: "v001_race_nhopi", label: "Age-adjusted YPLL rate (Native Hawaiian/Other Pacific Islander)" },
                { fieldName: "v001_race_nhopi_flag", label: "Premature Death Flag (Native Hawaiian/Other Pacific Islander)" },
                { fieldName: "v001_race_white", label: "Age-adjusted YPLL rate (Whites)" },
                { fieldName: "v001_race_white_flag", label: "Premature Death Flag (Whites)" },
                { fieldName: "v001_rawvalue", label: "Age-adjusted YPLL rate (Total)" },
                { fieldName: "v002_rawvalue", label: "Percentage of Adults Reporting Fair or Poor Health" },
                { fieldName: "v003_denominator", label: "Population Ages 18 to 64" },
                { fieldName: "v003_numerator", label: "Number of adults 18-64 without insurance" },
                { fieldName: "v003_rawvalue", label: "Percentage of adults 18-64 without insurance" },
                { fieldName: "v004_denominator", label: "County Population" },
                { fieldName: "v004_numerator", label: "Number of primary care physicians (PCP) in patient care" },
                { fieldName: "v004_rawvalue", label: "Primary Care Physicians per 100,000" },
                { fieldName: "v005_race_aian", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (American Indian/Alaska Natives)" },
                { fieldName: "v005_race_asian", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Asian/Pacific Islanders)" },
                { fieldName: "v005_race_black", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Blacks)" },
                { fieldName: "v005_race_hispanic", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Hispanics)" },
                { fieldName: "v005_race_white", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (non-Hispanic whites)" },
                { fieldName: "v005_rawvalue", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees" },
                { fieldName: "v009_rawvalue", label: "Percentage of adults that reported currently smoking" },
                { fieldName: "v011_rawvalue", label: "Percentage of adults that report BMI >= 30" },
                { fieldName: "v014_denominator", label: "Total female population, ages 15 to 19 over seven-year period" },
                { fieldName: "v014_numerator", label: "Total number of births to mothers ages 15 to 19 during seven-year period" },
                { fieldName: "v014_race_aian", label: "Births per 1,000 females ages 15-19 (non-Hispanic American Indian/Alaska Native mothers)" },
                { fieldName: "v014_race_asian", label: "Births per 1,000 females ages 15-19 (non-Hispanic Asian mothers)" },
                { fieldName: "v014_race_black", label: "Births per 1,000 females ages 15-19 (non-Hispanic Black mothers)" },
                { fieldName: "v014_race_hispanic", label: "Births per 1,000 females ages 15-19 (Hispanic mothers)" },
                { fieldName: "v014_race_nhopi", label: "Births per 1,000 females ages 15-19 (non-Hispanic Native Hawaiian and Other Pacific Islander mothers)" },
                { fieldName: "v014_race_tom", label: "Births per 1,000 females ages 15-19 (non-Hispanic two or more races mothers)" },
                { fieldName: "v014_race_white", label: "Births per 1,000 females ages 15-19 (non-Hispanic white mothers)" },
                { fieldName: "v014_rawvalue", label: "Births per 1,000 females ages 15-19" },
                { fieldName: "v015_denominator", label: "Total population over seven-year period" },
                { fieldName: "v015_numerator", label: "Deaths due to homicide (ICD-10 codes X85-Y09) during seven-year period" },
                { fieldName: "v015_race_aian", label: "Crude homicide rate per 100,000 for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v015_race_asian", label: "Crude homicide rate per 100,000 for non-Hispanic Asians" },
                { fieldName: "v015_race_black", label: "Crude homicide rate per 100,000 for non-Hispanic Blacks" },
                { fieldName: "v015_race_hispanic", label: "Crude homicide rate per 100,000 for Hispanics" },
                { fieldName: "v015_race_nhopi", label: "Crude homicide rate per 100,000 for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v015_race_white", label: "Crude homicide rate per 100,000 for non-Hispanic whites" },
                { fieldName: "v015_rawvalue", label: "Crude homicide rate per 100,000" },
                { fieldName: "v021_denominator", label: "Number of students expected to graduate" },
                { fieldName: "v021_numerator", label: "Cohort members earning a regular high school diploma by the end of the school year" },
                { fieldName: "v021_rawvalue", label: "Graduation rate" },
                { fieldName: "v023_denominator", label: "Size of the labor force" },
                { fieldName: "v023_numerator", label: "Number of people ages 16+ unemployed and looking for work" },
                { fieldName: "v023_rawvalue", label: "Percentage of population ages 16+ unemployed and looking for work" },
                { fieldName: "v024_numerator", label: "Population under age 18 with household income below the poverty level" },
                { fieldName: "v024_race_aian", label: "Percentage of American Indian and Alaska Native children (under age 18) living in poverty" },
                { fieldName: "v024_race_asian", label: "Percentage of Asian/Pacific Islander children (under age 18) living in poverty" },
                { fieldName: "v024_race_black", label: "Percentage of Black children (under age 18) living in poverty" },
                { fieldName: "v024_race_hispanic", label: "Percentage of Hispanic children (under age 18) living in poverty" },
                { fieldName: "v024_race_white", label: "Percentage of non-Hispanic white children (under age 18) living in poverty" },
                { fieldName: "v024_rawvalue", label: "Percentage of children (under age 18) living in poverty" },
                { fieldName: "v036_rawvalue", label: "Average number of reported physically unhealthy days per month" },
                { fieldName: "v037_denominator", label: "Total number of live births during seven-year period" },
                { fieldName: "v037_flag", label: "Low Birthweight flag (0 = No Flag, 1=Unreliable, 2=Suppressed)" },
                { fieldName: "v037_numerator", label: "Total number of live births for which the infant weighed less than 2,500 grams (approximately 5 lbs., 8 oz.) during seven-year period" },
                { fieldName: "v037_race_aian", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v037_race_asian", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Asians" },
                { fieldName: "v037_race_black", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Blacks" },
                { fieldName: "v037_race_hispanic", label: "Percentage of births with low birthweight (<2500g) for Hispanics" },
                { fieldName: "v037_race_nhopi", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v037_race_tom", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic two or more races" },
                { fieldName: "v037_race_white", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic whites" },
                { fieldName: "v037_rawvalue", label: "Percentage of births with low birthweight (<2500g)" },
                { fieldName: "v039_denominator", label: "Total population over seven-year period" },
                { fieldName: "v039_numerator", label: "Number of motor vehicle-related deaths" },
                { fieldName: "v039_race_aian", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v039_race_asian", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Asians" },
                { fieldName: "v039_race_black", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Blacks" },
                { fieldName: "v039_race_hispanic", label: "Crude motor-vehicle related mortality rate per 100,000 population for Hispanics" },
                { fieldName: "v039_race_nhopi", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v039_race_white", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic whites" },
                { fieldName: "v039_rawvalue", label: "Crude motor-vehicle related mortality rate per 100,000 population" },
                { fieldName: "v042_rawvalue", label: "Average number of reported mentally unhealthy days per month" },
                { fieldName: "v044_denominator", label: "20th percentile of median household income" },
                { fieldName: "v044_numerator", label: "80th percentile of median household income" },
                { fieldName: "v044_rawvalue", label: "Ratio of household income at the 80th percentile to income at the 20th percentile" },
                { fieldName: "v045_denominator", label: "County Population" },
                { fieldName: "v045_numerator", label: "Number of chlamydia cases" },
                { fieldName: "v045_rawvalue", label: "Chlamydia cases per 100,000 population" },
                { fieldName: "v049_rawvalue", label: "Percentage of adults that report excessive drinking" },
                { fieldName: "v050_race_aian", label: "Percentage of American Indian/Alaska Native female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_asian", label: "Percentage of Asian/Pacific Islander female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_black", label: "Percentage of Black female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_hispanic", label: "Percentage of Hispanic female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_white", label: "Percentage of non-Hispanic white female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_rawvalue", label: "Percentage of female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v051_rawvalue", label: "Population estimate" },
                { fieldName: "v052_denominator", label: "County Population" },
                { fieldName: "v052_numerator", label: "Population under age 18" },
                { fieldName: "v052_rawvalue", label: "Percentage of population less than 18 years of age" },
                { fieldName: "v053_denominator", label: "County Population" },
                { fieldName: "v053_numerator", label: "Population ages 65 years and older" },
                { fieldName: "v053_rawvalue", label: "Percentage of population ages 65 years and older" },
                { fieldName: "v054_denominator", label: "County Population" },
                { fieldName: "v054_numerator", label: "Number of people that are non-Hispanic Black or African American" },
                { fieldName: "v054_rawvalue", label: "Percentage of population that is non-Hispanic Black or African American" },
                { fieldName: "v055_denominator", label: "County Population" },
                { fieldName: "v055_numerator", label: "Number of people that are American Indian or Alaska Native" },
                { fieldName: "v055_rawvalue", label: "Percentage of population that is American Indian or Alaska Native" },
                { fieldName: "v056_denominator", label: "County Population" },
                { fieldName: "v056_numerator", label: "Number of people that are Hispanic" },
                { fieldName: "v056_rawvalue", label: "Percentage of population that is Hispanic" },
                { fieldName: "v057_denominator", label: "County Population" },
                { fieldName: "v057_numerator", label: "Female population" },
                { fieldName: "v057_rawvalue", label: "Percentage of population that is female" },
                { fieldName: "v058_denominator", label: "County Population" },
                { fieldName: "v058_numerator", label: "Number of people that live in a Census-defined rural area" },
                { fieldName: "v058_rawvalue", label: "Percentage of population that lives in a Census-defined rural area" },
                { fieldName: "v059_denominator", label: "Population ages 5 years and older" },
                { fieldName: "v059_numerator", label: "Number of non-native English speakers who are not proficient speaking English" },
                { fieldName: "v059_rawvalue", label: "Percentage of non-native English speakers who are not proficient speaking English" },
                { fieldName: "v060_rawvalue", label: "Percentage of adults aged 18 and over with diagnosed diabetes" },
                { fieldName: "v061_denominator", label: "Population 13 years and older" },
                { fieldName: "v061_numerator", label: "Number of HIV cases in the county" },
                { fieldName: "v061_rawvalue", label: "Human immunodeficiency virus (HIV) prevalence rate per 100,000 population" },
                { fieldName: "v062_denominator", label: "County Population" },
                { fieldName: "v062_numerator", label: "Number of mental health providers (MHP)" },
                { fieldName: "v062_rawvalue", label: "Mental Health Providers per 100,000" },
                { fieldName: "v063_race_aian", label: "Median household income for American Indian & Alaska Native householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_asian", label: "Median household income for Asian householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_black", label: "Median household income for Black householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_hispanic", label: "Median household income for Hispanic householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_white", label: "Median household income for non-Hispanic white householder - from the 2016-2020 ACS" },
                { fieldName: "v063_rawvalue", label: "Median household income" },
                { fieldName: "v065_denominator", label: "Public school students, grades PK-12" },
                { fieldName: "v065_numerator", label: "Public school students, grades PK-12, eligible for free or reduced-price lunch" },
                { fieldName: "v065_rawvalue", label: "Percentage of children enrolled in public schools eligible for free or reduced price lunch" },
                { fieldName: "v067_denominator", label: "Total workforce" },
                { fieldName: "v067_numerator", label: "Workers commuting alone to work via car, truck, or van" },
                { fieldName: "v067_race_aian", label: "Percentage of American Indian and Alaska Native workers who drive alone to work" },
                { fieldName: "v067_race_asian", label: "Percentage of Asian/Pacific Islander workers who drive alone to work" },
                { fieldName: "v067_race_black", label: "Percentage of Black workers who drive alone to work" },
                { fieldName: "v067_race_hispanic", label: "Percentage of Hispanic workers who drive alone to work" },
                { fieldName: "v067_race_white", label: "Percentage of non-Hispanic white workers who drive alone to work" },
                { fieldName: "v067_rawvalue", label: "Percentage of workers who drive alone to work" },
                { fieldName: "v069_denominator", label: "Adults age 25-44" },
                { fieldName: "v069_numerator", label: "Adults age 25-44 with some post-secondary education" },
                { fieldName: "v069_rawvalue", label: "Percentage of adults age 25-44 with some post-secondary education" },
                { fieldName: "v070_rawvalue", label: "Percentage of adults that report no leisure-time physical activity" },
                { fieldName: "v080_denominator", label: "County Population" },
                { fieldName: "v080_numerator", label: "Number of people that are Native Hawaiian or Other Pacific Islander" },
                { fieldName: "v080_rawvalue", label: "Percentage of population that is Native Hawaiian or Other Pacific Islander" },
                { fieldName: "v081_denominator", label: "County Population" },
                { fieldName: "v081_numerator", label: "Number of people that are Asian" },
                { fieldName: "v081_rawvalue", label: "Percentage of population that is Asian" },
                { fieldName: "v082_denominator", label: "Number of children in households" },
                { fieldName: "v082_numerator", label: "Number of children that live in single-parent households" },
                { fieldName: "v082_rawvalue", label: "Percentage of children that live in single-parent households" },
                { fieldName: "v083_denominator", label: "2010 U.S. census population" },
                { fieldName: "v083_numerator", label: "Number of people with limited access to health foods" },
                { fieldName: "v083_rawvalue", label: "Percentage of people with limited access to health foods" },
                { fieldName: "v085_denominator", label: "Population under age 65" },
                { fieldName: "v085_numerator", label: "Number of people under age 65 without insurance" },
                { fieldName: "v085_rawvalue", label: "Percentage of people under age 65 without insurance" },
                { fieldName: "v088_denominator", label: "County Population" },
                { fieldName: "v088_numerator", label: "Number of dentists" },
                { fieldName: "v088_rawvalue", label: "Dentists per 100,000" },
                { fieldName: "v122_denominator", label: "Population under age 19" },
                { fieldName: "v122_numerator", label: "Number of children (under 19) without insurance" },
                { fieldName: "v122_rawvalue", label: "Percentage of children (under 19) without insurance" },
                { fieldName: "v124_rawvalue", label: "County affected by a water violation: 1-Yes, 0-No" },
                { fieldName: "v125_rawvalue", label: "Average daily amount of fine particulate matter in micrograms per cubic meter" },
                { fieldName: "v126_denominator", label: "County Population" },
                { fieldName: "v126_numerator", label: "Number of people that are Non-Hispanic White" },
                { fieldName: "v126_rawvalue", label: "Percentage of population that is Non-Hispanic White" },
                { fieldName: "v127_denominator", label: "Total population under age 75 over three-year period" },
                { fieldName: "v127_numerator", label: "Number of deaths under age 75" },
                { fieldName: "v127_race_aian", label: "Age-adjusted death rate per 100,000 for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v127_race_asian", label: "Age-adjusted death rate per 100,000 for non-Hispanic Asians" },
                { fieldName: "v127_race_black", label: "Age-adjusted death rate per 100,000 for non-Hispanic Blacks" },
                { fieldName: "v127_race_hispanic", label: "Age-adjusted death rate per 100,000 for Hispanics" },
                { fieldName: "v127_race_nhopi", label: "Age-adjusted YPLL rate per 100,000 for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v127_race_white", label: "Age-adjusted death rate per 100,000 for non-Hispanic whites" },
                { fieldName: "v127_rawvalue", label: "Age-adjusted death rate per 100,000" },
                { fieldName: "v128_denominator", label: "Total population under age 20 over four-year period" },
                { fieldName: "v128_numerator", label: "Number of deaths under age 20" },
                { fieldName: "v128_race_aian", label: "Deaths under age 20 per 100,000 population for non-Hispanic American Indian/Alaska Native" },
                { fieldName: "v128_race_asian", label: "Deaths under age 20 per 100,000 population for non-Hispanic Asian" },
                { fieldName: "v128_race_black", label: "Deaths under age 20 per 100,000 population for non-Hispanic Blacks" },
                { fieldName: "v128_race_hispanic", label: "Deaths under age 20 per 100,000 population for Hispanics" },
                { fieldName: "v128_race_nhopi", label: "Deaths under age 20 per 100,000 population for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v128_race_white", label: "Deaths under age 20 per 100,000 population for non-Hispanic whites" },
                { fieldName: "v128_rawvalue", label: "Deaths under age 20 per 100,000 population" },
                { fieldName: "v129_denominator", label: "Total live births during seven-year period" },
                { fieldName: "v129_numerator", label: "Number of infant deaths" },
                { fieldName: "v129_race_aian", label: "Infant death rate per 1,000 live births for non-Hispanic American Indian/Alaska Native" },
                { fieldName: "v129_race_asian", label: "Infant death rate per 1,000 live births for non-Hispanic Asian" },
                { fieldName: "v129_race_black", label: "Infant death rate per 1,000 live births for non-Hispanic Blacks" },
                { fieldName: "v129_race_hispanic", label: "Infant death rate per 1,000 live births for Hispanics" },
                { fieldName: "v129_race_nhopi", label: "Infant death rate per 1,000 live births for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v129_race_tom", label: "Infant death rate per 1,000 live births for non-Hispanic two or more races" },
                { fieldName: "v129_race_white", label: "Infant death rate per 1,000 live births for non-Hispanic whites" },
                { fieldName: "v129_rawvalue", label: "Infant death rate per 1,000 live births" },
              ]
            }
          ]
        }
      }),
      new FeatureLayer({
        title: "State Health Data",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/CountyHealthRankings2020_WFL1/FeatureServer/1",
        visible: false,
        popupTemplate: {
          title: "Health Data by State",
          content: [
            {
              type: "fields", // Enables all fields dynamically
              fieldInfos: [
                { fieldName: "v001_race_aian", label: "Age-adjusted YPLL rate (American Indian/Alaska Natives)" },
                { fieldName: "v001_race_aian_flag", label: "Premature Death Flag (American Indian/Alaska Natives)" },
                { fieldName: "v001_race_asian", label: "Age-adjusted YPLL rate (Asians)" },
                { fieldName: "v001_race_asian_flag", label: "Premature Death Flag (Asians)" },
                { fieldName: "v001_race_black", label: "Age-adjusted YPLL rate (Blacks)" },
                { fieldName: "v001_race_black_flag", label: "Premature Death Flag (Blacks)" },
                { fieldName: "v001_race_hispanic", label: "Age-adjusted YPLL rate (Hispanics)" },
                { fieldName: "v001_race_hispanic_flag", label: "Premature Death Flag (Hispanics)" },
                { fieldName: "v001_race_nhopi", label: "Age-adjusted YPLL rate (Native Hawaiian/Other Pacific Islander)" },
                { fieldName: "v001_race_nhopi_flag", label: "Premature Death Flag (Native Hawaiian/Other Pacific Islander)" },
                { fieldName: "v001_race_white", label: "Age-adjusted YPLL rate (Whites)" },
                { fieldName: "v001_race_white_flag", label: "Premature Death Flag (Whites)" },
                { fieldName: "v001_rawvalue", label: "Age-adjusted YPLL rate (Total)" },
                { fieldName: "v002_rawvalue", label: "Percentage of Adults Reporting Fair or Poor Health" },
                { fieldName: "v003_denominator", label: "Population Ages 18 to 64" },
                { fieldName: "v003_numerator", label: "Number of adults 18-64 without insurance" },
                { fieldName: "v003_rawvalue", label: "Percentage of adults 18-64 without insurance" },
                { fieldName: "v004_denominator", label: "County Population" },
                { fieldName: "v004_numerator", label: "Number of primary care physicians (PCP) in patient care" },
                { fieldName: "v004_rawvalue", label: "Primary Care Physicians per 100,000" },
                { fieldName: "v005_race_aian", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (American Indian/Alaska Natives)" },
                { fieldName: "v005_race_asian", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Asian/Pacific Islanders)" },
                { fieldName: "v005_race_black", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Blacks)" },
                { fieldName: "v005_race_hispanic", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Hispanics)" },
                { fieldName: "v005_race_white", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (non-Hispanic whites)" },
                { fieldName: "v005_rawvalue", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees" },
                { fieldName: "v009_rawvalue", label: "Percentage of adults that reported currently smoking" },
                { fieldName: "v011_rawvalue", label: "Percentage of adults that report BMI >= 30" },
                { fieldName: "v014_denominator", label: "Total female population, ages 15 to 19 over seven-year period" },
                { fieldName: "v014_numerator", label: "Total number of births to mothers ages 15 to 19 during seven-year period" },
                { fieldName: "v014_race_aian", label: "Births per 1,000 females ages 15-19 (non-Hispanic American Indian/Alaska Native mothers)" },
                { fieldName: "v014_race_asian", label: "Births per 1,000 females ages 15-19 (non-Hispanic Asian mothers)" },
                { fieldName: "v014_race_black", label: "Births per 1,000 females ages 15-19 (non-Hispanic Black mothers)" },
                { fieldName: "v014_race_hispanic", label: "Births per 1,000 females ages 15-19 (Hispanic mothers)" },
                { fieldName: "v014_race_nhopi", label: "Births per 1,000 females ages 15-19 (non-Hispanic Native Hawaiian and Other Pacific Islander mothers)" },
                { fieldName: "v014_race_tom", label: "Births per 1,000 females ages 15-19 (non-Hispanic two or more races mothers)" },
                { fieldName: "v014_race_white", label: "Births per 1,000 females ages 15-19 (non-Hispanic white mothers)" },
                { fieldName: "v014_rawvalue", label: "Births per 1,000 females ages 15-19" },
                { fieldName: "v015_denominator", label: "Total population over seven-year period" },
                { fieldName: "v015_numerator", label: "Deaths due to homicide (ICD-10 codes X85-Y09) during seven-year period" },
                { fieldName: "v015_race_aian", label: "Crude homicide rate per 100,000 for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v015_race_asian", label: "Crude homicide rate per 100,000 for non-Hispanic Asians" },
                { fieldName: "v015_race_black", label: "Crude homicide rate per 100,000 for non-Hispanic Blacks" },
                { fieldName: "v015_race_hispanic", label: "Crude homicide rate per 100,000 for Hispanics" },
                { fieldName: "v015_race_nhopi", label: "Crude homicide rate per 100,000 for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v015_race_white", label: "Crude homicide rate per 100,000 for non-Hispanic whites" },
                { fieldName: "v015_rawvalue", label: "Crude homicide rate per 100,000" },
                { fieldName: "v021_denominator", label: "Number of students expected to graduate" },
                { fieldName: "v021_numerator", label: "Cohort members earning a regular high school diploma by the end of the school year" },
                { fieldName: "v021_rawvalue", label: "Graduation rate" },
                { fieldName: "v023_denominator", label: "Size of the labor force" },
                { fieldName: "v023_numerator", label: "Number of people ages 16+ unemployed and looking for work" },
                { fieldName: "v023_rawvalue", label: "Percentage of population ages 16+ unemployed and looking for work" },
                { fieldName: "v024_numerator", label: "Population under age 18 with household income below the poverty level" },
                { fieldName: "v024_race_aian", label: "Percentage of American Indian and Alaska Native children (under age 18) living in poverty" },
                { fieldName: "v024_race_asian", label: "Percentage of Asian/Pacific Islander children (under age 18) living in poverty" },
                { fieldName: "v024_race_black", label: "Percentage of Black children (under age 18) living in poverty" },
                { fieldName: "v024_race_hispanic", label: "Percentage of Hispanic children (under age 18) living in poverty" },
                { fieldName: "v024_race_white", label: "Percentage of non-Hispanic white children (under age 18) living in poverty" },
                { fieldName: "v024_rawvalue", label: "Percentage of children (under age 18) living in poverty" },
                { fieldName: "v036_rawvalue", label: "Average number of reported physically unhealthy days per month" },
                { fieldName: "v037_denominator", label: "Total number of live births during seven-year period" },
                { fieldName: "v037_flag", label: "Low Birthweight flag (0 = No Flag, 1=Unreliable, 2=Suppressed)" },
                { fieldName: "v037_numerator", label: "Total number of live births for which the infant weighed less than 2,500 grams (approximately 5 lbs., 8 oz.) during seven-year period" },
                { fieldName: "v037_race_aian", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v037_race_asian", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Asians" },
                { fieldName: "v037_race_black", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Blacks" },
                { fieldName: "v037_race_hispanic", label: "Percentage of births with low birthweight (<2500g) for Hispanics" },
                { fieldName: "v037_race_nhopi", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v037_race_tom", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic two or more races" },
                { fieldName: "v037_race_white", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic whites" },
                { fieldName: "v037_rawvalue", label: "Percentage of births with low birthweight (<2500g)" },
                { fieldName: "v039_denominator", label: "Total population over seven-year period" },
                { fieldName: "v039_numerator", label: "Number of motor vehicle-related deaths" },
                { fieldName: "v039_race_aian", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v039_race_asian", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Asians" },
                { fieldName: "v039_race_black", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Blacks" },
                { fieldName: "v039_race_hispanic", label: "Crude motor-vehicle related mortality rate per 100,000 population for Hispanics" },
                { fieldName: "v039_race_nhopi", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v039_race_white", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic whites" },
                { fieldName: "v039_rawvalue", label: "Crude motor-vehicle related mortality rate per 100,000 population" },
                { fieldName: "v042_rawvalue", label: "Average number of reported mentally unhealthy days per month" },
                { fieldName: "v044_denominator", label: "20th percentile of median household income" },
                { fieldName: "v044_numerator", label: "80th percentile of median household income" },
                { fieldName: "v044_rawvalue", label: "Ratio of household income at the 80th percentile to income at the 20th percentile" },
                { fieldName: "v045_denominator", label: "County Population" },
                { fieldName: "v045_numerator", label: "Number of chlamydia cases" },
                { fieldName: "v045_rawvalue", label: "Chlamydia cases per 100,000 population" },
                { fieldName: "v049_rawvalue", label: "Percentage of adults that report excessive drinking" },
                { fieldName: "v050_race_aian", label: "Percentage of American Indian/Alaska Native female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_asian", label: "Percentage of Asian/Pacific Islander female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_black", label: "Percentage of Black female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_hispanic", label: "Percentage of Hispanic female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_white", label: "Percentage of non-Hispanic white female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_rawvalue", label: "Percentage of female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v051_rawvalue", label: "Population estimate" },
                { fieldName: "v052_denominator", label: "County Population" },
                { fieldName: "v052_numerator", label: "Population under age 18" },
                { fieldName: "v052_rawvalue", label: "Percentage of population less than 18 years of age" },
                { fieldName: "v053_denominator", label: "County Population" },
                { fieldName: "v053_numerator", label: "Population ages 65 years and older" },
                { fieldName: "v053_rawvalue", label: "Percentage of population ages 65 years and older" },
                { fieldName: "v054_denominator", label: "County Population" },
                { fieldName: "v054_numerator", label: "Number of people that are non-Hispanic Black or African American" },
                { fieldName: "v054_rawvalue", label: "Percentage of population that is non-Hispanic Black or African American" },
                { fieldName: "v055_denominator", label: "County Population" },
                { fieldName: "v055_numerator", label: "Number of people that are American Indian or Alaska Native" },
                { fieldName: "v055_rawvalue", label: "Percentage of population that is American Indian or Alaska Native" },
                { fieldName: "v056_denominator", label: "County Population" },
                { fieldName: "v056_numerator", label: "Number of people that are Hispanic" },
                { fieldName: "v056_rawvalue", label: "Percentage of population that is Hispanic" },
                { fieldName: "v057_denominator", label: "County Population" },
                { fieldName: "v057_numerator", label: "Female population" },
                { fieldName: "v057_rawvalue", label: "Percentage of population that is female" },
                { fieldName: "v058_denominator", label: "County Population" },
                { fieldName: "v058_numerator", label: "Number of people that live in a Census-defined rural area" },
                { fieldName: "v058_rawvalue", label: "Percentage of population that lives in a Census-defined rural area" },
                { fieldName: "v059_denominator", label: "Population ages 5 years and older" },
                { fieldName: "v059_numerator", label: "Number of non-native English speakers who are not proficient speaking English" },
                { fieldName: "v059_rawvalue", label: "Percentage of non-native English speakers who are not proficient speaking English" },
                { fieldName: "v060_rawvalue", label: "Percentage of adults aged 18 and over with diagnosed diabetes" },
                { fieldName: "v061_denominator", label: "Population 13 years and older" },
                { fieldName: "v061_numerator", label: "Number of HIV cases in the county" },
                { fieldName: "v061_rawvalue", label: "Human immunodeficiency virus (HIV) prevalence rate per 100,000 population" },
                { fieldName: "v062_denominator", label: "County Population" },
                { fieldName: "v062_numerator", label: "Number of mental health providers (MHP)" },
                { fieldName: "v062_rawvalue", label: "Mental Health Providers per 100,000" },
                { fieldName: "v063_race_aian", label: "Median household income for American Indian & Alaska Native householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_asian", label: "Median household income for Asian householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_black", label: "Median household income for Black householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_hispanic", label: "Median household income for Hispanic householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_white", label: "Median household income for non-Hispanic white householder - from the 2016-2020 ACS" },
                { fieldName: "v063_rawvalue", label: "Median household income" },
                { fieldName: "v065_denominator", label: "Public school students, grades PK-12" },
                { fieldName: "v065_numerator", label: "Public school students, grades PK-12, eligible for free or reduced-price lunch" },
                { fieldName: "v065_rawvalue", label: "Percentage of children enrolled in public schools eligible for free or reduced price lunch" },
                { fieldName: "v067_denominator", label: "Total workforce" },
                { fieldName: "v067_numerator", label: "Workers commuting alone to work via car, truck, or van" },
                { fieldName: "v067_race_aian", label: "Percentage of American Indian and Alaska Native workers who drive alone to work" },
                { fieldName: "v067_race_asian", label: "Percentage of Asian/Pacific Islander workers who drive alone to work" },
                { fieldName: "v067_race_black", label: "Percentage of Black workers who drive alone to work" },
                { fieldName: "v067_race_hispanic", label: "Percentage of Hispanic workers who drive alone to work" },
                { fieldName: "v067_race_white", label: "Percentage of non-Hispanic white workers who drive alone to work" },
                { fieldName: "v067_rawvalue", label: "Percentage of workers who drive alone to work" },
                { fieldName: "v069_denominator", label: "Adults age 25-44" },
                { fieldName: "v069_numerator", label: "Adults age 25-44 with some post-secondary education" },
                { fieldName: "v069_rawvalue", label: "Percentage of adults age 25-44 with some post-secondary education" },
                { fieldName: "v070_rawvalue", label: "Percentage of adults that report no leisure-time physical activity" },
                { fieldName: "v080_denominator", label: "County Population" },
                { fieldName: "v080_numerator", label: "Number of people that are Native Hawaiian or Other Pacific Islander" },
                { fieldName: "v080_rawvalue", label: "Percentage of population that is Native Hawaiian or Other Pacific Islander" },
                { fieldName: "v081_denominator", label: "County Population" },
                { fieldName: "v081_numerator", label: "Number of people that are Asian" },
                { fieldName: "v081_rawvalue", label: "Percentage of population that is Asian" },
                { fieldName: "v082_denominator", label: "Number of children in households" },
                { fieldName: "v082_numerator", label: "Number of children that live in single-parent households" },
                { fieldName: "v082_rawvalue", label: "Percentage of children that live in single-parent households" },
                { fieldName: "v083_denominator", label: "2010 U.S. census population" },
                { fieldName: "v083_numerator", label: "Number of people with limited access to health foods" },
                { fieldName: "v083_rawvalue", label: "Percentage of people with limited access to health foods" },
                { fieldName: "v085_denominator", label: "Population under age 65" },
                { fieldName: "v085_numerator", label: "Number of people under age 65 without insurance" },
                { fieldName: "v085_rawvalue", label: "Percentage of people under age 65 without insurance" },
                { fieldName: "v088_denominator", label: "County Population" },
                { fieldName: "v088_numerator", label: "Number of dentists" },
                { fieldName: "v088_rawvalue", label: "Dentists per 100,000" },
                { fieldName: "v122_denominator", label: "Population under age 19" },
                { fieldName: "v122_numerator", label: "Number of children (under 19) without insurance" },
                { fieldName: "v122_rawvalue", label: "Percentage of children (under 19) without insurance" },
                { fieldName: "v124_rawvalue", label: "County affected by a water violation: 1-Yes, 0-No" },
                { fieldName: "v125_rawvalue", label: "Average daily amount of fine particulate matter in micrograms per cubic meter" },
                { fieldName: "v126_denominator", label: "County Population" },
                { fieldName: "v126_numerator", label: "Number of people that are Non-Hispanic White" },
                { fieldName: "v126_rawvalue", label: "Percentage of population that is Non-Hispanic White" },
                { fieldName: "v127_denominator", label: "Total population under age 75 over three-year period" },
                { fieldName: "v127_numerator", label: "Number of deaths under age 75" },
                { fieldName: "v127_race_aian", label: "Age-adjusted death rate per 100,000 for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v127_race_asian", label: "Age-adjusted death rate per 100,000 for non-Hispanic Asians" },
                { fieldName: "v127_race_black", label: "Age-adjusted death rate per 100,000 for non-Hispanic Blacks" },
                { fieldName: "v127_race_hispanic", label: "Age-adjusted death rate per 100,000 for Hispanics" },
                { fieldName: "v127_race_nhopi", label: "Age-adjusted YPLL rate per 100,000 for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v127_race_white", label: "Age-adjusted death rate per 100,000 for non-Hispanic whites" },
                { fieldName: "v127_rawvalue", label: "Age-adjusted death rate per 100,000" },
                { fieldName: "v128_denominator", label: "Total population under age 20 over four-year period" },
                { fieldName: "v128_numerator", label: "Number of deaths under age 20" },
                { fieldName: "v128_race_aian", label: "Deaths under age 20 per 100,000 population for non-Hispanic American Indian/Alaska Native" },
                { fieldName: "v128_race_asian", label: "Deaths under age 20 per 100,000 population for non-Hispanic Asian" },
                { fieldName: "v128_race_black", label: "Deaths under age 20 per 100,000 population for non-Hispanic Blacks" },
                { fieldName: "v128_race_hispanic", label: "Deaths under age 20 per 100,000 population for Hispanics" },
                { fieldName: "v128_race_nhopi", label: "Deaths under age 20 per 100,000 population for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v128_race_white", label: "Deaths under age 20 per 100,000 population for non-Hispanic whites" },
                { fieldName: "v128_rawvalue", label: "Deaths under age 20 per 100,000 population" },
                { fieldName: "v129_denominator", label: "Total live births during seven-year period" },
                { fieldName: "v129_numerator", label: "Number of infant deaths" },
                { fieldName: "v129_race_aian", label: "Infant death rate per 1,000 live births for non-Hispanic American Indian/Alaska Native" },
                { fieldName: "v129_race_asian", label: "Infant death rate per 1,000 live births for non-Hispanic Asian" },
                { fieldName: "v129_race_black", label: "Infant death rate per 1,000 live births for non-Hispanic Blacks" },
                { fieldName: "v129_race_hispanic", label: "Infant death rate per 1,000 live births for Hispanics" },
                { fieldName: "v129_race_nhopi", label: "Infant death rate per 1,000 live births for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v129_race_tom", label: "Infant death rate per 1,000 live births for non-Hispanic two or more races" },
                { fieldName: "v129_race_white", label: "Infant death rate per 1,000 live births for non-Hispanic whites" },
                { fieldName: "v129_rawvalue", label: "Infant death rate per 1,000 live births" },
              ]
            }
          ]
        }
      }),
      new FeatureLayer({
        title: "County Health Data",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/CountyHealthRankings2020_WFL1/FeatureServer/2",
        visible: false,
        popupTemplate: {
          title: "County Health Data",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "v001_race_aian", label: "Age-adjusted YPLL rate (American Indian/Alaska Natives)" },
                { fieldName: "v001_race_aian_flag", label: "Premature Death Flag (American Indian/Alaska Natives)" },
                { fieldName: "v001_race_asian", label: "Age-adjusted YPLL rate (Asians)" },
                { fieldName: "v001_race_asian_flag", label: "Premature Death Flag (Asians)" },
                { fieldName: "v001_race_black", label: "Age-adjusted YPLL rate (Blacks)" },
                { fieldName: "v001_race_black_flag", label: "Premature Death Flag (Blacks)" },
                { fieldName: "v001_race_hispanic", label: "Age-adjusted YPLL rate (Hispanics)" },
                { fieldName: "v001_race_hispanic_flag", label: "Premature Death Flag (Hispanics)" },
                { fieldName: "v001_race_nhopi", label: "Age-adjusted YPLL rate (Native Hawaiian/Other Pacific Islander)" },
                { fieldName: "v001_race_nhopi_flag", label: "Premature Death Flag (Native Hawaiian/Other Pacific Islander)" },
                { fieldName: "v001_race_white", label: "Age-adjusted YPLL rate (Whites)" },
                { fieldName: "v001_race_white_flag", label: "Premature Death Flag (Whites)" },
                { fieldName: "v001_rawvalue", label: "Age-adjusted YPLL rate (Total)" },
                { fieldName: "v002_rawvalue", label: "Percentage of Adults Reporting Fair or Poor Health" },
                { fieldName: "v003_denominator", label: "Population Ages 18 to 64" },
                { fieldName: "v003_numerator", label: "Number of adults 18-64 without insurance" },
                { fieldName: "v003_rawvalue", label: "Percentage of adults 18-64 without insurance" },
                { fieldName: "v004_denominator", label: "County Population" },
                { fieldName: "v004_numerator", label: "Number of primary care physicians (PCP) in patient care" },
                { fieldName: "v004_rawvalue", label: "Primary Care Physicians per 100,000" },
                { fieldName: "v005_race_aian", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (American Indian/Alaska Natives)" },
                { fieldName: "v005_race_asian", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Asian/Pacific Islanders)" },
                { fieldName: "v005_race_black", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Blacks)" },
                { fieldName: "v005_race_hispanic", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (Hispanics)" },
                { fieldName: "v005_race_white", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees (non-Hispanic whites)" },
                { fieldName: "v005_rawvalue", label: "Discharges for Ambulatory Care Sensitive Conditions per 100,000 Medicare Enrollees" },
                { fieldName: "v009_rawvalue", label: "Percentage of adults that reported currently smoking" },
                { fieldName: "v011_rawvalue", label: "Percentage of adults that report BMI >= 30" },
                { fieldName: "v014_denominator", label: "Total female population, ages 15 to 19 over seven-year period" },
                { fieldName: "v014_numerator", label: "Total number of births to mothers ages 15 to 19 during seven-year period" },
                { fieldName: "v014_race_aian", label: "Births per 1,000 females ages 15-19 (non-Hispanic American Indian/Alaska Native mothers)" },
                { fieldName: "v014_race_asian", label: "Births per 1,000 females ages 15-19 (non-Hispanic Asian mothers)" },
                { fieldName: "v014_race_black", label: "Births per 1,000 females ages 15-19 (non-Hispanic Black mothers)" },
                { fieldName: "v014_race_hispanic", label: "Births per 1,000 females ages 15-19 (Hispanic mothers)" },
                { fieldName: "v014_race_nhopi", label: "Births per 1,000 females ages 15-19 (non-Hispanic Native Hawaiian and Other Pacific Islander mothers)" },
                { fieldName: "v014_race_tom", label: "Births per 1,000 females ages 15-19 (non-Hispanic two or more races mothers)" },
                { fieldName: "v014_race_white", label: "Births per 1,000 females ages 15-19 (non-Hispanic white mothers)" },
                { fieldName: "v014_rawvalue", label: "Births per 1,000 females ages 15-19" },
                { fieldName: "v015_denominator", label: "Total population over seven-year period" },
                { fieldName: "v015_numerator", label: "Deaths due to homicide (ICD-10 codes X85-Y09) during seven-year period" },
                { fieldName: "v015_race_aian", label: "Crude homicide rate per 100,000 for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v015_race_asian", label: "Crude homicide rate per 100,000 for non-Hispanic Asians" },
                { fieldName: "v015_race_black", label: "Crude homicide rate per 100,000 for non-Hispanic Blacks" },
                { fieldName: "v015_race_hispanic", label: "Crude homicide rate per 100,000 for Hispanics" },
                { fieldName: "v015_race_nhopi", label: "Crude homicide rate per 100,000 for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v015_race_white", label: "Crude homicide rate per 100,000 for non-Hispanic whites" },
                { fieldName: "v015_rawvalue", label: "Crude homicide rate per 100,000" },
                { fieldName: "v021_denominator", label: "Number of students expected to graduate" },
                { fieldName: "v021_numerator", label: "Cohort members earning a regular high school diploma by the end of the school year" },
                { fieldName: "v021_rawvalue", label: "Graduation rate" },
                { fieldName: "v023_denominator", label: "Size of the labor force" },
                { fieldName: "v023_numerator", label: "Number of people ages 16+ unemployed and looking for work" },
                { fieldName: "v023_rawvalue", label: "Percentage of population ages 16+ unemployed and looking for work" },
                { fieldName: "v024_numerator", label: "Population under age 18 with household income below the poverty level" },
                { fieldName: "v024_race_aian", label: "Percentage of American Indian and Alaska Native children (under age 18) living in poverty" },
                { fieldName: "v024_race_asian", label: "Percentage of Asian/Pacific Islander children (under age 18) living in poverty" },
                { fieldName: "v024_race_black", label: "Percentage of Black children (under age 18) living in poverty" },
                { fieldName: "v024_race_hispanic", label: "Percentage of Hispanic children (under age 18) living in poverty" },
                { fieldName: "v024_race_white", label: "Percentage of non-Hispanic white children (under age 18) living in poverty" },
                { fieldName: "v024_rawvalue", label: "Percentage of children (under age 18) living in poverty" },
                { fieldName: "v036_rawvalue", label: "Average number of reported physically unhealthy days per month" },
                { fieldName: "v037_denominator", label: "Total number of live births during seven-year period" },
                { fieldName: "v037_flag", label: "Low Birthweight flag (0 = No Flag, 1=Unreliable, 2=Suppressed)" },
                { fieldName: "v037_numerator", label: "Total number of live births for which the infant weighed less than 2,500 grams (approximately 5 lbs., 8 oz.) during seven-year period" },
                { fieldName: "v037_race_aian", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v037_race_asian", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Asians" },
                { fieldName: "v037_race_black", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Blacks" },
                { fieldName: "v037_race_hispanic", label: "Percentage of births with low birthweight (<2500g) for Hispanics" },
                { fieldName: "v037_race_nhopi", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v037_race_tom", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic two or more races" },
                { fieldName: "v037_race_white", label: "Percentage of births with low birthweight (<2500g) for non-Hispanic whites" },
                { fieldName: "v037_rawvalue", label: "Percentage of births with low birthweight (<2500g)" },
                { fieldName: "v039_denominator", label: "Total population over seven-year period" },
                { fieldName: "v039_numerator", label: "Number of motor vehicle-related deaths" },
                { fieldName: "v039_race_aian", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v039_race_asian", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Asians" },
                { fieldName: "v039_race_black", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Blacks" },
                { fieldName: "v039_race_hispanic", label: "Crude motor-vehicle related mortality rate per 100,000 population for Hispanics" },
                { fieldName: "v039_race_nhopi", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v039_race_white", label: "Crude motor-vehicle related mortality rate per 100,000 population for non-Hispanic whites" },
                { fieldName: "v039_rawvalue", label: "Crude motor-vehicle related mortality rate per 100,000 population" },
                { fieldName: "v042_rawvalue", label: "Average number of reported mentally unhealthy days per month" },
                { fieldName: "v044_denominator", label: "20th percentile of median household income" },
                { fieldName: "v044_numerator", label: "80th percentile of median household income" },
                { fieldName: "v044_rawvalue", label: "Ratio of household income at the 80th percentile to income at the 20th percentile" },
                { fieldName: "v045_denominator", label: "County Population" },
                { fieldName: "v045_numerator", label: "Number of chlamydia cases" },
                { fieldName: "v045_rawvalue", label: "Chlamydia cases per 100,000 population" },
                { fieldName: "v049_rawvalue", label: "Percentage of adults that report excessive drinking" },
                { fieldName: "v050_race_aian", label: "Percentage of American Indian/Alaska Native female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_asian", label: "Percentage of Asian/Pacific Islander female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_black", label: "Percentage of Black female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_hispanic", label: "Percentage of Hispanic female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_race_white", label: "Percentage of non-Hispanic white female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v050_rawvalue", label: "Percentage of female Medicare enrollees having an annual mammogram (age 65-74)" },
                { fieldName: "v051_rawvalue", label: "Population estimate" },
                { fieldName: "v052_denominator", label: "County Population" },
                { fieldName: "v052_numerator", label: "Population under age 18" },
                { fieldName: "v052_rawvalue", label: "Percentage of population less than 18 years of age" },
                { fieldName: "v053_denominator", label: "County Population" },
                { fieldName: "v053_numerator", label: "Population ages 65 years and older" },
                { fieldName: "v053_rawvalue", label: "Percentage of population ages 65 years and older" },
                { fieldName: "v054_denominator", label: "County Population" },
                { fieldName: "v054_numerator", label: "Number of people that are non-Hispanic Black or African American" },
                { fieldName: "v054_rawvalue", label: "Percentage of population that is non-Hispanic Black or African American" },
                { fieldName: "v055_denominator", label: "County Population" },
                { fieldName: "v055_numerator", label: "Number of people that are American Indian or Alaska Native" },
                { fieldName: "v055_rawvalue", label: "Percentage of population that is American Indian or Alaska Native" },
                { fieldName: "v056_denominator", label: "County Population" },
                { fieldName: "v056_numerator", label: "Number of people that are Hispanic" },
                { fieldName: "v056_rawvalue", label: "Percentage of population that is Hispanic" },
                { fieldName: "v057_denominator", label: "County Population" },
                { fieldName: "v057_numerator", label: "Female population" },
                { fieldName: "v057_rawvalue", label: "Percentage of population that is female" },
                { fieldName: "v058_denominator", label: "County Population" },
                { fieldName: "v058_numerator", label: "Number of people that live in a Census-defined rural area" },
                { fieldName: "v058_rawvalue", label: "Percentage of population that lives in a Census-defined rural area" },
                { fieldName: "v059_denominator", label: "Population ages 5 years and older" },
                { fieldName: "v059_numerator", label: "Number of non-native English speakers who are not proficient speaking English" },
                { fieldName: "v059_rawvalue", label: "Percentage of non-native English speakers who are not proficient speaking English" },
                { fieldName: "v060_rawvalue", label: "Percentage of adults aged 18 and over with diagnosed diabetes" },
                { fieldName: "v061_denominator", label: "Population 13 years and older" },
                { fieldName: "v061_numerator", label: "Number of HIV cases in the county" },
                { fieldName: "v061_rawvalue", label: "Human immunodeficiency virus (HIV) prevalence rate per 100,000 population" },
                { fieldName: "v062_denominator", label: "County Population" },
                { fieldName: "v062_numerator", label: "Number of mental health providers (MHP)" },
                { fieldName: "v062_rawvalue", label: "Mental Health Providers per 100,000" },
                { fieldName: "v063_race_aian", label: "Median household income for American Indian & Alaska Native householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_asian", label: "Median household income for Asian householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_black", label: "Median household income for Black householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_hispanic", label: "Median household income for Hispanic householder - from the 2016-2020 ACS" },
                { fieldName: "v063_race_white", label: "Median household income for non-Hispanic white householder - from the 2016-2020 ACS" },
                { fieldName: "v063_rawvalue", label: "Median household income" },
                { fieldName: "v065_denominator", label: "Public school students, grades PK-12" },
                { fieldName: "v065_numerator", label: "Public school students, grades PK-12, eligible for free or reduced-price lunch" },
                { fieldName: "v065_rawvalue", label: "Percentage of children enrolled in public schools eligible for free or reduced price lunch" },
                { fieldName: "v067_denominator", label: "Total workforce" },
                { fieldName: "v067_numerator", label: "Workers commuting alone to work via car, truck, or van" },
                { fieldName: "v067_race_aian", label: "Percentage of American Indian and Alaska Native workers who drive alone to work" },
                { fieldName: "v067_race_asian", label: "Percentage of Asian/Pacific Islander workers who drive alone to work" },
                { fieldName: "v067_race_black", label: "Percentage of Black workers who drive alone to work" },
                { fieldName: "v067_race_hispanic", label: "Percentage of Hispanic workers who drive alone to work" },
                { fieldName: "v067_race_white", label: "Percentage of non-Hispanic white workers who drive alone to work" },
                { fieldName: "v067_rawvalue", label: "Percentage of workers who drive alone to work" },
                { fieldName: "v069_denominator", label: "Adults age 25-44" },
                { fieldName: "v069_numerator", label: "Adults age 25-44 with some post-secondary education" },
                { fieldName: "v069_rawvalue", label: "Percentage of adults age 25-44 with some post-secondary education" },
                { fieldName: "v070_rawvalue", label: "Percentage of adults that report no leisure-time physical activity" },
                { fieldName: "v080_denominator", label: "County Population" },
                { fieldName: "v080_numerator", label: "Number of people that are Native Hawaiian or Other Pacific Islander" },
                { fieldName: "v080_rawvalue", label: "Percentage of population that is Native Hawaiian or Other Pacific Islander" },
                { fieldName: "v081_denominator", label: "County Population" },
                { fieldName: "v081_numerator", label: "Number of people that are Asian" },
                { fieldName: "v081_rawvalue", label: "Percentage of population that is Asian" },
                { fieldName: "v082_denominator", label: "Number of children in households" },
                { fieldName: "v082_numerator", label: "Number of children that live in single-parent households" },
                { fieldName: "v082_rawvalue", label: "Percentage of children that live in single-parent households" },
                { fieldName: "v083_denominator", label: "2010 U.S. census population" },
                { fieldName: "v083_numerator", label: "Number of people with limited access to health foods" },
                { fieldName: "v083_rawvalue", label: "Percentage of people with limited access to health foods" },
                { fieldName: "v085_denominator", label: "Population under age 65" },
                { fieldName: "v085_numerator", label: "Number of people under age 65 without insurance" },
                { fieldName: "v085_rawvalue", label: "Percentage of people under age 65 without insurance" },
                { fieldName: "v088_denominator", label: "County Population" },
                { fieldName: "v088_numerator", label: "Number of dentists" },
                { fieldName: "v088_rawvalue", label: "Dentists per 100,000" },
                { fieldName: "v122_denominator", label: "Population under age 19" },
                { fieldName: "v122_numerator", label: "Number of children (under 19) without insurance" },
                { fieldName: "v122_rawvalue", label: "Percentage of children (under 19) without insurance" },
                { fieldName: "v124_rawvalue", label: "County affected by a water violation: 1-Yes, 0-No" },
                { fieldName: "v125_rawvalue", label: "Average daily amount of fine particulate matter in micrograms per cubic meter" },
                { fieldName: "v126_denominator", label: "County Population" },
                { fieldName: "v126_numerator", label: "Number of people that are Non-Hispanic White" },
                { fieldName: "v126_rawvalue", label: "Percentage of population that is Non-Hispanic White" },
                { fieldName: "v127_denominator", label: "Total population under age 75 over three-year period" },
                { fieldName: "v127_numerator", label: "Number of deaths under age 75" },
                { fieldName: "v127_race_aian", label: "Age-adjusted death rate per 100,000 for non-Hispanic American Indian and Alaska Natives" },
                { fieldName: "v127_race_asian", label: "Age-adjusted death rate per 100,000 for non-Hispanic Asians" },
                { fieldName: "v127_race_black", label: "Age-adjusted death rate per 100,000 for non-Hispanic Blacks" },
                { fieldName: "v127_race_hispanic", label: "Age-adjusted death rate per 100,000 for Hispanics" },
                { fieldName: "v127_race_nhopi", label: "Age-adjusted YPLL rate per 100,000 for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v127_race_white", label: "Age-adjusted death rate per 100,000 for non-Hispanic whites" },
                { fieldName: "v127_rawvalue", label: "Age-adjusted death rate per 100,000" },
                { fieldName: "v128_denominator", label: "Total population under age 20 over four-year period" },
                { fieldName: "v128_numerator", label: "Number of deaths under age 20" },
                { fieldName: "v128_race_aian", label: "Deaths under age 20 per 100,000 population for non-Hispanic American Indian/Alaska Native" },
                { fieldName: "v128_race_asian", label: "Deaths under age 20 per 100,000 population for non-Hispanic Asian" },
                { fieldName: "v128_race_black", label: "Deaths under age 20 per 100,000 population for non-Hispanic Blacks" },
                { fieldName: "v128_race_hispanic", label: "Deaths under age 20 per 100,000 population for Hispanics" },
                { fieldName: "v128_race_nhopi", label: "Deaths under age 20 per 100,000 population for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v128_race_white", label: "Deaths under age 20 per 100,000 population for non-Hispanic whites" },
                { fieldName: "v128_rawvalue", label: "Deaths under age 20 per 100,000 population" },
                { fieldName: "v129_denominator", label: "Total live births during seven-year period" },
                { fieldName: "v129_numerator", label: "Number of infant deaths" },
                { fieldName: "v129_race_aian", label: "Infant death rate per 1,000 live births for non-Hispanic American Indian/Alaska Native" },
                { fieldName: "v129_race_asian", label: "Infant death rate per 1,000 live births for non-Hispanic Asian" },
                { fieldName: "v129_race_black", label: "Infant death rate per 1,000 live births for non-Hispanic Blacks" },
                { fieldName: "v129_race_hispanic", label: "Infant death rate per 1,000 live births for Hispanics" },
                { fieldName: "v129_race_nhopi", label: "Infant death rate per 1,000 live births for non-Hispanic Native Hawaiian and Other Pacific Islander" },
                { fieldName: "v129_race_tom", label: "Infant death rate per 1,000 live births for non-Hispanic two or more races" },
                { fieldName: "v129_race_white", label: "Infant death rate per 1,000 live births for non-Hispanic whites" },
                { fieldName: "v129_rawvalue", label: "Infant death rate per 1,000 live births" },




              ]
            }
          ]
        }
      })
    ]
  }),
  
  new GroupLayer({
    title: "LGBTQ Legislation Layers",
    layers: [
      new FeatureLayer({
        title: "Rollover Pro-LGBTQ+ Bills 2024",
        url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/0",
        visible: false,
        renderer: {
          type: "unique-value",
          field: "Youth_State_Risk",
          legendOptions: {
            title: "Youth Risk Levels"
          },
          uniqueValueInfos: [
            {
              value: "Safest",
              label: "Safest",
              symbol: {
                type: "simple-fill",
                color: "#ffafc9",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Low",
              label: "Low Risk",
              symbol: {
                type: "simple-fill",
                color: "#55cdfc",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Moderate",
              label: "Moderate Risk",
              symbol: {
                type: "simple-fill",
                color: "#ffffff",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "High",
              label: "High Risk",
              symbol: {
                type: "simple-fill",
                color: "#ff6347",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Worst",
              label: "Worst Risk",
              symbol: {
                type: "simple-fill",
                color: "#e91b25",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Do Not Travel",
              label: "Do Not Travel",
              symbol: {
                type: "simple-fill",
                color: "#555555",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            }
          ]
        },
        labelingInfo: [
          {
            symbol: {
              type: "text",
              color: "#000000",
              haloSize: 1.5,
              haloColor: "#ffffff",
              font: {
                size: 10,
                family: "Arial",
                weight: "bold"
              }
            },
            labelPlacement: "always-horizontal",
            labelExpressionInfo: {
              expression: `
                Concatenate([
                  "Bill ID: ", $feature.Bill_ID, "\n",
                  "Targets Adults: ", $feature.Targets_Adults, "\n",
                  "Targets Minors: ", $feature.Targets_Minors
                ])
              `
            }
          }
        ],
        popupTemplate: {
          title: "Rollover Pro-LGBTQ+ Bill Details",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "Bill_ID", label: "Bill ID" },
                { fieldName: "Targets_Adults", label: "Targets Adults" },
                { fieldName: "Targets_Minors", label: "Targets Minors" },
                { fieldName: "PDF", label: "PDF Link", format: { type: "url" } },
                { fieldName: "URL", label: "Web Link", format: { type: "url" } },
                { fieldName: "Adult_State_Risk", label: "Adult State Risk" },
                { fieldName: "Youth_State_Risk", label: "Youth State Risk" },
                { fieldName: "Summary", label: "Summary" },
                { fieldName: "Bill_Type", label: "Bill Type" },
                { fieldName: "Number", label: "Number" }
               ]
              }
             ]
            }
          }),

  

      new FeatureLayer({
        title: "Pro-LGBTQ+ Bills 2024",
        url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills_Collection/FeatureServer/0",
        visible: false,
        renderer: {
          type: "unique-value",
          field: "Youth_State_Risk",
          legendOptions: {
            title: "Youth Risk Levels"
          },
          uniqueValueInfos: [
            {
              value: "Safest",
              label: "Safest",
              symbol: {
                type: "simple-fill",
                color: "#ffafc9",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Low",
              label: "Low Risk",
              symbol: {
                type: "simple-fill",
                color: "#55cdfc",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Moderate",
              label: "Moderate Risk",
              symbol: {
                type: "simple-fill",
                color: "#ffffff",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "High",
              label: "High Risk",
              symbol: {
                type: "simple-fill",
                color: "#ff6347",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Worst",
              label: "Worst Risk",
              symbol: {
                type: "simple-fill",
                color: "#e91b25",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            },
            {
              value: "Do Not Travel",
              label: "Do Not Travel",
              symbol: {
                type: "simple-fill",
                color: "#555555",
                outline: {
                  width: 0.5,
                  color: "#000"
                }
              }
            }
          ]
        },
        labelingInfo: [
          {
            symbol: {
              type: "text",
              color: "#000000",
              haloSize: 1.5,
              haloColor: "#ffffff",
              font: {
                size: 10,
                family: "Arial",
                weight: "bold"
              }
            },
            labelPlacement: "always-horizontal",
            labelExpressionInfo: {
              expression: `
                Concatenate([
                  "Bill ID: ", $feature.Bill_ID, "\n",
                  "Targets Adults: ", $feature.Targets_Adults, "\n",
                  "Targets Minors: ", $feature.Targets_Minors
                ])
              `
            }
          }
        ],
        popupTemplate: {
          title: "Pro-LGBTQ+ Bill Details",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "Bill_ID", label: "Bill ID" },
                { fieldName: "Targets_Adults", label: "Targets Adults" },
                { fieldName: "Targets_Minors", label: "Targets Minors" },
                { fieldName: "PDF", label: "PDF Link", format: { type: "url" } },
                { fieldName: "URL", label: "Web Link", format: { type: "url" } },
                { fieldName: "Adult_State_Risk", label: "Adult State Risk" },
                { fieldName: "Youth_State_Risk", label: "Youth State Risk" },
                { fieldName: "Summary", label: "Summary" },
                { fieldName: "Bill_Type", label: "Bill Type" },
                { fieldName: "Number", label: "Number" }
               ]
              }
             ]
            }
          }),

    
          new FeatureLayer({
            title: "Rollover Anti-LGBTQ+ Bills 2024",
            url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/1",
            visible: false,
            renderer: {
              type: "unique-value", // Renderer type for unique values
              field: "Youth_State_Risk", // Field to symbolize
              legendOptions: {
                title: "Youth Risk Levels"
              },
              uniqueValueInfos: [
                {
                  value: "Safest",
                  label: "Safest",
                  symbol: {
                    type: "simple-fill",
                    color: "#ffafc9",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Low",
                  label: "Low Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#55cdfc",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Moderate",
                  label: "Moderate Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#ffffff",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "High",
                  label: "High Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#ff6347",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Worst",
                  label: "Worst Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#e91b25",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Do Not Travel",
                  label: "Do Not Travel",
                  symbol: {
                    type: "simple-fill",
                    color: "#555555",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                }
              ]
            },
            labelingInfo: [
              {
                symbol: {
                  type: "text",
                  color: "#000000",
                  haloSize: 1.5,
                  haloColor: "#ffffff",
                  font: {
                    size: 10,
                    family: "Arial",
                    weight: "bold"
                  }
                },
                labelPlacement: "always-horizontal",
                labelExpressionInfo: {
                  expression: `
                    Concatenate([
                      "Bill ID: ", $feature.Bill_ID, "\n",
                      "Targets Adults: ", $feature.Targets_Adults, "\n",
                      "Targets Minors: ", $feature.Targets_Minors
                    ])
                  `
                }
              }
            ],
            popupTemplate: {
              title: "Rollover Anti-LGBTQ+ Bill Details",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    { fieldName: "Bill_ID", label: "Bill ID" },
                    { fieldName: "Targets_Adults", label: "Targets Adults" },
                    { fieldName: "Targets_Minors", label: "Targets Minors" },
                    { fieldName: "PDF", label: "PDF Link", format: { type: "url" } },
                    { fieldName: "URL", label: "Web Link", format: { type: "url" } },
                    { fieldName: "Adult_State_Risk", label: "Adult State Risk" },
                    { fieldName: "Youth_State_Risk", label: "Youth State Risk" },
                    { fieldName: "Summary", label: "Summary" },
                    { fieldName: "Bill_Type", label: "Bill Type" },
                    { fieldName: "Number", label: "Number" }
                  ]
                }
              ]
            }
          }),

          new FeatureLayer({
            title: "Anti-LGBTQ+ Bills 2024",
            url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills_Collection/FeatureServer/1",
            visible: false,
            renderer: {
              type: "unique-value",
              field: "Youth_State_Risk",
              legendOptions: {
                title: "Youth Risk Levels"
              },
              uniqueValueInfos: [
                {
                  value: "Safest",
                  label: "Safest",
                  symbol: {
                    type: "simple-fill",
                    color: "#ffafc9",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Low",
                  label: "Low Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#55cdfc",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Moderate",
                  label: "Moderate Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#ffffff",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "High",
                  label: "High Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#ff6347",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Worst",
                  label: "Worst Risk",
                  symbol: {
                    type: "simple-fill",
                    color: "#e91b25",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                },
                {
                  value: "Do Not Travel",
                  label: "Do Not Travel",
                  symbol: {
                    type: "simple-fill",
                    color: "#555555",
                    outline: {
                      width: 0.5,
                      color: "#000"
                    }
                  }
                }
              ]
            },
            labelingInfo: [
              {
                symbol: {
                  type: "text",
                  color: "#000000",
                  haloSize: 1.5,
                  haloColor: "#ffffff",
                  font: {
                    size: 10,
                    family: "Arial",
                    weight: "bold"
                  }
                },
                labelPlacement: "always-horizontal",
                labelExpressionInfo: {
                  expression: `
                    Concatenate([
                      "Bill ID: ", $feature.Bill_ID, "\n",
                      "Targets Adults: ", $feature.Targets_Adults, "\n",
                      "Targets Minors: ", $feature.Targets_Minors
                    ])
                  `
                }
              }
            ],
            popupTemplate: {
              title: "Anti-LGBTQ+ Bill Details",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    { fieldName: "Bill_ID", label: "Bill ID" },
                    { fieldName: "Targets_Adults", label: "Targets Adults" },
                    { fieldName: "Targets_Minors", label: "Targets Minors" },
                    { fieldName: "PDF", label: "PDF Link", format: { type: "url" } },
                    { fieldName: "URL", label: "Web Link", format: { type: "url" } },
                    { fieldName: "Adult_State_Risk", label: "Adult State Risk" },
                    { fieldName: "Youth_State_Risk", label: "Youth State Risk" },
                    { fieldName: "Summary", label: "Summary" },
                    { fieldName: "Bill_Type", label: "Bill Type" },
                    { fieldName: "Number", label: "Number" }
                   ]
                  }
                 ]
                }
              }),
              new FeatureLayer({
                title: "Travel Risk Map based on Anti or Pro-Trans Legislation",
                url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/2",
                visible: true,
                renderer: {
                  type: "unique-value", // Renderer type for unique values
                  field: "Youth", // Field to base the symbology on
                  legendOptions: {
                    title: "Travel Risk Levels (Youth)"
                  },
                  uniqueValueInfos: [
                    {
                      value: "Safest",
                      label: "Safest",
                      symbol: {
                        type: "simple-fill",
                        color: "#ffafc9",
                        outline: {
                          width: 0.5,
                          color: "#000"
                        }
                      }
                    },
                    {
                      value: "Low",
                      label: "Low Risk",
                      symbol: {
                        type: "simple-fill",
                        color: "#55cdfc",
                        outline: {
                          width: 0.5,
                          color: "#000"
                        }
                      }
                    },
                    {
                      value: "Moderate",
                      label: "Moderate Risk",
                      symbol: {
                        type: "simple-fill",
                        color: "#ffffff",
                        outline: {
                          width: 0.5,
                          color: "#000"
                        }
                      }
                    },
                    {
                      value: "High",
                      label: "High Risk",
                      symbol: {
                        type: "simple-fill",
                        color: "#ff6347",
                        outline: {
                          width: 0.5,
                          color: "#000"
                        }
                      }
                    },
                    {
                      value: "Worst",
                      label: "Worst Risk",
                      symbol: {
                        type: "simple-fill",
                        color: "#e91b25",
                        outline: {
                          width: 0.5,
                          color: "#000"
                        }
                      }
                    },
                    {
                      value: "Do Not Travel",
                      label: "Do Not Travel",
                      symbol: {
                        type: "simple-fill",
                        color: "#555555",
                        outline: {
                          width: 0.5,
                          color: "#000"
                        }
                      }
                    }
                  ]
                },
                labelingInfo: [
                  {
                    symbol: {
                      type: "text", // Label type
                      color: "#000000", // Black text color
                      haloSize: 1.5,
                      haloColor: "#ffffff", // White halo for better visibility
                      font: {
                        size: 12, // Font size
                        family: "Arial",
                        weight: "bold"
                      }
                    },
                    labelPlacement: "always-horizontal", // Labels stay horizontal
                    labelExpressionInfo: {
                      expression: "$feature.Youth" // Label field
                    }
                  }
                ],
                popupTemplate: {
                  title: "Travel Risk for {State}", // Use the "State" field in the title
                  content: [
                    {
                      type: "fields",
                      fieldInfos: [
                        { fieldName: "State", label: "State Name" },
                        { fieldName: "Adult", label: "Adult Risk" },
                        { fieldName: "Youth", label: "Youth Risk" }
                      ]
                    }
                  ]
                }
              }),
      
              new FeatureLayer({
                title: "Top 15 Metros - LGBTQIA+ Adult Populations Plus Gender Identity and Sexual Orientation Data",
                url: "https://services1.arcgis.com/4yjifSiIG17X0gW4/ArcGIS/rest/services/Gender_Identity_and_Sexual_Orientation/FeatureServer/2",
                visible: false,
                popupTemplate: {
                  title: "Top LGBTQIA+ Metros: {Name}", // Using "Name" as the title field
                  content: [
                    {
                      type: "fields",
                      fieldInfos: [
                        { fieldName: "Name", label: "Core Based Statistical Area Title" },
                        { fieldName: "Total", label: "Total Population (18+)" },
                        { fieldName: "SexAsgndAtBirth_M", label: "Assigned Male at Birth" },
                        { fieldName: "SexAsgndAtBirth_F", label: "Assigned Female at Birth" },
                        { fieldName: "Gender_CisM", label: "Cisgender Men" },
                        { fieldName: "Gender_CisF", label: "Cisgender Women" },
                        { fieldName: "Gender_Trans", label: "Transgender Adults" },
                        { fieldName: "Gender_NOT", label: "Gender Not Listed" },
                        { fieldName: "Gender_DNR", label: "Gender Not Reported" },
                        { fieldName: "SexOr_G_or_L", label: "Gay or Lesbian Adults" },
                        { fieldName: "SexOr_St", label: "Straight Adults" },
                        { fieldName: "SexOr_Bi", label: "Bisexual Adults" },
                        { fieldName: "SexOr_SE", label: "Sexual Orientation Not Listed" },
                        { fieldName: "SexOr_IDK", label: "Don't Know Sexual Orientation" },
                        { fieldName: "SexOr_DNR", label: "Sexual Orientation Not Reported" },
                        { fieldName: "LGBTQ_Y", label: "LGBTQ Adults" },
                        { fieldName: "LGBTQ_N", label: "Non-LGBTQ Adults" },
                        { fieldName: "LGBTQ_O", label: "Gender/Sexual Orientation Not Listed" },
                        { fieldName: "LGBTQ_DNR", label: "Gender/Sexual Orientation Not Reported" },
                        { fieldName: "Pct_Gender_Cis", label: "Percent Cisgender" },
                        { fieldName: "Pct_Gender_Trans", label: "Percent Transgender" },
                        { fieldName: "Pct_Gender_NOT", label: "Percent Gender Not Listed" },
                        { fieldName: "Pct_Gender_DNR", label: "Percent Gender Not Reported" },
                        { fieldName: "Pct_SexOr_G_or_L", label: "Percent Gay/Lesbian" },
                        { fieldName: "Pct_SexOr_St", label: "Percent Straight" },
                        { fieldName: "Pct_SexOr_Bi", label: "Percent Bisexual" },
                        { fieldName: "Pct_SexOr_SE", label: "Percent Sexual Orientation Not Listed" },
                        { fieldName: "Pct_SexOr_IDK", label: "Percent Don't Know Sexual Orientation" },
                        { fieldName: "Pct_SexOr_DNR", label: "Percent Sexual Orientation Not Reported" },
                        { fieldName: "Pct_LGBTQ_Y", label: "Percent LGBTQ" },
                        { fieldName: "Pct_LGBTQ_N", label: "Percent Non-LGBTQ" },
                        { fieldName: "Pct_LGBTQ_O", label: "Percent Gender/Sexual Orientation Not Listed" },
                        { fieldName: "Pct_LGBTQ_DNR", label: "Percent Gender/Sexual Orientation Not Reported" },
                        { fieldName: "Count_LGBTQAI", label: "LGBTQIA+ Adults" },
                        { fieldName: "Pct_LGBTQAI", label: "Percent LGBTQIA+" }
        ]
      }
     ]
    }
  }),
  new FeatureLayer({
    title: "LGBTQIA+ Adult Populations Plus Gender Identity and Sexual Orientation Data",
    url: "https://services1.arcgis.com/4yjifSiIG17X0gW4/ArcGIS/rest/services/Gender_Identity_and_Sexual_Orientation/FeatureServer/1",
    visible: false,
    popupTemplate: {
      title: "LGBTQIA+ Population Data",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "Total", label: "Total Population (18+)" },
            { fieldName: "SexAsgndAtBirth_M", label: "Assigned Male at Birth" },
            { fieldName: "SexAsgndAtBirth_F", label: "Assigned Female at Birth" },
            { fieldName: "Gender_CisM", label: "Cisgender Men" },
            { fieldName: "Gender_CisF", label: "Cisgender Women" },
            { fieldName: "Gender_Trans", label: "Transgender Adults" },
            { fieldName: "Gender_NOT", label: "Gender Not Listed" },
            { fieldName: "Gender_DNR", label: "Gender Not Reported" },
            { fieldName: "SexOr_G_or_L", label: "Gay or Lesbian Adults" },
            { fieldName: "SexOr_St", label: "Straight Adults" },
            { fieldName: "SexOr_Bi", label: "Bisexual Adults" },
            { fieldName: "SexOr_SE", label: "Sexual Orientation Not Listed" },
            { fieldName: "SexOr_IDK", label: "Don't Know Sexual Orientation" },
            { fieldName: "SexOr_DNR", label: "Sexual Orientation Not Reported" },
            { fieldName: "LGBTQ_Y", label: "LGBTQ Adults" },
            { fieldName: "LGBTQ_N", label: "Non-LGBTQ Adults" },
            { fieldName: "LGBTQ_O", label: "Gender/Sexual Orientation Not Listed" },
            { fieldName: "LGBTQ_DNR", label: "Gender/Sexual Orientation Not Reported" },
            { fieldName: "Pct_Gender_Cis", label: "Percent Cisgender" },
            { fieldName: "Pct_Gender_Trans", label: "Percent Transgender" },
            { fieldName: "Pct_Gender_NOT", label: "Percent Gender Not Listed" },
            { fieldName: "Pct_Gender_DNR", label: "Percent Gender Not Reported" },
            { fieldName: "Pct_SexOr_G_or_L", label: "Percent Gay/Lesbian" },
            { fieldName: "Pct_SexOr_St", label: "Percent Straight" },
            { fieldName: "Pct_SexOr_Bi", label: "Percent Bisexual" },
            { fieldName: "Pct_SexOr_SE", label: "Percent Sexual Orientation Not Listed" },
            { fieldName: "Pct_SexOr_IDK", label: "Percent Don't Know Sexual Orientation" },
            { fieldName: "Pct_SexOr_DNR", label: "Percent Sexual Orientation Not Reported" },
            { fieldName: "Pct_LGBTQ_Y", label: "Percent LGBTQ" },
            { fieldName: "Pct_LGBTQ_N", label: "Percent Non-LGBTQ" },
            { fieldName: "Pct_LGBTQ_O", label: "Percent Gender/Sexual Orientation Not Listed" },
            { fieldName: "Pct_LGBTQ_DNR", label: "Percent Gender/Sexual Orientation Not Reported" },
            { fieldName: "Count_LGBTQAI", label: "LGBTQIA+ Adults" },
            { fieldName: "Pct_LGBTQAI", label: "Percent LGBTQIA+" }
          ]
        }
      ]
    }
  })
]
})
];

// Add the grouped layers to the map
map.addMany(groupedLayers);











   

 


























/////////SYMBOLIZING////////////////////







































// // Define a default popup template to display all fields dynamically
// const defaultPopupTemplate = {
//   title: "{Name}", // Replace "Name" with the field you want to use as the title
//   content: [
//     {
//       type: "fields", // Automatically display all fields
//       fieldInfos: [] // Leave this empty to include all available fields
//     }
//   ]
// };

// // Add the layers with the dynamic popup template
// layers.forEach(layer => {
//   const featureLayer = new FeatureLayer({
//     url: layer.url,
//     title: layer.title,
//     visible: layer.visible,
//     popupTemplate: defaultPopupTemplate // Apply the dynamic popup template
//   });
//   map.add(featureLayer);
// });







// // Define the custom renderer for the Travel Risk Map layer
// const riskRenderer = {
//   type: "unique-value", // Renderer type for unique values
//   field: "Adult", // Field to base the symbology on
//   legendOptions: {
//     title: "Travel Risk Levels (Adult)"
//   },
//   uniqueValueInfos: [
//     {
//       value: "Safest", // Field value
//       label: "Safest", // Legend label
//       symbol: {
//         type: "simple-fill",
//         color: "#ffafc9", // Light Pink for Safest
//         outline: {
//           width: 0.5,
//           color: "#000"
//         }
//       }
//     },
//     {
//       value: "Low",
//       label: "Low Risk",
//       symbol: {
//         type: "simple-fill",
//         color: "#55cdfc", // Light Blue for Low Risk
//         outline: {
//           width: 0.5,
//           color: "#000"
//         }
//       }
//     },
//     {
//       value: "Moderate",
//       label: "Moderate Risk",
//       symbol: {
//         type: "simple-fill",
//         color: "#ffffff", // White for Moderate Risk
//         outline: {
//           width: 0.5,
//           color: "#000"
//         }
//       }
//     },
//     {
//       value: "High",
//       label: "High Risk",
//       symbol: {
//         type: "simple-fill",
//         color: "#ff6347", // Light Orange for High Risk (repeat for balance)
//         outline: {
//           width: 0.5,
//           color: "#000"
//         }
//       }
//     },
//     {
//       value: "Worst",
//       label: "Worst Risk",
//       symbol: {
//         type: "simple-fill",
//         color: "#e91b25", // Rep Red for Worst Risk (repeat for emphasis)
//         outline: {
//           width: 0.5,
//           color: "#000"
//         }
//       }
//     },
//     {
//       value: "Do Not Travel",
//       label: "Do Not Travel",
//       symbol: {
//         type: "simple-fill",
//         color: "#555555", // Gray for Do Not Travel (neutral but strong)
//         outline: {
//           width: 0.5,
//           color: "#000"
//         }
//       }
//     }
//   ]
// };

});