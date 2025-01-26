import requests
import json

def fetch_and_format_field_infos(url):
    try:
        # Get the layer metadata from the ArcGIS REST API
        response = requests.get(f"{url}?f=json")
        response.raise_for_status()
        data = response.json()

        # Extract the fields from the response
        fields = data.get("fields", [])
        
        # Format the fields into fieldInfos
        field_infos = []
        for field in fields:
            field_name = field.get("name")
            field_alias = field.get("alias")
            field_type = field.get("type")

            # Prepare the fieldInfo structure
            field_info = {
                "fieldName": field_name,
                "label": field_alias,
            }

            # Add formatting options for numeric fields
            if "Double" in field_type or "Integer" in field_type:
                field_info["format"] = {"digitSeparator": True, "places": 2}

            field_infos.append(field_info)

        return field_infos

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

# URL of the ArcGIS REST service
url = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Detailed_Water_Bodies/FeatureServer/0"

# Fetch and format the fieldInfos
field_infos = fetch_and_format_field_infos(url)

# Print the formatted fieldInfos in JSON format
print(json.dumps(field_infos, indent=2))