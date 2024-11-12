import TableGrid from '../components/TableGrid';
import Layout from '../components/Layout';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ManageBranch = () => {
  const [branches, setBranches] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [refresh, setRefresh] = useState(false);
  const navigate=useNavigate()

  const getAllBranches = async () => {

    if (!user) return; // Avoid API call if user is not available
    try {
  

      const { data } = await axios.post(
        `${host}/branch/get-user-specific-branches`,
        { user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.success) {
        console.log(data);
        setBranches(data.branches);
        // Cache branches in localStorage to avoid fetching the same data
      }
    } catch (error) {
      // console.log(error.message);
      // message.error('Something went wrong');
    }
  };

  const handleBranchUpdate = () => {
    // Clear cached branches and refresh data
    setRefresh((prev) => !prev); // Trigger a refresh after adding new staff
  };

  useEffect(() => {
    if (user) {
      getAllBranches();
    }
  }, [user, refresh]);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
        navigate('/');
    }
}, [navigate]);


  return (
    <Layout>
      <div className="main">
        <h2>Manage Branch</h2>
        <TableGrid data={branches} editable={true} onClose={handleBranchUpdate} />
      </div>
    </Layout>
  );
};

export default ManageBranch;
