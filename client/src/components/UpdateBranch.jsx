import { message } from "antd"
import host from "../APIRoute/APIRoute";
import axios from "axios";
import '../styles/ManageStaff.css'
import { useEffect, useState } from "react";
const UpdateBranch = ({open,setOpen,onClose,id}) => {

  const [refresh, setRefresh] = useState(false); // New state to trigger refresh

    const [branchData,setBranchData]=useState({
        branchName:'',
        street:'',
        pincode:'',
        city:'',
        country:'',
        contactPersonName:'',
        contactPersonNumber:'',
        state:'',
        active:null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBranchData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const getBranchData=async()=>{
        if(id){
            try{
                const {data}=await axios.post(`${host}/branch/get-branch`,{id},{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(data.success){
                    message.success(data.message);
                    const res=data.branch;
                    setBranchData({
                        branchName:res.branchName,
                        street:res.street,
                        pincode:res.pincode,
                        city:res.city,
                        state:res.state,
                        country:res.country,
                        contactPersonName:res.contactPersonName,
                        contactPersonNumber:res.contactPersonNumber,
                        active:res.active
                    })
                }
    
            }catch(error){
                console.log(error.message)
                message.error('Something went wrong')
            }
        }
    }
    const handleSubmit=async()=>{
        try{
            const {data}=await axios.post(`${host}/branch/update-branch/${id}`,{branchData},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            if(data.success){
                message.success(data.message)
                const res=data.branch
                setBranchData({
                    branchName:res.branchName,
                    street:res.street,
                    pincode:res.pincode,
                    city:res.city,
                    state:res.state,
                    country:res.country,
                    contactPersonName:res.contactPersonName,
                    contactPersonNumber:res.contactPersonNumber,
                    active:res.active
                })
            }
        }catch(error){
            console.log(error.message)
            message.error('Something went wrong')
        }
    }
  
    useEffect(()=>{
      if(id){
        getBranchData()

      }
    },[id])

   
  return (
    open && (
        <div
          className="modal-overlay"
          style={{ zIndex: '9999' }}
          onClick={() => {
            setOpen(false);
            onClose(); // Call onClose when modal closes
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-center">Update Branch</h2>
            <form onSubmit={handleSubmit}>
              <div className="col">
                <div className="row mb-3"></div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Branch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="branchName"
                      name="branchName"
                      value={branchData.branchName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street"
                      value={branchData.street}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={branchData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={branchData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
  
              <div className="col">
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">Country</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="country"
                      name="country"
                      value={branchData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
               
                  <div className="row mb-3">
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">Contact Person Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactPersonName"
                        name="contactPersonName"
                        value={branchData.contactPersonName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">Contact Person Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactPersonNumber"
                        name="contactPersonNumber"
                        value={branchData.contactPersonNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
               
                  <div className="row mb-3">
                    <div className="col-12">
                      <label htmlFor="active" className="form-label">Active</label>
                      <select
                        className="form-control"
                        value={branchData.active ? 'Yes' :'No'}
                        onChange={(e) => setBranchData({active:e.target.value})} // Update active state
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                  </div>
               
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary w-50">
                    Update Branch
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger w-50"
                    onClick={() => {
                      setOpen(false);
                      onClose(); // Ensure the modal closes properly
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
  )
}

export default UpdateBranch
