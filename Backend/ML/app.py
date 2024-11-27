from flask import Flask, request, jsonify
from flask_cors import CORS
# Import model prediction functions from individual model files
from Transport.transport import predict_emissions_and_risk as predict_transport_emissions
from Fuel.fuel import predict_emissions_and_risk as predict_fuel_emissions  # Import the fuel model's prediction function
from Electricity.electricity import predict_emissions_and_risk as predict_emissions_and_risk  # Import the appropriate function
from Explosives.explosive import predict_7_days_multiple_explosives as predict_7_days_multiple_explosives  # Import the appropriate function

app = Flask(__name__)
CORS(app)

@app.route('/ml/transport', methods=['POST'])
def ml_transport():
    """
    Flask route for the transport model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    data = request.get_json()  # Get the JSON data from the request
    print("Received data:", data)  # Log the received data
    predictions = predict_transport_emissions(data['days_data'])  # Call the transport model's prediction function
    return jsonify(predictions)  # Return the predictions as a JSON response

@app.route('/ml/explosive', methods=['POST'])
def ml_explosive():
    """
    Flask route for the explosive model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    data = request.get_json()  # Get the JSON data from the request
        # Call the explosive model's prediction function
    predictions = predict_7_days_multiple_explosives(data['days_data'])
    return jsonify(predictions)  # Return the predictions as a JSON response
 

@app.route('/ml/fuel', methods=['POST'])
def ml_fuel():
    """
    Flask route for the fuel model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    try:
        # Parse the JSON data from the POST request
        data = request.get_json()
        
        # Validate incoming data
        if 'days_data' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required field: days_data.'
            }), 400
        
        # Extract the necessary fields
        daily_fuel_data = data['days_data']

        # Call the fuel model's prediction function
        predictions = predict_fuel_emissions(daily_fuel_data)

        # Return the predictions as a JSON response
        response = {
            'status': 'success',
            'predictions': predictions  # Convert the JSON string into an object
        }

        return jsonify(response), 200

    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f"An unexpected error occurred: {str(e)}"
        }), 500


@app.route('/ml/electricity', methods=['POST'])
def ml_electricity():
    """
    Flask route for the electricity model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    try:
        # Parse JSON data from the POST request
        data = request.get_json()
        
        # Validate incoming data
        if 'days_data' not in data or 'state_name' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: days_data or state_name.'
            }), 400
        
        # Extract the necessary fields
        days_data = data['days_data']
        state_name = data['state_name']

        # Call the electricity model's prediction function
        predictions = predict_emissions_and_risk(days_data, state_name)

        # Return the predictions as a JSON response
        response = {
            'status': 'success',
            'state': state_name,
            'predictions': predictions
        }

        return jsonify(response), 200

    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f"An unexpected error occurred: {str(e)}"
        }), 500



if __name__ == '__main__':
    app.run(debug=True, port=8800)  # Run Flask app on port 5000
