import { Form, Input, Button, Row, Col, message } from 'antd';
import '../styles/ContactUs.css'; // Include styling here
import Layout from '../components/Layout';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
const ContactUs = () => {
    const [loader,setLoader]=useState(false)
  const handleSubmit = async(values) => {
    setLoader(true)
    try{
        const {data}=await axios.post(`${host}/user/send-message`,{values})
        if(data.success){
            message.success('Message Sent Successfully. Our team will contact you within 48 hours')
        }
    }catch(error){
        message.error('Something went wrong')
    }
    setLoader(false)
    // Handle form submission logic
  };

  return (
    <Layout>
    <div className="contact-us-container">
      <h1>Contact Us</h1>
      <p className="intro-text">
        Thank you for your interest in Track Trace, your reliable courier management system. Whether you have questions, feedback, or need support, we're here to help.
      </p>
      
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <div className="contact-info">
            <h2>Our Info</h2>
            <p><strong>Phone:</strong> +91 9877443177</p>
            <p><strong>Email:</strong> tracktraceinfo@gmail.com</p>
            <p><strong>Working Hours:</strong> Mon - Fri, 9 AM - 6 PM</p>
          </div>
        </Col>

        <Col xs={24} sm={12}>
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="name"
                label="Your Name"
                rules={[{ required: true, message: 'Please enter your name!' }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                name="text"
                label="Phone"
                rules={[{ required: true, message: 'Please enter your Phone number!' }]}
              >
                <Input placeholder="Enter your Phone number" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please enter your message!' }]}
              >
                <Input.TextArea placeholder="Enter your message" rows={4} />
              </Form.Item>

              <Form.Item>
              {loader ? <ClipLoader /> : <Button type="primary" htmlType="submit" className="contact-submit-button">
                Submit
              </Button> }
                
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

      <div className="about-track-trace">
        <h2>About Track Trace</h2>
        <p>
          Track Trace is a comprehensive courier management system designed to streamline and optimize the entire delivery process. From real-time tracking to automated status updates, our platform ensures that your parcels are delivered with precision and speed. 
        </p>
        <p>
          Whether you're managing a large logistics network or a small courier business, Track Trace provides all the tools you need to manage, track, and optimize your courier services efficiently.
        </p>
      </div>
    </div>
    </Layout>
    
  );
};

export default ContactUs;
