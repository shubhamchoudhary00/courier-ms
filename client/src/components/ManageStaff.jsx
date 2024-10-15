import { useEffect, useState } from 'react';
import '../styles/ManageStaff.css';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import AddNewStaff from './AddNewStaff'

const ManageStaff = ({ id, setOpen, open }) => {
  const [staff, setStaff] = useState([]);
  const [newStaffDialog,setNewStaffDialog]=useState(false)

  const handleRemove = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const handleUpdate = (id) => {
    alert(`Update staff with ID: ${id}`);
  };

  const handleAddStaff = () => {
    alert('Add new staff functionality');
  };

  const getAllStaff = async () => {
    try {
      const res = await axios.post(`${host}/staff/get-staff`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setStaff(res.data.staff); // Assuming 'staff' is returned in the response
      } else {
        message.error('Failed to fetch staff');
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    getAllStaff();
  }, [id]);

  return (
    open && (
      <div className='top-container'>
      {newStaffDialog && <AddNewStaff open={newStaffDialog} branchId={id}  />}
        <div className='black-container'></div>
        <div className='main-container'>
          <h1 className='heading'>Manage Staff</h1>
          <div className='post-staff-container'>
            <div className='staff-container'>
              <span>Name</span>
              <span>Phone</span>
              <span>Email</span>
              <span>Actions</span>
            </div>
            {staff.map((member) => (
              <div key={member.id} className='staff-container'>
                <span>{member.name}</span>
                <span>{member.phone}</span>
                <span>{member.email}</span>
                <span className='action-buttons'>
                  <button className='update-btn' onClick={() => handleUpdate(member.id)}>Update</button>
                  <button className='remove-btn' onClick={() => handleRemove(member.id)}>Remove</button>
                </span>
              </div>
            ))}
          </div>
          <button className='add-btn' onClick={()=>setNewStaffDialog(true)}>Add New Staff</button>
          <button className='primary' onClick={() => setOpen(false)}>Close</button>
        </div>
      </div>
    )
  );
};

export default ManageStaff;
