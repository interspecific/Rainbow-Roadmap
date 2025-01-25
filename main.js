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
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "USA Detailed Parks - USA Parks",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Detailed_Parks/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "{Name}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "U.S. Army Corps of Engineers Reservoirs",
        url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/USACE_Reservoirs/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "{Reservoir_Name}",
          content: [{ type: "fields", fieldInfos: [] }]
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
          title: "{WaterBody_Name}",
          content: [{ type: "fields", fieldInfos: [] }]
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
          title: "{FieldName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "Census 2020 DHC Household Data National",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "{FieldName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "Census 2020 DHC Household Data by State",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/1",
        visible: false,
        popupTemplate: {
          title: "{StateName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "Census 2020 DHC Household Data by County",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/2",
        visible: false,
        popupTemplate: {
          title: "{CountyName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "Census 2020 DHC Household Data by Census Tract",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Census_2020_DHC_Households/FeatureServer/3",
        visible: false,
        popupTemplate: {
          title: "{TractName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "U.S. Congressional Districts",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_119th_Congressional_Districts/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "{DistrictName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "American Indian Alaska Native Native Hawaiian Areas",
        url: "https://services3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/Climate_Mapping_Resilience_and_Adaptation_(CMRA)_Climate_and_Coastal_Inundation_Projections/FeatureServer/2",
        visible: false,
        popupTemplate: {
          title: "{AreaName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      })
    ]
  }),
  new GroupLayer({
    title: "Climate Change Layers",
    layers: [
      new FeatureLayer({
        title: "U.S. Census Tracts with Climate Data",
        url: "https://services3.arcgis.com/0Fs3HcaFfvzXvm7w/arcgis/rest/services/Climate_Mapping_Resilience_and_Adaptation_(CMRA)_Climate_and_Coastal_Inundation_Projections/FeatureServer/1",
        visible: false,
        popupTemplate: {
          title: "Census Tract: {TractName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "Climate Change Disadvantaged Tracts",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/usa_november_2022/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "Disadvantaged Tract: {TractName}",
          content: [{ type: "fields", fieldInfos: [] }]
        }
      }),
      new FeatureLayer({
        title: "Economic Damage Climate Change Projections",
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Climate_Impact_Lab_view/FeatureServer/0",
        visible: false,
        popupTemplate: {
          title: "Economic Damage Data",
          content: [{ type: "fields", fieldInfos: [] }]
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