import TableGrid from '../components/TableGrid';
import Layout from '../components/Layout';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ManageBranch = () => {
  const [branches, setBranches] = useState([]);
  const { user } = useSelector((state) => state.user);

  const getAllBranches = async () => {
    if (!user) return; // Avoid API call if user is not available
    try {
      // Avoid unnecessary API calls by checking if branches are already loaded
      const cachedBranches = localStorage.getItem('branches');
      if (cachedBranches) {
        setBranches(JSON.parse(cachedBranches));
        return;
      }

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
        localStorage.setItem('branches', JSON.stringify(data.branches));
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    // Call API only if user is defined
    if (user) {
      getAllBranches();
    }
  }, [user]);

  return (
    <Layout>
      <div className="main">
        <h2>Manage Branch</h2>
        <TableGrid data={branches} editable={true} />
      </div>
    </Layout>
  );
};

export default ManageBranch;
