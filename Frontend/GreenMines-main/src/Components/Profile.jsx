import React, { useState, useEffect } from 'react';
import Enavbar from './Enavbar';
import axios from 'axios';

const Profile = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [emissionGoal, setEmissionGoal] = useState(800);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = JSON.parse(localStorage.getItem('email'));
      if (storedEmail) {
        try {
          const token = localStorage.getItem('token'); // Use token for authenticated requests
          console.log(storedEmail)
          const response = await axios.get(`http://localhost:5000/api/userData/${storedEmail}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data); // Update user state with API response
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Optionally handle the error or redirect to login if unauthorized
        }
      } else {
        console.error('No email found in localStorage');
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file); // Set the file for preview or uploading
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/update-profile-picture',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setUser({ ...user, profilePicture: response.data.profilePicture });
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    }
  };

  const handleGoalChange = (e) => {
    setNewGoal(e.target.value);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const goal = parseFloat(newGoal);
    if (!isNaN(goal) && goal > 0) {
      setEmissionGoal(goal);
      setNewGoal('');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen w-full mt-24 overflow-x-hidden">
        <Enavbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">User Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* User Info Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <img 
              src={user.profilePicture || 'https://cdn-icons-png.freepik.com/128/3135/3135715.png'} 
              alt={user.name || 'USER'} 
              className="w-40 h-40 rounded-full mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-center mb-3">{user?.name || 'Name not available'}</h2>
            <p className="text-center text-gray-400 text-lg mb-5">{user?.email || 'Email not available'}</p>
                 
            {/* Added User Information */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="position">
                Position
              </label>
              <p className="text-gray-200 text-lg" id="position">{user.position}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="team">
                Team
              </label>
              <p className="text-gray-200 text-lg" id="team">{user.team}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="secondInCommand">
                Second in Command
              </label>
              <p className="text-gray-200 text-lg" id="secondInCommand">{user.secondInCommand}</p>
            </div>

            {/* Other Info */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="joinDate">
                Join Date
              </label>
              <p className="text-gray-200 text-lg" id="joinDate">{user.joinDate}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="currentEmission">
                Current CO2 Emission (kg/year)
              </label>
              <p className="text-gray-200 text-lg" id="currentEmission">{user.currentEmission}</p>
            </div>
          </div>

          {/* Emission Goal Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Emission Goal</h2>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="currentGoal">
                Current CO2 Emission Goal (kg/year)
              </label>
              <p className="text-gray-200 text-2xl font-bold" id="currentGoal">{emissionGoal}</p>
            </div>
            <form onSubmit={handleGoalSubmit} className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="newGoal">
                  Set New Goal (kg/year)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                  id="newGoal"
                  type="number"
                  placeholder="Enter new goal"
                  value={newGoal}
                  onChange={handleGoalChange}
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Set New Goal
              </button>
            </form>
            {user.currentEmission > emissionGoal ? (
              <p className="text-red-500 font-bold">
                Warning: Your current emission ({user.currentEmission} kg/year) exceeds your goal!
              </p>
            ) : (
              <p className="text-green-500 font-bold">
                Great job! Your current emission is within your goal.
              </p>
            )}
          </div>

          {/* Project Info Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Project Info</h2>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="mineLocation">
                Mine Location
              </label>
              <p className="text-gray-200 text-lg" id="mineLocation">{user.mineLocation}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="coalMineSize">
                Coal Mine Size
              </label>
              <p className="text-gray-200 text-lg" id="coalMineSize">{user.coalMineSize}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="dailyLaborers">
                Daily Laborers
              </label>
              <p className="text-gray-200 text-lg" id="dailyLaborers">{user.dailyLaborers}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="transportationInfo">
                Transportation Info
              </label>
              <p className="text-gray-200 text-lg" id="transportationInfo">{user.transportationInfo}</p>
            </div>
          </div>
        </div>

        {/* Emission Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Electricity</h2>
            <p className="text-4xl font-semibold mb-3">60 MWh</p>
            <p className="text-red-500">+15% from last week</p>
          </div>
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Explosion</h2>
            <p className="text-4xl font-semibold mb-3">40 tCO2e</p>
            <p className="text-green-500">-5% from last week</p>
          </div>
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Fuel</h2>
            <p className="text-4xl font-semibold mb-3">50 tCO2e</p>
            <p className="text-red-500">+10% from last week</p>
          </div>
          <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Shipping</h2>
            <p className="text-4xl font-semibold mb-3">35 tCO2e</p>
            <p className="text-green-500">-8% from last week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
