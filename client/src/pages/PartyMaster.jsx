import { useState, useEffect } from 'react';
import Confirmation from '../components/Confirmation';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import '../styles/PartyMaster.css';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useSelector } from 'react-redux';

const PartyMaster = () => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const {user}=useSelector((state)=>state.user);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
    gstNo: '',
    transGstNo: '',
    pan: '',
    bankAccountNo: '',
    bankName: '',
    ifscCode: '',
    email: '',
    personName: '',
    personNo: '',
    aadharNo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    const { companyName, address, city, state, country } = formData;
    setIsFormValid(companyName && address && city && state && country);
  }, [formData]);

  const handleSubmit = async () => {
    console.log(formData);
    try {
        
      const { data } = await axios.post(`${host}/party/add-party`, { form: formData,userId:user?.role=== 'User' ?user?._id  : user?.userId}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        message.success('Added Successfully');
      }
    } catch (error) {
        if(error.data && error.data.response){
            message.error(error.data.response.message);
        }else{
            message.error('Something went wrong', error.message);

        }

    }
  };

  return (
    <Layout>
      <Confirmation isConfirm={isConfirm} onConfirm={handleSubmit} setIsConfirm={setIsConfirm} />
      <div className="new-branch-container">
        <h2 className="form-heading">New Party</h2>
        <Form className="branch-form">
          <Form.Group className="mb-2" controlId="companyName">
            <Form.Label>Company Name <span className="required">*</span></Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="address">
            <Form.Label>Address <span className="required">*</span></Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="city">
            <Form.Label>City <span className="required">*</span></Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="pincode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="state">
            <Form.Label>State <span className="required">*</span></Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="country">
            <Form.Label>Country <span className="required">*</span></Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="gstNo">
            <Form.Label>GST No</Form.Label>
            <Form.Control
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="transGstNo">
            <Form.Label>Transport GST No</Form.Label>
            <Form.Control
              type="text"
              name="transGstNo"
              value={formData.transGstNo}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="pan">
            <Form.Label>PAN</Form.Label>
            <Form.Control
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="bankAccountNo">
            <Form.Label>Bank Account Number</Form.Label>
            <Form.Control
              type="text"
              name="bankAccountNo"
              value={formData.bankAccountNo}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="bankName">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="ifscCode">
            <Form.Label>IFSC Code</Form.Label>
            <Form.Control
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="personName">
            <Form.Label>Contact Person Name</Form.Label>
            <Form.Control
              type="text"
              name="personName"
              value={formData.personName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="personNo">
            <Form.Label>Contact Person Number</Form.Label>
            <Form.Control
              type="text"
              name="personNo"
              value={formData.personNo}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="aadharNo">
            <Form.Label>Aadhar No</Form.Label>
            <Form.Control
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="button-group">
            <Button 
              variant="primary" 
              onClick={(e) => { e.preventDefault(); setIsConfirm(true); }} 
              disabled={!isFormValid} 
            >
              Save
            </Button>
            <Button variant="secondary" className="ms-3">
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default PartyMaster;

