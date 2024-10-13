import React from 'react';
import '../styles/Reminders.css';

const ReminderItem = ({ courierNumber }) => {
  return (
    <div className='pending-item'>
      <span>There are pending documents for courier number {courierNumber}</span>
    </div>
  );
};

const Reminders = () => {
  const pendingCouriers = [
    '45758254223',
    '45758254224',
    '45758254225',
    '45758254226',
    '45758254227',
    '45758254228',
    '45758254229',
    '45758254230',
  ];

  return (
    <div className='reminder-container'>
      <div className='main-container'>
        <h2>Reminders</h2>
        <div className='pending-container'>
          {pendingCouriers.map((courierNumber, index) => (
            <ReminderItem key={index} courierNumber={courierNumber} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
