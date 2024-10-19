import { useState } from "react";
import ManageStaff from "./ManageStaff";
import UpdateBranch from "./UpdateBranch";
import { message } from "antd";
import axios from "axios";
import host from "../APIRoute/APIRoute";
import Confirmation from "./Confirmation";
const TableGrid = ({data,editable,onClose}) => {
    const [id,setId]=useState();
    const [open,setOpen]=useState(false);
    const [branchOpen,setBranchOpen]=useState(false);
    const [isConfirm,setIsConfirm]=useState(false);
    // Handler for viewing an article
    const handleView = (id) => {
        setId(id);
        setOpen(!open);
    };

    // Handler for editing an article
    const handleEdit = (id) => {
        setId(id);
        setBranchOpen(!branchOpen)
    };

    // Handler for deleting an article
    const handleDelete = async() => {
        setIsConfirm(true)
       try{ 
        const {data}=await axios.delete(`${host}/branch/delete-branch/${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        });
        if(data.success){
            message.success(data.message)
        }

       }catch(error){
        message.error(error.message)
       }
       onClose();
       setIsConfirm(false)
    };

 

    return (
        <div className="container">
        {!editable && open && <ManageStaff id={id} open={open} setOpen={setOpen}/>  }
        {editable && branchOpen && <UpdateBranch id={id} open={branchOpen} setOpen={setBranchOpen} onClose={onClose} />}
        {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={handleDelete} />}
            <div className="row">
                <div className="col-12">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Branch Name</th>
                                <th scope="col">City/State/Pincode</th>
                                <th scope="col">Country</th>
                                <th scope="col">Contact Person</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Active</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data?.map((item) => (
                            <tr key={item?._id}>
                                <th scope="row">{item?.branchName}</th>
                                <td>{item?.city}/{item?.state}/{item?.pincode}</td>
                                <td>{item?.country}</td>
                                <td>{item?.contactPersonName}</td>
                                <td>{item?.contactPersonNumber}</td>
                                <td>{item?.active ? 'Yes' : 'No'}</td>
                                <td>
                                {!editable && 
                                    <button type="button" className="btn btn-primary" onClick={() => handleView(item?._id)}>
                                        <i className="far fa-eye"></i>
                                    </button>}
                                    {editable && <>
                                    <button type="button" className="btn btn-success" onClick={() => handleEdit(item?._id)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => {
                                        setId(item?._id)
                                        setIsConfirm(true)}}>
                                        <i className="far fa-trash-alt"></i>
                                    </button> </>}
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

export default TableGrid;
