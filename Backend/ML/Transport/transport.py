from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error

base_dir = os.path.dirname(os.path.abspath(__file__))

# Correctly construct the relative path to the model and label encoder files
model_path = os.path.join(base_dir, 'carbon_emission_model.pkl')
label_encoder_path = os.path.join(base_dir, 'transport_label_encoder.pkl')

# Load the model and label encoder
try:
    model = joblib.load(model_path)
    transport_label_encoder = joblib.load(label_encoder_path)
except FileNotFoundError as e:
    print(f"Error: {e}")
    print(f"Model path: {model_path}")
    print(f"Label encoder path: {label_encoder_path}")
    raise  # Re-raise the exception after logging the error

def preprocess_data(dataframe):
    """
    Function to preprocess the input dataframe.
    Encodes categorical features and extracts numeric values.
    """
    dataframe.columns = dataframe.columns.str.strip()  # Clean column names

    # Encode transport_method using LabelEncoder
    dataframe['transport_method'] = transport_label_encoder.transform(dataframe['transport_method'])

    # Extract numerical values from carbonEmissions
    dataframe['carbonEmissions'] = dataframe['carbonEmissions'].apply(
        lambda x: float(eval(x)['kilograms']) if isinstance(x, str) else x
    )

    return dataframe

def split_data(dataframe):
    """
    Function to split the data into features (X) and target (y),
    and create training and testing sets.
    """
    X = dataframe[['weight_value', 'distance_value', 'transport_method']]
    y = dataframe['carbonEmissions']
    return train_test_split(X, y, test_size=0.2, random_state=42)

def assess_risk(emission_value):
    """
    Function to determine the risk level based on the emission value.
    """
    if emission_value < 500:
        return 'Low Risk'
    elif emission_value < 2000:
        return 'Moderate Risk'
    elif emission_value < 5000:
        return 'High Risk'
    else:
        return 'Severe Risk'

def predict_emissions_and_risk(days_data):
    """
    Function to predict emissions and assess risk levels for a 7-day input.
    Each day's predictions and risks are displayed.
    """
    results = []  # To store predictions and risks for all 7 days

    for day, day_data in enumerate(days_data, start=1):
        day_results = []  # Store results for one day

        for entry in day_data:
            # Extract features from the entry
            weight_unit, weight_value, distance_unit, distance_value, transport_method = entry

            # Convert transport_method to numeric
            transport_method_encoded = transport_label_encoder.transform([transport_method])[0]

            # Create a DataFrame with proper column names
            features = pd.DataFrame([[weight_value, distance_value, transport_method_encoded]],
                                    columns=['weight_value', 'distance_value', 'transport_method'])

            # Predict emissions
            predicted_emission = model.predict(features)[0]

            # Assess risk
            risk_level = assess_risk(predicted_emission)

            # Store prediction and risk level
            day_results.append({'Predicted Emission': predicted_emission, 'Risk Level': risk_level})

        # Add day's results to the main results list
        results.append({'Day': day, 'Results': day_results})

    return results