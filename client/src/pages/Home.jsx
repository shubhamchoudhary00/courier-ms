import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import '../styles/Home.css';
import { message, Spin } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import Reminders from '../components/Reminders';
import { useSelector } from 'react-redux';

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

  // Fetch branches data
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

  // Fetch parcels data
  const getParcels = async (id) => {
    try {
      const { data } = await axios.post(`${host}/shipping/get-all-shipment`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.success) {
        setParcels(data.shippings);
        calculateParcelCounts(data.shippings);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Fetch staff data
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

  // Calculate parcel counts based on status
  const calculateParcelCounts = (parcels = []) => {
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
      if (item?.item?.branch === user?.branch && user?.role==='Staff') {
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
      }else if(user?.role==='User'){
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
      }
    });

    setParcelStatusCounts(counts);
  };

  useEffect(() => {
    const userId = user?.role === 'User' ? user?._id : user?.role === 'Staff' ? user?.userId : null;
    if (userId) {
      if (user?.role === 'User') {
        getBranches(userId);
        getParcels(userId);
        getStaff(userId);
      } else if (user?.role === 'Staff') {
        getParcels(userId);
      }
    }
  }, [user]);

  // Predefined card data using API data
const cardData = useMemo(() => {
  const totalParcels = Object.values(parcelStatusCounts).reduce((acc, count) => acc + count, 0);

  const allData = [
    { imageUrl: '/images/78786.jpg', count: branch, label: 'Branches', path: '/manage-branch' },
    { imageUrl: '/images/5495.jpg', count: staff, label: 'Staff', path: '/branch-staff' },
    { imageUrl: '/images/na_january_20.jpg', count: totalParcels, label: 'Parcels', path: '/manage-parcels' }, // Updated line
    { imageUrl: '/images/8309.jpg', count: parcelStatusCounts.accepted, label: 'Accepted Parcels', path: '/accepted' },
    { imageUrl: '/images/3811498.jpg', count: parcelStatusCounts.collected, label: 'Collected Parcels', path: '/collected' },
    { imageUrl: '/images/delivery.jpg', count: parcelStatusCounts.shipped, label: 'Shipped Parcels', path: '/shipped' },
    { imageUrl: '/images/group.jpg', count: parcelStatusCounts.inTransit, label: 'In Transit', path: '/in-transit' },
    { imageUrl: '/images/reached.jpg', count: parcelStatusCounts.arrived, label: 'Arrived At Destination', path: '/arrived' },
    { imageUrl: '/images/3663652.jpg', count: parcelStatusCounts.outforDelivery, label: 'Out For Delivery', path: '/out-for-delivery' },
    { imageUrl: '/images/delivery.jpg', count: parcelStatusCounts.pickedUp, label: 'Pickup', path: '/pick-up' },
    { imageUrl: '/images/8309.jpg', count: parcelStatusCounts.delivered, label: 'Delivered', path: '/delivered' },
    { imageUrl: '/images/3686725.jpg', count: parcelStatusCounts.unsuccessful, label: 'Unsuccessful Attempt', path: '/unsuccessful' },
  ];

  return user?.role === 'Staff' ? allData.slice(2) : allData;

}, [branch, parcelStatusCounts, staff, user?.role]);

  return (
    <Layout>
      <div className='main'>
        <h2>DashBoard</h2>
        <Reminders />
        <div className='containers'>
          <Suspense fallback={<Spin />}>
            {cardData.map((card, index) => (
              <Card key={index} imageUrl={card.imageUrl} count={card.count} label={card.label} path={card.path} />
            ))}
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
