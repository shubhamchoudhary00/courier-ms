import  { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/NewBranch.css';
import Confirmation from '../components/Confirmation';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useSelector } from 'react-redux';

const NewBranch = () => {
  const [branchName,setBranchName]=useState('');
  const [street,setStreet]=useState('')
  const [state,setState]=useState('')
  const [country,setCountry]=useState('')
  const [city,setCity]=useState('')
  const [pincode,setPincode]=useState('')
  const [contactPersonName,setContactPersonName]=useState('')
  const [contactPersonNumber,setContactPersonNumber]=useState('');
  const [isConfirm,setIsConfirm]=useState(false);
  const {user}=useSelector((state)=>state.user);

  const handleSubmit=async()=>{
    setIsConfirm(true)
    console.log({street,state,country,city,pincode,contactPersonName,contactPersonNumber})
    try{
      if(!street || !state || !country || !city || !pincode || !contactPersonName || !contactPersonNumber || !branchName){
        message.error('Please provide all the details')
        return ;
      }
      const res=await axios.post(`${host}/branch/create-branch`,{branchName,street,user,state,country,city,pincode,contactPersonName,contactPersonNumber},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        message.success(res.data.success);
        // setBranchName('')
        // setStreet('')
        // setState('')
        // setCity('')
        // setCountry('')
        // setContactPersonName('')
        // setContactPersonNumber('')
        // setPincode('')
      }
    }catch(error){
      console.log(error.message);
      if(error.data && error.data.response){
        message.error(error.data.response.message || 'Something went wrong');

      }else{
        message.error('Something went wrong');
      }
    }
    setIsConfirm(false)
  }

  useEffect(()=>{
    console.log(user)
  },[user])
  return (
    <Layout>
    <Confirmation isConfirm={isConfirm} onConfirm={handleSubmit} setIsConfirm={setIsConfirm} />
    <div className='main'>
        <h2>New Branch</h2>
        <br/>
        <div className='new-branch'>
          <Form className='branch-form'>
            <Form.Group className="mb-3" controlId="branch">
              <Form.Label>Branch Name</Form.Label>
              <Form.Control as="textarea" rows={2} onChange={(e)=>setBranchName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="streetBuilding">
              <Form.Label>Street/Building</Form.Label>
              <Form.Control as="textarea" rows={2} onChange={(e)=>setStreet(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control as="textarea" rows={2} onChange={(e)=>setState(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control as="textarea" rows={2} onChange={(e)=>setCountry(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control as="textarea" rows={2} onChange={(e)=>setCity(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Postal Code/Zip Code</Form.Label>
              <Form.Control as="textarea"  rows={1} onChange={(e)=>setPincode(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact">
              <Form.Label>Contact Person Name</Form.Label>
              <Form.Control as="textarea" rows={1} onChange={(e)=>setContactPersonName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact">
              <Form.Label>Contact Person Number</Form.Label>
              <Form.Control as="textarea" rows={1} onChange={(e)=>setContactPersonNumber(e.target.value)} />
            </Form.Group>

            <div className="button-group">
              <Button variant="primary" type="submit" onClick={(e)=>{
                e.preventDefault();
                setIsConfirm(true)

              }}>
                Save
              </Button>
              <Button variant="secondary" className="ms-2">
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default NewBranch;
