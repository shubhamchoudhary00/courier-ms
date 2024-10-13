import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import '../styles/Home.css';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import Reminders from '../components/Reminders';

const Card = ({ imageUrl, count, label }) => {
  return (
    <div className='sub-containers' style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className='sub-details d-flex'>
        <span>{count}</span>
        <span>{label}</span>
      </div>
    </div>
  );
};

const Home = () => {
  const [shipments, setShipments] = useState([]);

  const getAllPendingShipments = async () => {
    try {
      const res = await axios.get(`${host}/shipping/get-all-pending-shipment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        console.log(res.data);
        setShipments(res.data.pendingShipments);
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    getAllPendingShipments();
  }, []);

  // Predefined card data
  const cardData = useMemo(() => [
    { imageUrl: '/images/78786.jpg', count: 3, label: 'Branches' },
    { imageUrl: '/images/na_january_20.jpg', count: 3, label: 'Parcels' },
    { imageUrl: '/images/5495.jpg', count: 3, label: 'Staff' },
    { imageUrl: '/images/8309.jpg', count: 3, label: 'Accepted Parcels' },
    { imageUrl: '/images/3811498.jpg', count: 3, label: 'Collected Parcels' },
    { imageUrl: '/images/delivery.jpg', count: 3, label: 'Shipped Parcels' },
    { imageUrl: '/images/group.jpg', count: 3, label: 'In Transit' },
    { imageUrl: '/images/reached.jpg', count: 3, label: 'Arrived At Destination' },
    { imageUrl: '/images/3663652.jpg', count: 3, label: 'Out For Delivery' },
    { imageUrl: '/images/delivery.jpg', count: 3, label: 'Ready To Pickup' },
    { imageUrl: '/images/8309.jpg', count: 3, label: 'Delivered' },
    { imageUrl: '/images/3686725.jpg', count: 3, label: 'Picked Up' },
  ], []);

  return (
    <Layout>
      <div className='main'>
        <h2>Home</h2>
        <Reminders />
        <div className='containers'>
          {cardData.map((card, index) => (
            <Card key={index} imageUrl={card.imageUrl} count={card.count} label={card.label} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
