import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; // For prop validation
import '../styles/Reminders.css';
import { useNavigate } from 'react-router-dom';

const ReminderItem = ({ courierNumber, id }) => {
  const navigate = useNavigate();
  
  return (
    <div className='pending-item' onClick={() => navigate(`/parcel-detail/${id}`)}>
      <span>There are pending documents for courier number {courierNumber}</span>
    </div>
  );
};

const Reminders = ({ shipments = [] }) => {
  useEffect(()=>{
    console.log(shipments)
  },[shipments])
  return (
    <div className='reminder-container'>
      <div className='main-container'>
        <h2>Reminders</h2>
        <div className='pending-container'>
          {shipments.length === 0 ? (
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

// Prop validation for the Reminders component
Reminders.propTypes = {
  shipments: PropTypes.arrayOf(
    PropTypes.shape({
      courierNo: PropTypes.string,
      _id: PropTypes.string,
    })
  ),
};

export default Reminders;
