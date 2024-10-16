import { useEffect, useState } from 'react';
import '../styles/ManageStaff.css';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import AddNewStaff from './AddNewStaff';
import Confirmation from './Confirmation';

const ManageStaff = ({ id, setOpen, open }) => {
  const [staff, setStaff] = useState([]);
  const [newStaffDialog, setNewStaffDialog] = useState(false);
  const [update, setUpdate] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const [removeId, setRemoveId] = useState();
  const [refresh, setRefresh] = useState(false); // New state to trigger refresh

  // Handle removing staff
  const handleRemove = async () => {
    setIsConfirm(true);
    try {
      const { data } = await axios.post(
        `${host}/staff/delete-staff`,
        { id: removeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (data.success) {
        message.success(data.message);
        setRefresh(prev => !prev); // Trigger a refresh after deletion
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
    setIsConfirm(false);
  };

  // Handle updating staff
  const handleUpdate = (staffId) => {
    setUserId(staffId);
    setUpdate(true);
    setNewStaffDialog(true);
  };

  // Fetch all staff members
  const getAllStaff = async () => {
    try {
      const res = await axios.post(
        `${host}/staff/get-staff`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        setStaff(res.data.staff);
      } else {
        message.error('Failed to fetch staff');
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  // To handle new staff added and refresh staff list
  const handleNewStaffAdded = () => {
    setNewStaffDialog(false);
    setUpdate(false);
    setRefresh(prev => !prev); // Trigger a refresh after adding new staff
  };

  // Call getAllStaff once on component mount and when `id` or `refresh` changes
  useEffect(() => {
    if (id) {
      getAllStaff();
    }
  }, [id, refresh]); // Remove handleNewStaffAdded from here

  return (
    open && (
      <div className="top-container">
        {isConfirm && (
          <Confirmation
            onConfirm={handleRemove}
            isConfirm={isConfirm}
            setIsConfirm={setIsConfirm}
          />
        )}
        {newStaffDialog && (
          <AddNewStaff
            open={newStaffDialog}
            branchId={id}
            setOpen={setNewStaffDialog}
            onClose={handleNewStaffAdded} // Handle dialog close and refresh staff list
            update={update} // Pass the update flag
            userId={userId} // Pass the user ID for updating
          />
        )}
        <div className="black-container" onClick={() => setOpen(false)}></div>
        <div className="main-container">
          <h1 className="heading">Manage Staff</h1>
          <div className="post-staff-container">
            <div className="staff-container" style={{background: '#0a58ca',color: 'white',fontWeight: '600'}}>
              <span>Name</span>
              <span>Phone</span>
              <span>Email</span>
              <span>Actions</span>
            </div>
            {staff.map((member) => (
              <div key={member.id} className="staff-container">
                <span>{member.name}</span>
                <span>{member.phone}</span>
                <span>{member.email}</span>
                <span className="action-buttons">
                  <i
                    className="fa-regular fa-pen-to-square"
                    title="Edit"
                    onClick={() => handleUpdate(member._id)}
                  ></i>
                  <i
                    className="fa-solid fa-trash"
                    title="Delete"
                    onClick={() => {
                      setIsConfirm(true);
                      setRemoveId(member?._id);
                    }}
                  ></i>
                </span>
              </div>
            ))}
          </div>
         <div className='btns'>
         <button
         className="btn btn-primary"
         onClick={() => {
           setUpdate(false);
           setUserId(null);
           setNewStaffDialog(true);
         }}
       >
         Add New Staff
       </button>
       <button className="btn btn-danger" onClick={() => setOpen(false)}>
         Close
       </button>
         </div>
        </div>
      </div>
    )
  );
};

export default ManageStaff;
