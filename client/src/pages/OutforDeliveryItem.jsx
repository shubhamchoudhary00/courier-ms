import Layout from "../components/Layout";
import host from '../APIRoute/APIRoute'
import axios from 'axios'
import {message} from 'antd';
import { useEffect, useState } from "react";
import ParcelTable from "../components/ParcelTable";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const OutforDeliveryItem = () => {

    const [parcels,setParcels]=useState([]);
    const [trigger,setTrigger]=useState(false);
    const {user}=useSelector((state)=>state.user)
    const navigate=useNavigate()

    const getParcels=async(id)=>{
        try{
            const res=await axios.post(`${host}/shipping/out-for-delivery-parcels`,{id},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                console.log(res.data)
                setParcels(res.data.filteredParcels);
            }

        }catch(error){
            // console.log(error.message)
            // message.error('Something went wrong')
        }
    }

    useEffect(() => {
        if(user){
          if(user.role==='User'){
            getParcels(user?._id);
    
          }else if(user?.role==='Staff'){
            getParcels(user?.userId);
    
          }
    
        }
      }, [trigger,user]);
      useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);
    
  return (
    <Layout>
      <div className="main">
      <h2>Out for Delivery Parcels</h2>
      <ParcelTable data={parcels} trigger={trigger} setTrigger={setTrigger} />
      </div>
    </Layout>
  )
}

export default OutforDeliveryItem
