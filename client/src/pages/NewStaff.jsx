import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import host from '../APIRoute/APIRoute'; // Assuming host is defined here
import Layout from '../components/Layout';
import { useSelector } from 'react-redux';
import '../styles/NewStaff.css'
import Confirmation from '../components/Confirmation';

const NewStaff = () => {
  const [staffData, setStaffData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    branch:'',
    userId:''
  });
  const [branches, setBranches] = useState([]);
  const [active, setActive] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [errors, setErrors] = useState({});
  const {user} = useSelector((state) => state.user);
  const [isConfirm, setIsConfirm] = useState(false);

  const getBranches = async (id) => {
    try {
      const res = await axios.post(`${host}/branch/get-all-branches`, {id}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setBranches(res.data.branches);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (user?.role === 'User') {
      getBranches(user?._id);
    } else if (user?.role === 'Staff') {
      getBranches(user?.userId);
    }
  }, [user]);

  const handleChange = (e) => {
    setStaffData({
      ...staffData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' }); // Reset errors on input change
  };

  const validate = () => {
    const newErrors = {};
    if (!staffData.name) newErrors.name = 'Name is required';
    if (!staffData.email) newErrors.email = 'Email is required';
    if (!staffData.phone) newErrors.phone = 'Phone is required';
    if (!staffData.password) newErrors.password = 'Password is required';
    if (!selectedBranch) newErrors.branch = 'Branch selection is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsConfirm(true);
    try {
      const payload = { ...staffData, branch: selectedBranch, active, id: user?._id };
      const res = await axios.post(`${host}/staff/add-staff`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        message.success('Staff member added successfully!');
        setStaffData({ name: '', email: '', phone: '', password: '', branch: '' });
        setSelectedBranch('');
      }
    } catch (error) {
      message.error(error.message);
    }
    setIsConfirm(false);
  };

  return (
    <Layout>
      <div className="main">
        {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={handleSubmit} />}
        <h2>Add New Staff</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6" style={{width:'100%'}}>
              <div className="mb-3">
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
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="mb-3">
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
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="mb-3">
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
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>

            <div className="col-md-6" style={{width:'100%'}}>
              <div className="mb-3">
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
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="mb-3">
                <label htmlFor="branch" className="form-label">Branch</label>
                <select
                  className="form-control"
                  id="branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch?.branchName},{branch?.city}
                    </option>
                  ))}
                </select>
                {errors.branch && <span className="error">{errors.branch}</span>}
              </div>

              <div className="mb-3">
                <label htmlFor="active" className="form-label">Active</label>
                <select
                  className="form-control"
                  value={active ? 'Yes' : 'No'}
                  onChange={(e) => setActive(e.target.value === 'Yes')}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btns btns-primary w-50">
                  Add Staff
                </button>
                <button
                  type="button"
                  className="btns btns-danger w-50"
                  onClick={() => {}}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewStaff;
