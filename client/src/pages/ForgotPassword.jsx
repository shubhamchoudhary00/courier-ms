import { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import host from '../APIRoute/APIRoute';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
    const navigate=useNavigate();
  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${host}/user/forgot-password`, { email });
      if (res.data.success) {
        message.success(res.data.message);
        navigate('/')
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <MDBContainer fluid className="forgot-password-container d-flex align-items-center justify-content-center">
      <MDBRow>
        <MDBCol md="6" className="offset-md-3">
        <div className="text-center login-logos">
        <img src='/images/logo.png' alt="Logo" className="logos" />

            </div>

          <MDBCard className="bg-glass p-4">

            
            <MDBCardBody>
              <h4 className="text-center mb-4" >Forgot Password</h4>
              <p className="text-center text-muted mb-4">
                Enter your email address below and we'll send you a link to reset your password.
              </p>
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Enter your email"
                id="form1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
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
                Submit
              </MDBBtn>
              <div className="text-center">
                <Link to="/login">Back to Login</Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ForgotPassword;
