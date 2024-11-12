import { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import '../styles/Login.css'
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { setUser } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const loadingMessage = message.loading('Logging in...', 0); // Keep loading message until we manually close it
        
        try {
            const res = await axios.post(`${host}/user/login`, { email, password });
    
            if (res.data.success) {
                // Close the loading message
                loadingMessage();
                message.success('Login successful');
                
                // Store the token and user data
                localStorage.setItem('token', res.data.token);
                dispatch(setUser(res.data.user));
    
                // Navigate to home
                navigate('/home');
            }
        } catch (error) {
            // Close the loading message
            loadingMessage();
            
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error('An error occurred. Please try again later.');
            }
        }
    };
    
    

    return (
        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden lp-screen'>

            <MDBRow className='justify-content-center align-items-center'>

                <MDBCol md='6' lg='5' xl='4' className='text-center text-md-start d-flex flex-column justify-content-center'>

                    {/* Insert the logo above the login card */}
                    <div className='text-center mb-4 logo'>
                        <img src="https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Flogo.png?alt=media&token=7bca5d5f-4d8d-4fea-8201-e8b09a65eb76" alt="Logo" className="login-logo" />
                    </div>

                    <h1 className="my-5 display-4 fw-bold ls-tight px-3 text-center" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Welcome Back! <br />
                        <span style={{ color: 'hsl(218, 81%, 75%)' }}>Login to your account</span>
                    </h1>

                    <p className='px-3 text-center' style={{ color: 'hsl(218, 81%, 85%)' }}>
                        Experience seamless access to your business tools and get started in no time.
                    </p>

                </MDBCol>

                <MDBCol md='6' lg='5' xl='4' className='position-relative'>

                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>

                            <h4 className="mb-5 text-center" style={{fontSize:'2rem'}}>Login</h4>

                            <MDBInput wrapperClass='mb-4' id='form1' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' id='form2' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />

                            <div className='d-flex justify-content-between mb-4'>
                               {/* <MDBBtn tag='a' color='none'                                 style={{ height: '50px', lineHeight: 'normal' }}
                                className='text-dark' onClick={()=>navigate('/forgot-password')}>
                                    <MDBIcon fas icon="lock" /> Forgot password?
                                </MDBBtn> */}
                            </div>

                            <MDBBtn
                                className='w-100 mb-4 button-mdn'
                                size='md'
                                style={{ height: '50px', lineHeight: 'normal' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                            >
                                Log in
                            </MDBBtn>

                            <div className="text-center">
                                {/* <p>or signup with us : <Link to='/register'>Register</Link></p> */}

                              {/*  <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='facebook-f' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='twitter' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='google' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='github' size="sm" />
                                </MDBBtn> */}

                            </div>

                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>

        </MDBContainer>
    );
}

export default Login;
