import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import '../styles/Home.css';
import { message, Spin } from 'antd'; // Use Spin for loading indicator
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import Reminders from '../components/Reminders';
import { useSelector } from 'react-redux';

// Lazy load the Card component
const Card = lazy(() => import('../components/Card'));

const Home = () => {
  const [shipments, setShipments] = useState([]);
  const { user } = useSelector((state) => state.user);

  const getAllPendingShipments = async (id) => {
    try {
      const res = await axios.post(`${host}/shipping/get-all-pending-shipment`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        console.log(res.data);
        setShipments(res.data.pendingShipment);
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'User') {
        getAllPendingShipments(user?._id);
      } else if (user?.role === 'Staff') {
        getAllPendingShipments(user?.userId);
      }
    }
    console.log(shipments);
  }, [user]);

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
        <Reminders shipments={shipments} />
        
        <div className='containers'>
          <Suspense fallback={<Spin />}> {/* Suspense for lazy loading fallback */}
            {cardData.map((card, index) => (
              <Card key={index} imageUrl={card.imageUrl} count={card.count} label={card.label} />
            ))}
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
