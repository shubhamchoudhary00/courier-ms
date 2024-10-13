import AddNewStaff from "../components/AddNewStaff";
import Layout from "../components/Layout";
import ManageStaff from "../components/ManageStaff";
import TableGrid from "../components/TableGrid";
import { useState, useEffect } from "react";
import axios from "axios";
import host from "../APIRoute/APIRoute";
import { message } from "antd";
import { useSelector } from "react-redux";

const BranchStaff = () => {
  const [branches, setBranches] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true); // New loading state

  const getAllBranches = async () => {
    try {
      setLoading(true); // Set loading before fetching
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
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    getAllBranches();
  }, []);

  return (
    <Layout>
      {loading ? ( // Conditional rendering based on loading state
        <div>Loading...</div>
      ) : (
        <>
          <ManageStaff/>  
         {/*  <AddNewStaff data={branches} id={user?._id} /> */}
          <div className='main'>
            <h2>Manage Staff</h2>
            <TableGrid />
          </div>
        </>
      )}
    </Layout>
  );
};

export default BranchStaff;
