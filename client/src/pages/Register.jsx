import  { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from 'mdb-react-ui-kit';
import '../styles/Register.css';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name,setName]=useState('')
    const [phone,setPhone]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('');
    const navigate=useNavigate()
    
    const handleSubmit=async()=>{
   
        console.log({name,phone,email,password});
        try{
            const res=await axios.post(`${host}/user/register`,{name,email,phone,password});
            if(res.data.success){
                message.success(res.data.message);
                navigate('/')
            }
        }catch(error){
            console.log(error.message);
            if(error.data && error.data.response){
                message.error(error.data.response.message || 'Something went wrong')
            }else{
                message.error( 'Something went wrong')

            }
        }
    }
  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden" style={{ height: '100vh' }}>
      <MDBRow>
        <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
        <div className='text-center mb-4 logo'>
        <img src="https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Flogo.png?alt=media&token=7bca5d5f-4d8d-4fea-8201-e8b09a65eb76" alt="Logo" className="login-logo" />
    </div>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            Create an Account <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>Join us today!</span>
          </h1>
          <p className="px-3" style={{ color: 'hsl(218, 81%, 85%)' }}>
            Please fill in the form below to create an account. Enjoy exclusive offers and updates!
          </p>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className="my-5 bg-glass">
            <MDBCardBody className="p-5">
              <MDBInput wrapperClass="mb-4" placeholder='Name' id="form1" type="text" name='name' onChange={(e)=>setName(e.target.value)} />
              <MDBInput wrapperClass="mb-4" placeholder="Phone" id="form2" type="text" onChange={(e)=>setPhone(e.target.value)} />
              <MDBInput wrapperClass="mb-4" placeholder="Email" id="form3" type="email" onChange={(e)=>setEmail(e.target.value)} />
              <MDBInput wrapperClass="mb-4" placeholder="Password" id="form4" type="password" onChange={(e)=>setPassword(e.target.value)} />
             
              <MDBBtn 
              className='w-100 mb-4 button-mdn' 
              size='md' 
              style={{ height: '50px', lineHeight: 'normal' }} // Ensure consistent size
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission (if in a form)
                handleSubmit();
              }}
            >
              Sign Up
            </MDBBtn>              
            <div className="text-center">
                <p>or sign in with: <Link to='/'>Login</Link> </p>
                {/*<MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="facebook-f" size="sm" />
                </MDBBtn>
                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="twitter" size="sm" />
                </MDBBtn>
                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="google" size="sm" />
                </MDBBtn>
                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="github" size="sm" />
                </MDBBtn>*/}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
