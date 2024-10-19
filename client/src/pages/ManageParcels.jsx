import Layout from "../components/Layout";
import host from '../APIRoute/APIRoute'
import axios from 'axios'
import {message} from 'antd';
import { useEffect, useState } from "react";
import ParcelTable from "../components/ParcelTable";
const ManageParcels = () => {

    const [parcels,setParcels]=useState([]);
    const [trigger,setTrigger]=useState(false)
    const getAllParcels=async()=>{
        try{
            const res=await axios.get(`${host}/shipping/get-all-shipment`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                console.log(res.data)
                setParcels(res.data.shippings);
            }

        }catch(error){
            console.log(error.message)
            message.error('Something went wrong')
        }
    }

    useEffect(()=>{
        getAllParcels();
    },[trigger])

  return (
    <Layout>
      <div className="main">
      <h2>Manage Parcels</h2>
      <ParcelTable data={parcels} trigger={trigger} setTrigger={setTrigger} />
      </div>
    </Layout>
  )
}

export default ManageParcels
