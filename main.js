require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/widgets/Fullscreen"
  ], function(Map, MapView, FeatureLayer, LayerList, Search, Fullscreen) {
  
  
    const map = new Map({
      basemap: "streets" // Replace with the desired basemap name
    });

      
  
    const view = new MapView({
      container: "viewDiv", // Ensure this matches the HTML ID
      map: map,
      center: [-98.57, 39.82], // Center map on United States
      zoom: 4
  });
  




  // Create and attach the LayerList widget
  const layerListDiv = document.createElement("div");
  layerListDiv.id = "layerListDiv";
  layerListDiv.classList.add("hidden"); // Start hidden
  document.getElementById("viewDiv").appendChild(layerListDiv); // Append it to the map container

  const layerList = new LayerList({
    view: view,
    container: layerListDiv // Attach LayerList to the dynamically created div
  });

  

  // Add a Search widget
  const searchWidget = new Search({
    view: view
  });
  view.ui.add(searchWidget, "bottom-right");

  // Add Fullscreen widget
  const fullscreenWidget = new Fullscreen({
    view: view
  });
  view.ui.add(fullscreenWidget, "bottom-left");




// Add click event to toggle layer list visibility
document.getElementById("toggleLayerListButton").addEventListener("click", () => {
  const layerListDiv = document.getElementById("layerListDiv");
  if (layerListDiv.classList.contains("visible")) {
    layerListDiv.classList.remove("visible");
    layerListDiv.classList.add("hidden");
  } else {
    layerListDiv.classList.add("visible");
    layerListDiv.classList.remove("hidden");
  }
});

// Accordion functionality
document.querySelectorAll(".accordion-button").forEach((button) => {
  button.addEventListener("click", function () {
    // Toggle visibility of content
    const content = this.nextElementSibling;

    // Use a class-based approach for cleaner toggling
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      // Collapse all other accordion contents at the same level
      const parent = this.parentElement.parentElement;
      parent.querySelectorAll(".accordion-content").forEach((otherContent) => {
        if (otherContent !== content) {
          otherContent.style.maxHeight = null;
        }
      });

      // Expand the clicked accordion content
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
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
              color: "#1a9641", // Green for Safest
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
              color: "#92c5de", // Blue for Low Risk
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
              color: "#f7fcb9", // Yellow for Moderate Risk
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
              color: "#fdae61", // Orange for High Risk
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
              color: "#d7191c", // Red for Worst Risk
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
              color: "#4d004b", // Dark Purple for Do Not Travel
              outline: {
                width: 0.5,
                color: "#000"
              }
            }
          }
        ]
      };
      
// Add the renderer to the Travel Risk Map layer
const travelRiskLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/LGBTQ_Bills/FeatureServer/2",
    title: "Travel Risk Map based on Anti or Pro-Trans Legislation",
    visible: true, // Set to true if you want it visible by default
    renderer: riskRenderer, // Apply the custom renderer
    popupTemplate: {
      title: "{Name}", // Replace with the relevant field in your dataset
      content: `
        <b>Risk Level:</b> {Adult}<br>
        <b>Details:</b> Additional information can go here.
      `
    },
    labelingInfo: [
      {
        labelExpressionInfo: {
          expression: "$feature.Adult" // Display the "Adult" field value as the label
        },
        symbol: {
          type: "text",
          color: "#000000", // Black text color
          font: {
            size: 12,
            family: "Arial",
            weight: "bold"
          }
        },
        labelPlacement: "always-horizontal", // Ensures labels are horizontal
        minScale: 0, // Display labels at all scales
        maxScale: 0
      }
    ]
  });
      
      
      // Add the Travel Risk Map layer to the map
      map.add(travelRiskLayer);
      








  
});
