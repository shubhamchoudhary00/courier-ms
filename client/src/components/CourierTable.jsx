import { useState } from "react";

import { message } from "antd";
import axios from "axios";
import host from "../APIRoute/APIRoute";
import Confirmation from "./Confirmation";
import '../styles/ParcelTable.css'
import CourierPartnerView from "./CourierPartnerView";
import UpdateParty from "./UpdateParty";
import UpdateCourierPartner from "./UpdateCourierPartner";
const CourierTable = ({data,trigger,setTrigger}) => {
    const [id,setId]=useState();
    const [open,setOpen]=useState(false);
    const [updateOpen,setUpdateOpen]=useState(false);

    const [isConfirm,setIsConfirm]=useState(false);
    // Handler for viewing an article
    const handleView = (id) => {
        setId(id);
        setOpen(!open);
    };

    // Handler for editing an article
    const handleEdit = (id) => {
        setId(id);
        setUpdateOpen(!updateOpen)
    };

    // Handler for deleting an article
    const handleDelete = async() => {
        setIsConfirm(true)
       try{ 
        const res=await axios.delete(`${host}/courier/delete-courier-partner/${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        });
        if(res.data.success){
            message.success(res.data.message)
        }

       }catch(error){
        message.error(error.message)
       }
      
       setIsConfirm(false)
       setTrigger(!trigger)
    };

 

    return (
        <div className="container">
        { updateOpen && <UpdateCourierPartner id={id} open={updateOpen} setOpen={setUpdateOpen}/>  }
        {open && <CourierPartnerView id={id} open={open} setOpen={setOpen} />}
        {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={handleDelete} />}
            <div className="row">
                <div className="col-12">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Courier Company Name</th>
                                <th scope="col">City/State/Pincode</th>
                                <th scope="col">Country</th>
                                <th scope="col">GST/Trans GST</th>
                          
                            
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data?.map((item) => (
                            <tr key={item?._id}>
                                <th scope="row">{item?.companyName}</th>
                                <td>{item?.city}/{item?.state}/{item?.pincode}</td>
                                <td>{item?.country}</td>
                                <td>{item?.gstNo || item?.transGstNo}</td>
                             
                                <td>
                               
                                    <button type="button" className="btn btn-primary" onClick={() => handleView(item?._id)}>
                                        <i className="far fa-eye"></i>
                                    </button>
                                   
                                    <button type="button" className="btn btn-success" onClick={() => handleEdit(item?._id)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => {
                                        setId(item?._id)
                                        setIsConfirm(true)}}>
                                        <i className="far fa-trash-alt"></i>
                                    </button> 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourierTable;
