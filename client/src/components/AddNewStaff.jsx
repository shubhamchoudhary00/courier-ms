import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AddNewStaff.css'; // Custom styles
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { message } from 'antd';
import { useSelector } from 'react-redux';

const AddNewStaff = ({ branchId, open, setOpen, update, onClose, userId }) => {
  const [active, setActive] = useState(''); // Store active state as a string ('Yes' or 'No')
  const [staffData, setStaffData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    branch: '',
  });

  const { user } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getStaffData = async () => {
    try {
      const { data } = await axios.post(`${host}/staff/get-single-staff`, { id: userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        console.log(data)
        const res = data.staff;
        setStaffData({
          id: res.userId,
          name: res.name,
          email: res.email,
          phone: res.phone,
          branch: branchId, // Ensure the branch is set
        });
        setActive(res.active); // Set active state based on response
      }
    } catch (error) {
      // console.log(error.message);
      // message.error('Something went wrong');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include the active state in staffData for submission
    const finalData = {
      ...staffData,
      active: active , // Convert active to boolean
    };

    try {
      const res = await axios.post(`${host}/staff/${update ? `update-staff/${userId}` : 'add-staff'}`, finalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        message.success(update ? 'Staff updated' : 'New Staff added');

        // Reset staff data after successful submission
        setStaffData({
          id: '',
          name: '',
          email: '',
          phone: '',
          password: '',
          branch: branchId,
        });
        setActive(''); // Reset active state
        onClose(); // Call onClose to refresh parent state and close the modal
      }
    } catch (error) {
      // console.error(error.message);
      // message.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (branchId && user?._id) {
      setStaffData((prevData) => ({
        ...prevData,
        branch: branchId,
        id: user?._id,
      }));
    }
  }, [branchId, user]);

  useEffect(() => {
    if (update && userId) {
      getStaffData();
      console.log(staffData)
    }

  }, [update, userId]);

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
          <h2 className="text-center">{update ? 'Update Staff' : 'Add New Staff'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="col">
              <div className="row mb-3"></div>
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

            <div className="col">
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
              {!update ? (
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
              ) : (
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="active" className="form-label">Active</label>
                    <select
                      className="form-control"
                      value={active ? 'Yes' :'No'}
                      onChange={(e) => setActive(e.target.value)} // Update active state
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary w-50">
                  {update ? 'Update Staff' : 'Add Staff'}
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
  );
};

export default AddNewStaff;
