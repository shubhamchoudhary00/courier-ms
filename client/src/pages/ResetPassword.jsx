import  { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import '../styles/ResetPassword.css'; // Custom CSS for styling
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const params=useParams()

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`${host}/user/reset-password/${params?.id}`, { password:newPassword });
      if (res.data.success) {
        message.success(res.data.message);
        navigate('/login');
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden" style={{ height: '100vh' }}>
      <MDBRow>
        <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
          <div className='text-center mb-4 logo'>
            <img src="/images/logo.png" alt="Logo" className="login-logo" />
          </div>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            Reset Password <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>Secure your account!</span>
          </h1>
          <p className="px-3" style={{ color: 'hsl(218, 81%, 85%)' }}>
            Please enter your new password below to reset your account.
          </p>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className="my-5 bg-glass">
            <MDBCardBody className="p-5">
              <MDBInput
                wrapperClass="mb-4"
                placeholder="New Password"
                id="formNewPassword"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Confirm Password"
                id="formConfirmPassword"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <MDBBtn
                className="w-100 mb-4 button-mdn"
                size="md"
                style={{ height: '50px', lineHeight: 'normal' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Reset Password
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ResetPassword;
