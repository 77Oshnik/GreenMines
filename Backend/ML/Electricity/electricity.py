import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
import logging
import json


le = LabelEncoder()
scaler = StandardScaler()
model = RandomForestRegressor()

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load the LabelEncoder and scaler from files
base_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(base_dir,  'scaler.pkl')
label_encoder_path = os.path.join(base_dir, 'label_encoder.pkl')
model_path = os.path.join(base_dir, 'random_forest_model.pkl')

scaler = joblib.load(scaler_path)
label_encoder = joblib.load(label_encoder_path)
model = joblib.load(model_path)


# Function to preprocess the input data
def preprocess_data(input_data):
    """
    Preprocess input data for predictions with 'stateName' as the first feature.
    """
    # Convert JSON data to DataFrame
    input_df = pd.DataFrame(input_data)
    
    # Ensure required columns exist
    required_columns = ['stateName', 'energyPerTime', 'responsibleArea', 'totalArea']
    missing_columns = [col for col in required_columns if col not in input_df.columns]
    if missing_columns:
        raise ValueError(f"Missing columns in input data: {missing_columns}")
    
    # Reorder columns to match training order
    input_df = input_df[required_columns]

    # Encode 'stateName' using the LabelEncoder
    input_df['stateName'] = label_encoder.transform(input_df['stateName'])

    # Scale the features using the previously fitted scaler
    input_scaled = scaler.transform(input_df)

    return input_scaled

# Function to predict emissions and evaluate risk
def predict_emissions_and_risk(days_data, state_name):
    """
    Predict CO2 emissions and evaluate risk for the provided data.

    Args:
        days_data (list of dict): List of dictionaries with daily data.
        state_name (str): The state name.

    Returns:
        list of dict: Predictions with risk levels.
    """
    # Add the state name to each day's data
    for day in days_data:
        day['stateName'] = state_name

    # Preprocess the input data
    input_scaled = preprocess_data(days_data)

    # Predict CO2 emissions
    predictions = model.predict(input_scaled)

    # Create a response with risk levels
    response = []
    for i, predicted_co2 in enumerate(predictions):
        risk_level, predicted_value = assess_risk(predicted_co2)
        response.append({
            "day": i + 1,
            "predicted_co2": predicted_value,
            "risk_level": risk_level
        })

    return response

# Function to assess risk based on CO2 levels
def assess_risk(predicted_co2):
    """
    Assess risk level based on CO2 levels.
    """
    if predicted_co2 < 300:
        return "Low Risk", predicted_co2
    elif predicted_co2 < 700:
        return "Moderate Risk", predicted_co2
    elif predicted_co2 < 1200:
        return "High Risk", predicted_co2
    else:
        return "Severe Risk", predicted_co2