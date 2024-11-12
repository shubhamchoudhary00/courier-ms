import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import '../styles/Home.css';
import { message, Spin } from 'antd';
import axios from 'axios';
import host from '../APIRoute/APIRoute';
import Reminders from '../components/Reminders';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Card = lazy(() => import('../components/Card'));

const Home = () => {
  const [parcels, setParcels] = useState([]);
  const [branch, setBranch] = useState(0);
  const [staff, setStaff] = useState(0);
  const navigate=useNavigate();
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
    if(id){
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
        // message.error(error.message);
      }
    }
    
  };

  // Fetch parcels data
  const getParcels = async (id) => {
    if(id){
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
        // message.error(error.message);
      }
    }
   
  };

  // Fetch staff data
  const getStaff = async (id) => {
    if(id){
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
        // message.error(error.message);
      }
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

  useEffect(() => {
    if (!localStorage.getItem('token')) {
        navigate('/');
    }
}, [navigate]);


  // Predefined card data using API data
const cardData = useMemo(() => {
  const totalParcels = Object.values(parcelStatusCounts).reduce((acc, count) => acc + count, 0);

  const allData = [
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F78786.jpg?alt=media&token=6cbcd3fe-c038-410a-a208-159a867fedca', count: branch, label: 'Branches', path: '/manage-branch' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F5495.jpg?alt=media&token=c52a96b4-db94-4c50-a8f8-a32bd9725b5f', count: staff, label: 'Staff', path: '/branch-staff' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Fna_january_20.jpg?alt=media&token=bee671ad-d944-4a48-a823-a574731c797f', count: totalParcels, label: 'Parcels', path: '/manage-parcels' }, // Updated line
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F8309.jpg?alt=media&token=5a47b2ee-9c8c-4b95-a688-60a88d9e054d', count: parcelStatusCounts.accepted, label: 'Accepted Parcels', path: '/accepted' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F3811498.jpg?alt=media&token=8b92270a-62ab-4d08-8f4e-4c0d14d3d3c8', count: parcelStatusCounts.collected, label: 'Collected Parcels', path: '/collected' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Fdelivery.jpg?alt=media&token=43f9baba-c9c6-4fed-b071-568170471421', count: parcelStatusCounts.shipped, label: 'Shipped Parcels', path: '/shipped' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Fgroup.jpg?alt=media&token=9e193d24-5dac-4a48-be13-c9aa6dde931e', count: parcelStatusCounts.inTransit, label: 'In Transit', path: '/in-transit' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Freached.jpg?alt=media&token=3166c20d-dd92-4b6a-ba77-b71ab97b2571', count: parcelStatusCounts.arrived, label: 'Arrived At Destination', path: '/arrived' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F3663652.jpg?alt=media&token=9da4a0ee-f1f6-41b7-8bf0-61613170f9e6', count: parcelStatusCounts.outforDelivery, label: 'Out For Delivery', path: '/out-for-delivery' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2Fdelivery.jpg?alt=media&token=43f9baba-c9c6-4fed-b071-568170471421', count: parcelStatusCounts.pickedUp, label: 'Pickup', path: '/pick-up' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F8309.jpg?alt=media&token=5a47b2ee-9c8c-4b95-a688-60a88d9e054d', count: parcelStatusCounts.delivered, label: 'Delivered', path: '/delivered' },
    { imageUrl: 'https://firebasestorage.googleapis.com/v0/b/courier-ms.appspot.com/o/images%2F3686725.jpg?alt=media&token=b28ba8ea-7354-4ecd-9d9b-139fb2b95d63', count: parcelStatusCounts.unsuccessful, label: 'Unsuccessful Attempt', path: '/unsuccessful' },
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
