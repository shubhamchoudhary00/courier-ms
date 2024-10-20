import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserProfile.css'; // Assuming you have a CSS file for styling
import host from '../APIRoute/APIRoute';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
const UserProfile = () => {
    const {user}=useSelector((state)=>state.user)
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    totalStaffs: 0,
    totalBranches: 0,
  });
  const params=useParams()
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Fetch user details, total staffs, and branches
  useEffect(() => {
    console.log('init')
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${host}/user/get-user-details/${params?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const staffResponse = await axios.get(`${host}/staff/get-stats/${params?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const branchResponse = await axios.get(`${host}/branch/get-stats/${params?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (userResponse.data.success) {
          setUserData({
            ...userData,
            name: userResponse.data.user.name,
            phone: userResponse.data.user.phone,
            email: userResponse.data.user.email,
            totalStaffs: staffResponse.data.totalStaffs,
            totalBranches: branchResponse.data.totalBranches
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  // Handle input change for password fields
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Submit the password change form
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    try {
      const response = await axios.post(`${host}/user/change-password`, {
        password: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        id:user?._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        message.success('Password changed successfully!');
        setShowPasswordChange(false); // Hide the change password section after success
      } else {
        message.warning(response.data.message || 'Error changing password.');
      }
    } catch (error) {
      console.error('Error changing password:', error.message);
      message.error('An error occurred while changing the password.');
    }
  };

  return (
    <Layout>
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Total Staffs:</strong> {userData.totalStaffs}</p>
        <p><strong>Total Branches:</strong> {userData.totalBranches}</p>
      </div>

      <div className="change-password-section">
        <button onClick={() => setShowPasswordChange(!showPasswordChange)} className="change-password-btn">
          {showPasswordChange ? 'Cancel' : 'Change Password'}
        </button>

        {showPasswordChange && (
          <form onSubmit={handleChangePassword} className="password-form">
            <div>
              <label><strong>Current Password:</strong></label>
              <input 
                type="password" 
                name="currentPassword" 
                value={passwordData.currentPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <div>
              <label><strong>New Password:</strong></label>
              <input 
                type="password" 
                name="newPassword" 
                value={passwordData.newPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <div>
              <label><strong>Confirm Password:</strong></label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={passwordData.confirmPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <button type="submit" className="submit-password-btn">Submit</button>
          </form>
        )}
      </div>
    </div>
    </Layout>
    
  );
};

export default UserProfile;
