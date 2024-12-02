import React, { useState, useEffect } from 'react';
import Enavbar from './Enavbar';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [emissionGoal, setEmissionGoal] = useState(800);
  const [newGoal, setNewGoal] = useState('');
  const [editableFields, setEditableFields] = useState({
    position: false,
    team: false,
    joinDate: false,
  });

  const [updatedUserData, setUpdatedUserData] = useState({
    position: '',
    team: '',
    joinDate: '',
  });

  // User ID to be used when sending requests
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = JSON.parse(localStorage.getItem('email'));
      if (storedEmail) {
        try {
          const token = localStorage.getItem('token'); // Use token for authenticated requests
          const response = await axios.get(`http://localhost:5000/api/user/${storedEmail}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data); // Update user state with API response
          setUserId(response.data.id); // Set the user ID
          setUpdatedUserData({
            position: response.data.position || '',
            team: response.data.team || '',
            joinDate: new Date(response.data.createdAt).toLocaleDateString(),
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
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
      setNewProfilePicture(file);
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', userId); // Add the userId to the formData

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/user/update-profile-picture',
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

  const toggleEditableField = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };

  const handleFieldChange = (e, field) => {
    setUpdatedUserData({ ...updatedUserData, [field]: e.target.value });
  };

  const handleFieldSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/update-user-data/${user.id}`,
        { [field]: updatedUserData[field] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, [field]: updatedUserData[field] });
      toggleEditableField(field);
    } catch (error) {
      console.error('Failed to update user data:', error);
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
            <div className="relative mb-6">
              <img
                src={user.profilePicture || 'https://dummyimage.com/150x150/000/fff'}
                alt={user.name || 'USER'}
                className="w-40 h-40 rounded-full mx-auto mb-6"
              />
              <label htmlFor="profilePicture" className="absolute bottom-2 right-2 text-white cursor-pointer">
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                Edit
              </label>
            </div>

            <h2 className="text-3xl font-bold text-center mb-3">{user?.name || 'Name not available'}</h2>
            <p className="text-center text-gray-400 text-lg mb-5">{user?.email || 'Email not available'}</p>

            {/* Editable Position */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="position">
                Position
              </label>
              {editableFields.position ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={updatedUserData.position}
                    onChange={(e) => handleFieldChange(e, 'position')}
                    className="text-gray-200 w-full bg-gray-700 border-b border-gray-500 py-2 px-3"
                  />
                  <button onClick={() => handleFieldSave('position')} className="ml-2 text-green-500">Save</button>
                </div>
              ) : (
                <p onClick={() => toggleEditableField('position')} className="text-gray-200 text-lg cursor-pointer">
                  {user.position || 'Position not set'}
                </p>
              )}
            </div>

            {/* Editable Team */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="team">
                Team
              </label>
              {editableFields.team ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={updatedUserData.team}
                    onChange={(e) => handleFieldChange(e, 'team')}
                    className="text-gray-200 w-full bg-gray-700 border-b border-gray-500 py-2 px-3"
                  />
                  <button onClick={() => handleFieldSave('team')} className="ml-2 text-green-500">Save</button>
                </div>
              ) : (
                <p onClick={() => toggleEditableField('team')} className="text-gray-200 text-lg cursor-pointer">
                  {user.team || 'Team not set'}
                </p>
              )}
            </div>

            {/* Editable Join Date */}
            <div className="mb-4">
              <label className="block text-gray-400 text-base font-bold mb-2" htmlFor="joinDate">
                Join Date
              </label>
              {editableFields.joinDate ? (
                <div className="flex items-center">
                  <input
                    type="date"
                    value={updatedUserData.joinDate}
                    onChange={(e) => handleFieldChange(e, 'joinDate')}
                    className="text-gray-200 w-full bg-gray-700 border-b border-gray-500 py-2 px-3"
                  />
                  <button onClick={() => handleFieldSave('joinDate')} className="ml-2 text-green-500">Save</button>
                </div>
              ) : (
                <p onClick={() => toggleEditableField('joinDate')} className="text-gray-200 text-lg cursor-pointer">
                  {updatedUserData.joinDate || 'Join Date not available'}
                </p>
              )}
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 bg-gray-700"
                  id="newGoal"
                  type="number"
                  value={newGoal}
                  onChange={handleGoalChange}
                  placeholder="Enter new emission goal"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Goal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
