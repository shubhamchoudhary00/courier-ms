import { useEffect, useState } from 'react';
import '../styles/Reminders.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import host from '../APIRoute/APIRoute';
import axios from 'axios';
import { message, Spin } from 'antd';

const ReminderItem = ({ courierNumber, id }) => {
  const navigate = useNavigate();
  return (
    <div className='pending-item' onClick={() => navigate(`/parcel-detail/${id}`)}>
      <span>There are pending documents for courier number {courierNumber}</span>
    </div>
  );
};

const Reminders = () => {
  const { user } = useSelector((state) => state.user);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPendingShipments = async (id) => {
    setLoading(true);
   if(id){
    try {
      const res = await axios.post(`${host}/shipping/get-all-pending-shipment`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setShipments(res.data.pendingShipment);
      } else {
        message.error('Failed to fetch pending shipments');
      }
    } catch (error) {
      // console.error('Error fetching pending shipments:', error);
      // message.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
   }
  };

  useEffect(() => {
    if (user) {
      const userId = user.role === 'User' ? user._id : user.userId;
      getAllPendingShipments(userId);
    }
  }, [user]);

  return (
    <div className='reminder-container'>
      <div className='main-containers'>
        <h2>Reminders</h2>
        <div className='pending-container'>
          {loading ? (
            <Spin tip="Loading pending shipments..." />
          ) : shipments.length === 0 ? (
            <p>No pending shipments</p>
          ) : (
            shipments.map((shipment, index) => (
              <ReminderItem key={index} courierNumber={shipment?.courierNo} id={shipment?._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
