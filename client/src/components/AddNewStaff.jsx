import  { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AddNewStaff.css'; // Custom styles
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { message } from 'antd';
const AddNewStaff = ({ data,id }) => {
  const [staffData, setStaffData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    branch: '', // Add branch state here
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('New Staff Data:', staffData);

    try{
      const res=await axios.post(`${host}/staff/add-staff`,{id:staffData.id,name:staffData.name,email:staffData.email,
        phone:staffData.phone,password:staffData.password,branch:staffData.branch},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.data.success){
        message.success('New Staff added')
        console.log(res.data)
      }
    }catch(error){
      console.log(error.message);
      message.error('Something went wrong');
    }
    // Reset staff data after submission
    // setStaffData({
    //   userId: '',
    //   name: '',
    //   email: '',
    //   phone: '',
    //   password: '',
    //   branch: '', // Reset branch as well
    // });
    // onClose(); // Uncomment to close modal after submission
  };

  useEffect(()=>{
    staffData.id=id;
  },[id])
  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-center">Add New Staff</h2>
        <form onSubmit={handleSubmit}>
          <div className="col">
            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="branch" className="form-label">Branch</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  name="branch"
                  value={staffData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  {data.map((item) => (
                    <option key={item?._id} value={item?._id}>
                      {item?.branchName}/{item?.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={staffData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={staffData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className='col'>
            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={staffData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={staffData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewStaff;
