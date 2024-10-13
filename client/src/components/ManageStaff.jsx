import { useEffect, useState } from 'react';
import '../styles/ManageStaff.css';
import { message } from 'antd';
import axios from 'axios';

const ManageStaff = ({id,branchId}) => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', position: 'Manager', phone: '9887744465', email: 'john@gmail.com', active: 'Y' },
    { id: 2, name: 'Jane Smith', position: 'Developer', phone: '9887744465', email: 'jane@gmail.com', active: 'Y' },
    { id: 3, name: 'Emily Johnson', position: 'Designer', phone: '9887744465', email: 'emily@gmail.com', active: 'Y' },
  ]);

  const handleRemove = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const handleUpdate = (id) => {
    alert(`Update staff with ID: ${id}`);
  };

  const handleAddStaff = () => {
    alert('Add new staff functionality');
  };

  const getAllStaff=async()=>{
    try{
      const res=await axios.post(`${host}/staff/get-staff`,{id,branchId},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.data.success){
        console.log(res.data)
      }
    }catch(error){
      console.log(error.message);
      message.error('Something went wrong');
    }
  }

  useEffect(()=>{
    getAllStaff();
  },[id,branchId]);

  return (
    <div className='top-container'>
      <div className='black-container'></div>
      <div className='main-container'>
        <h1 className='heading'>Manage Staff</h1>
      <div className='post-staff-container'>
      <div className='staff-container'>
      <span>Name</span>
      <span>Position</span>
      <span>Phone</span>
      <span>Email</span>
      <span>Actions</span>
      </div>
      {staff.map((member) => (
        <div key={member.id} className='staff-container'>
          <span>{member.name}</span>
          <span>{member.position}</span>
          <span>{member.phone}</span>
          <span>{member.email}</span>
          <span className='action-buttons'>
            <button className='update-btn' onClick={() => handleUpdate(member.id)}>Update</button>
            <button className='remove-btn' onClick={() => handleRemove(member.id)}>Remove</button>
          </span>
        </div>
      ))}
      </div>
       
     
        <button className='add-btn' onClick={handleAddStaff}>Add New Staff</button>
      </div>
    </div>
  );
};

export default ManageStaff;
