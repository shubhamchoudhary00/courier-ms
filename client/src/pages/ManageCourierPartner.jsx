import Layout from "../components/Layout";
import host from '../APIRoute/APIRoute';
import axios from 'axios';
import { message } from 'antd';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import '../styles/Home.css';
import '../styles/ManageCourierPartner.css'; // New CSS file for additional styling
import CourierTable from "../components/CourierTable";

const ManageCourierPartner = () => {
  const [courier, setCourier] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const { user } = useSelector((state) => state.user);

  const getAllCourier = async (id) => {
    try {
      const res = await axios.post(`${host}/courier/get-courier-partner`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setCourier(res.data.courier);
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (user?.role === 'User') {
      getAllCourier(user?._id);
    } else if (user?.role === 'Staff') {
      getAllCourier(user?.userId);
    }
  }, [trigger, user]);

  // Filtered data based on the search term
  const filteredData = courier.filter((item) =>
    item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.gstNo && item.gstNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.transGstNo && item.transGstNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="main">
        <h2>Manage Courier Partners</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search by Company Name, GST No, or Trans GST No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar" // Add custom styling in CSS
        />

        <CourierTable data={searchTerm ? filteredData : courier} trigger={trigger} setTrigger={setTrigger} />
      </div>
    </Layout>
  );
}

export default ManageCourierPartner;
