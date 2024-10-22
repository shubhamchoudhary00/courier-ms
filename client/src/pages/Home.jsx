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
  const [parcels, setParcels] = useState([]);
  const [branch, setBranch] = useState(0);
  const [staff, setStaff] = useState(0);
  const [parcelStatusCounts, setParcelStatusCounts] = useState({
    accepted: 0,
    collected: 0,
    shipped: 0,
    inTransit: 0,
    arrived: 0,
    outforDelivery: 0,
    delivered: 0,
    pickedUp: 0,
    unsuccessful: 0,
  });

  const { user } = useSelector((state) => state.user);

  const getBranches = async (id) => {
    try {
      const { data } = await axios.get(`${host}/branch/get-stats/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        setBranch(data.totalBranches);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getParcels = async (id) => {
    try {
      const { data } = await axios.post(`${host}/shipping/get-all-shipment`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        console.log(data)
        setParcels(data.shippings);
        calculateParcelCounts(data.shippings);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getStaff = async (id) => {
    try {
      const { data } = await axios.get(`${host}/staff/get-stats/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        setStaff(data.totalStaffs);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const calculateParcelCounts = (parcels = []) => {
    console.log(parcels)
    const counts = {
      accepted: 0,
      collected: 0,
      shipped: 0,
      inTransit: 0,
      arrived: 0,
      outforDelivery: 0,
      delivered: 0,
      pickedUp: 0,
      unsuccessful: 0
    };

    parcels.forEach(item => {
      switch (item?.item?.currentStatus) {
        case 'Item Accepted By Courier':
          counts.accepted++;
          break;
        case 'Collected':
          counts.collected++;
          break;
        case 'Shipped':
          counts.shipped++;
          break;
        case 'In-Transit':
          counts.inTransit++;
          break;
        case 'Arrived At Destination':
          counts.arrived++;
          break;
        case 'Out for Delivery':
          counts.outforDelivery++;
          break;
        case 'Delivered':
          counts.delivered++;
          break;
        case 'Picked Up':
          counts.pickedUp++;
          break;
        case 'Unsuccessful Delivery Attempt':
          counts.unsuccessful++;
          break;
        default:
          break;
      }
    });

    setParcelStatusCounts(counts);
  };

  useEffect(() => {
    const userId = user?.role === 'User' ? user?._id : user?.role === 'Staff' ? user?.userId : null;
    if (userId) {
      getBranches(userId);
      getParcels(userId);
      getStaff(userId);
    }
  }, [user]);

  // Predefined card data using API data
  const cardData = useMemo(() => [
    { imageUrl: '/images/78786.jpg', count: branch, label: 'Branches' },
    { imageUrl: '/images/na_january_20.jpg', count: parcels.length, label: 'Parcels' },
    { imageUrl: '/images/5495.jpg', count: staff, label: 'Staff' },
    { imageUrl: '/images/8309.jpg', count: parcelStatusCounts.accepted, label: 'Accepted Parcels' },
    { imageUrl: '/images/3811498.jpg', count: parcelStatusCounts.collected, label: 'Collected Parcels' },
    { imageUrl: '/images/delivery.jpg', count: parcelStatusCounts.shipped, label: 'Shipped Parcels' },
    { imageUrl: '/images/group.jpg', count: parcelStatusCounts.inTransit, label: 'In Transit' },
    { imageUrl: '/images/reached.jpg', count: parcelStatusCounts.arrived, label: 'Arrived At Destination' },
    { imageUrl: '/images/3663652.jpg', count: parcelStatusCounts.outforDelivery, label: 'Out For Delivery' },
    { imageUrl: '/images/delivery.jpg', count: parcelStatusCounts.pickedUp, label: 'Ready To Pickup' },
    { imageUrl: '/images/8309.jpg', count: parcelStatusCounts.delivered, label: 'Delivered' },
    { imageUrl: '/images/3686725.jpg', count: parcelStatusCounts.pickedUp, label: 'Picked Up' },
  ], [branch, parcels, staff, parcelStatusCounts]);

  return (
    <Layout>
      <div className='main'>
        <h2>Home</h2>
        <Reminders />
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
