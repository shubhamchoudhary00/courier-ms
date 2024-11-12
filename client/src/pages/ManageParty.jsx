import Layout from "../components/Layout";
import host from '../APIRoute/APIRoute';
import axios from 'axios';
import { message } from 'antd';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import '../styles/Home.css';
import '../styles/ManageParty.css'; // New CSS file for additional styling
import PartyTable from "../components/PartyTable";
import { useNavigate } from "react-router-dom";

const ManageParty = () => {
  const [party, setParty] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const { user } = useSelector((state) => state.user);
  const navigate=useNavigate()

  const getAllParty = async (id) => {
    try {
      const res = await axios.post(`${host}/party/get-all-party`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setParty(res.data.party);
        console.log(res.data)
      }
    } catch (error) {
      // console.log(error.message);
      // message.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (user?.role === 'User') {
      getAllParty(user?._id);
    } else if (user?.role === 'Staff') {
      getAllParty(user?.userId);
    }
  }, [trigger, user]);

  // Filtered data based on the search term
  const filteredData = party.filter((item) =>
    item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.gstNo && item.gstNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.transGstNo && item.transGstNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  useEffect(() => {
    if (!localStorage.getItem('token')) {
        navigate('/');
    }
}, [navigate]);


  return (
    <Layout>
      <div className="main">
        <h2>Manage Parties</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search by Company Name, GST No, or Trans GST No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar" // Add custom styling in CSS
        />

        <PartyTable data={searchTerm ? filteredData : party} trigger={trigger} setTrigger={setTrigger} />
      </div>
    </Layout>
  );
}

export default ManageParty;
