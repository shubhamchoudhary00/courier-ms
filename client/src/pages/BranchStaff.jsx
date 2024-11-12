import Layout from "../components/Layout";
import TableGrid from "../components/TableGrid";
import { useState, useEffect } from "react";
import axios from "axios";
import host from "../APIRoute/APIRoute";
import { message } from "antd";
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const BranchStaff = () => {
  const [branches, setBranches] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate=useNavigate()

  const getAllBranches = async () => {
    if(user){
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
        // console.log(error.message);
        // message.error('Something went wrong');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }
   
  };

  useEffect(() => {
    getAllBranches();
    // console.log(user)
  }, [user]);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
        navigate('/');
    }
}, [navigate]);


  return (
    <Layout>
      {loading ? ( // Conditional rendering based on loading state
        <div className="loader-container">
        <PulseLoader color="#36d7b7" />
      </div>      ) : (
        <>
          
         {/*  <AddNewStaff data={branches} id={user?._id} /> */}
          <div className='main'>
            <h2>Manage Staff</h2>
            <TableGrid data={branches} editable={false} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default BranchStaff;
