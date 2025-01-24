require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "esri/widgets/Fullscreen"
], function (Map, MapView, FeatureLayer, LayerList, Search, Fullscreen) {
  


require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "esri/widgets/Fullscreen"
], function (Map, MapView, FeatureLayer, LayerList, Search, Fullscreen) {
  
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
      if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    });
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




  
// Add all the layers to the map
const layers = [
    {
      title: "Sea Level Rise Inundation 2090",
      url: "https://tiledimageservices3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/CMRA_SLR_Inundation_RCP85_Late_2090/ImageServer",
      visible: false
    },
    {
      title: "Sea Level Rise Inundation 2050",
      url: "https://tiledimageservices3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/CMRA_SLR_Inundation_RCP85_Mid_2050/ImageServer",
      visible: false
    },
    {
      title: "Sea Level Rise Inundation 2030",
      url: "https://tiledimageservices3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/CMRA_SLR_Inundation_RCP45_Early_2030/ImageServer",
      visible: false
    },
    {
      title: "Safe Spaces - User Uploads",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/Safe_Spaces_Layer/FeatureServer/0",
      visible: false
    },
    {
      title: "USA Forest Service Lands - USA Federal Lands",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Forest_Service_Lands/FeatureServer/0",
      visible: false
    },
    {
      title: "USA Detailed Parks - USA Parks",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Detailed_Parks/FeatureServer/0",
      visible: false
    },
    {
      title: "U.S. Army Corps of Engineers Reservoirs",
      url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/USACE_Reservoirs/FeatureServer/0",
      visible: false
    },
    {
      title: "River Flowlines",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/NHDPlusV21/FeatureServer/2",
      visible: false
    },
    {
      title: "USA Detailed Water Bodies",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Detailed_Water_Bodies/FeatureServer/0",
      visible: false
    },
    {
      title: "Current US Drought",
      url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_Drought_Intensity_v1/FeatureServer/3",
      visible: false
    },
    {
      title: "US Drought Intensity",
      url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_Drought_Intensity_v1/FeatureServer/2",
      visible: false
    },
    {
      title: "Wildfire Hazard Potential",
      url: "https://apps.fs.usda.gov/fsgisx01/rest/services/RDW_Wildfire/RMRS_WRC_WildfireHazardPotential/ImageServer",
      visible: false
    },
    {
      title: "USDA Census of Agriculture 2022",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USDA_Census_of_Agriculture_2022_All/FeatureServer/0",
      visible: false
    },
    {
      title: "Census 2020 DHC Household Data National",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/0",
      visible: false
    },
    {
      title: "Census 2020 DHC Household Data by State",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/1",
      visible: false
    },
    {
      title: "Census 2020 DHC Household Data by County",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/2",
      visible: false
    },
    {
      title: "Census 2020 DHC Household Data by Census Tract",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/3",
      visible: false
    },
    {
      title: "U.S. Census Tracts with Climate Data",
      url: "https://services3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/Climate_Mapping_Resilience_and_Adaptation_(CMRA)_Climate_and_Coastal_Inundation_Projections/FeatureServer/1",
      visible: false
    },
    {
      title: "North American Population Density 2020",
      url: "https://tiles.arcgis.com/tiles/oF9CDB4lUYF7Um9q/arcgis/rest/services/NA_Population_Density_2020/MapServer",
      visible: false
    },
    {
      title: "U.S. Congressional Districts",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_119th_Congressional_Districts/FeatureServer/0",
      visible: false
    },
    {
      title: "American Indian Alaska Native Native Hawaiian Areas",
      url: "https://services3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/Climate_Mapping_Resilience_and_Adaptation_(CMRA)_Climate_and_Coastal_Inundation_Projections/FeatureServer/2",
      visible: false
    },
    {
      title: "Climate Change Disadvantaged Tracts",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/usa_november_2022/FeatureServer/0",
      visible: false
    },
    {
      title: "Economic Damage Climate Change Projections",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Climate_Impact_Lab_view/FeatureServer/0",
      visible: false
    },
    {
      title: "National Mental Health Access",
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/County_Health_Rankings_2024_Test_2/FeatureServer/0",
      visible: false
    },
    {
      title: "National Health Ranking 2020",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/CountyHealthRankings2020_WFL1/FeatureServer/0",
      visible: false
    },
    {
      title: "State Health Rankings 2020",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/CountyHealthRankings2020_WFL1/FeatureServer/1",
      visible: false
    },
    {
      title: "State Mental Health Access",
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/County_Health_Rankings_2024_Test_2/FeatureServer/1",
      visible: false
    },
    {
      title: "County Health Rankings 2020",
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/CountyHealthRankings2020_WFL1/FeatureServer/2",
      visible: false
    },
    {
      title: "County Mental Health Access",
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/County_Health_Rankings_2024_Test_2/FeatureServer/2",
      visible: false
    },
    {
      title: "Rollover Anti-LGBTQ+ Bills 2024",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/1",
      visible: false
    },
    {
      title: "Rollover Pro-LGBTQ+ Bills 2024",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/0",
      visible: false
    },
    {
      title: "Pro-LGBTQ+ Bills - Adult State Risk 2024",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/4",
      visible: false
    },
    {
      title: "Pro-LGBTQ+ Bills - Youth State Risk 2024",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/4",
      visible: false
    },
    {
      title: "Anti-LGBTQ+ Bills - Adult State Risk 2024",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/3",
      visible: false
    },
    {
      title: "Anti-LGBTQ+ Bills - Youth State Risk 2024",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/3",
      visible: false
    },
    {
      title: "Travel Risk Map based on Anti or Pro-Trans Legislation",
      url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/2",
      visible: false
    },
    {
      title: "Top 15 Metros - LGBTQIA+ Adult Populations Plus Gender Identity and Sexual Orientation Data",
      url: "https://services1.arcgis.com/4yjifSiIG17X0gW4/ArcGIS/rest/services/Gender_Identity_and_Sexual_Orientation/FeatureServer/2",
      visible: false
    },
    {
      title: "LGBTQIA+ Adult Populations Plus Gender Identity and Sexual Orientation Data",
      url: "https://services1.arcgis.com/4yjifSiIG17X0gW4/arcgis/rest/services/Gender_Identity_and_Sexual_Orientation/FeatureServer/1",
      visible: false
    }
  ];


  
   // Loop through the layers array and add each to the map
   layers.forEach(layer => {
    const featureLayer = new FeatureLayer({
      url: layer.url,
      title: layer.title,
      visible: layer.visible
    });
    map.add(featureLayer);
  });


   

 
