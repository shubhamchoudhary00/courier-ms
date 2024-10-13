import TableGrid from '../components/TableGrid'
import Layout from '../components/Layout'
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const ManageBranch = () => {

  const [branches,setBranches]=useState([]);
  const {user}=useSelector((state)=>state.user)

  const getAllBranches=async()=>{
    try{
      const {data}=await axios.post(`${host}/branch/get-user-specific-branches`,{user},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(data.success){
        console.log(data);
        setBranches(data.branches);
      }
    }catch(error){
      console.log(error.message);
      message.error('Something went wrong')
    }
  }

  useEffect(()=>{
    getAllBranches();
    // console.log(user)
  },[]);

  return (
    <Layout>
    <div className='main'>
    <h2>Manage Branch</h2>
    <TableGrid data={branches} />
    </div>
    
    </Layout>
  )
}

export default ManageBranch
