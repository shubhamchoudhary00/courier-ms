import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import '../styles/Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    phone:''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address');
    }
  };
  const handleChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
        validateEmail(e.target.value);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || emailError) {
        validateEmail(contactForm.email);
        return; // prevent form submission if email is invalid
      }
    console.log('Contact Form Data:', contactForm);
    setContactForm({ name: '', email: '', message: '',phone:'' });
  };

  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden full-screen">
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol md="8" className="text-center text-md-start d-flex flex-column justify-content-center">

          {/* Logo */}
          <div className="text-center mb-4 logo">
            <img src="/images/logo.png" alt="Logo" className="portfolio-logo" />
          </div>

          {/* Title and Description */}
          <h1 className="my-5 display-4 fw-bold ls-tight px-3 text-center" style={{ color: 'hsl(218, 81%, 95%)' }}>
            Welcome to TrackTrace <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>A Powerful Courier Management System</span>
          </h1>

          <p className="px-3 text-center" style={{ color: 'hsl(218, 81%, 85%)' }}>
            Manage your shipments, track parcels in real-time, and generate reports with ease.
          </p>

          {/* Call to Action */}
          <div className="text-center">
            <MDBBtn onClick={() => navigate('/login')} className="mb-4 button-mdn">
              Get Started
            </MDBBtn>
          </div>

        </MDBCol>
      </MDBRow>

      {/* Features Section */}
      <MDBRow className="justify-content-center align-items-center mt-5">
        <MDBCol md="3" className="text-center">
          <MDBCard className="transparent-card feature-card">
            <MDBCardBody>
              <h5 className="text-primary card-text">Real-Time Tracking</h5>
              <p>Track parcels in real-time and receive live updates.</p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="3" className="text-center">
          <MDBCard className="transparent-card feature-card">
            <MDBCardBody>
              <h5 className="text-primary card-text">Efficient Management</h5>
              <p>Manage shipments, branches, and couriers effortlessly.</p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="3" className="text-center">
          <MDBCard className="transparent-card feature-card">
            <MDBCardBody>
              <h5 className="text-primary card-text">Analytics & Reports</h5>
              <p>Generate detailed reports on parcel movements and more.</p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Contact Us Section */}
      <MDBRow className="justify-content-center align-items-center mt-5">
        <MDBCol md="8" className="text-center">
          <h5 style={{ color: 'hsl(218, 81%, 95%)' }}>Get in Touch</h5>
          <p style={{ color: 'hsl(218, 81%, 85%)' }}>
            If you have any questions or need support, feel free to reach out to us through the form below.
          </p>

          {/* Contact Us Form */}
          <MDBCard className="transparent-card contact-card">
            <MDBCardBody>
              <form onSubmit={handleSubmit}>
                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput 
                      type="textarea" 
                      name="name"
                      placeholder='Your Name'
                      value={contactForm.name}
                      onChange={handleChange} 
                      className="input-field"
                      required
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput 
                      type="textarea" 
                      name="email"
                      placeholder='Your Email'
                      value={contactForm.email}
                      onChange={handleChange} 
                      className="input-field"
                      required
                    />
                     {/* Show email error message if validation fails */}
                     {emailError && <p className="email-error">{emailError}</p>}
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                <MDBCol>
                    <MDBInput 
                      type="textarea" 
                      rows="4"
                      name="phone"
                      placeholder='Your Phone Number'
                      value={contactForm.phone}
                      onChange={handleChange} 
                      className="input-field"
                      required
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput 
                      type="textarea" 
                      rows="4" 
                      name="message"
                      placeholder='Your Message'
                      value={contactForm.message}
                      onChange={handleChange} 
                      className="input-field"
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBBtn type="submit" className="button-mdn">Send Message</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Login / Signup Section */}
      <MDBRow className="justify-content-center align-items-center mt-5">
        <MDBCol md="8" className="text-center">
          <p style={{ color: 'hsl(218, 81%, 85%)' }}>Already have an account?</p>
          <MDBBtn onClick={() => navigate('/login')} className="mx-2 button-mdn">Login</MDBBtn>
          <MDBBtn onClick={() => navigate('/signup')} className="mx-2 button-mdn">Sign Up</MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Portfolio;