// Define the custom renderer for the Travel Risk Map layer
const riskRenderer = {
  type: "unique-value", // Renderer type for unique values
  field: "Adult", // Field to base the symbology on
  legendOptions: {
    title: "Travel Risk Levels (Adult)"
  },
  uniqueValueInfos: [
    {
      value: "Safest", // Field value
      label: "Safest", // Legend label
      symbol: {
        type: "simple-fill",
        color: "#ffafc9", // Light Pink for Safest
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
        color: "#55cdfc", // Light Blue for Low Risk
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
        color: "#ffffff", // White for Moderate Risk
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
        color: "#ff6347", // Light Orange for High Risk (repeat for balance)
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
        color: "#e91b25", // Rep Red for Worst Risk (repeat for emphasis)
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
        color: "#555555", // Gray for Do Not Travel (neutral but strong)
        outline: {
          width: 0.5,
          color: "#000"
        }
      }
    }
  ]
};











// Define a default popup template to display all fields dynamically
const defaultPopupTemplate = {
  title: "{Name}", // Replace "Name" with the field you want to use as the title
  content: [
    {
      type: "fields", // Automatically display all fields
      fieldInfos: [] // Leave this empty to include all available fields
    }
  ]
};

// Add the layers with the dynamic popup template
layers.forEach(layer => {
  const featureLayer = new FeatureLayer({
    url: layer.url,
    title: layer.title,
    visible: layer.visible,
    popupTemplate: defaultPopupTemplate // Apply the dynamic popup template
  });
  map.add(featureLayer);
});


});});