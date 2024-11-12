import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, message, Card, Spin } from 'antd';
import styles from '../styles/Tracking.module.css';
import Layout from '../components/Layout';
import host from '../APIRoute/APIRoute';
import { useNavigate } from 'react-router-dom';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcelDetails, setParcelDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveryParty, setDeliveryParty] = useState({});
  const [courier, setCourier] = useState({});
  const navigate = useNavigate();

  const handleTrack = async () => {
    if (!trackingNumber) {
      message.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${host}/shipping/get-parcel-details/${trackingNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (data.success) {
        setParcelDetails(data.shipping);
        await getPartyDetails(data.shipping.deliveryParty);
        await getCourierDetails(data.shipping.courierCompanyName);
      } else {
        message.error('Parcel not found');
        setParcelDetails(null);
      }
    } catch (error) {
      console.error(error);
      message.error('Error fetching parcel details');
    }
    setLoading(false);
  };

  const getPartyDetails = async (id) => {
    if (id) {
      try {
        const res = await axios.get(`${host}/party/get-party/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.data.success) {
          setDeliveryParty(res.data.party);
        }
      } catch (error) {
        message.error('Failed to fetch delivery party details');
      }
    }
  };

  const getCourierDetails = async (id) => {
    if (id) {
      try {
        const res = await axios.get(`${host}/courier/get-courier/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.data.success) {
          setCourier(res.data.courier);
        }
      } catch (error) {
        message.error('Failed to fetch courier company details');
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className={styles.trackingContainer}>
        <h2 className={styles.trackingTitle}>Track Your Shipment</h2>
        <div className={styles.trackingInputSection}>
          <Input
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className={styles.trackingInput}
          />
          <button className={styles.trackButton} onClick={handleTrack} disabled={loading}>
            Track
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingSpinner}>
            <Spin size="large" />
          </div>
        ) : parcelDetails ? (
          <Card className={styles.parcelDetailSection}>
            <h3 className={styles.parcelHeading}>Shipment Details</h3>
            <div className={styles.parcelInfo}>
              <div className={styles.parcelItem}>
                <strong>Status:</strong>
                <span className={`${styles.parcelStatus} ${styles[parcelDetails.currentStatus.toLowerCase().replace(/\s+/g, '-')]}`}>
                  {parcelDetails.currentStatus}
                </span>
              </div>
              <div className={styles.parcelItem}>
                <strong>Transport Type:</strong> <span>{parcelDetails.transportType || 'N/A'}</span>
              </div>
              <div className={styles.parcelItem}>
                <strong>Courier Company:</strong> <span>{courier.companyName || 'N/A'}</span>
              </div>
              <div className={styles.parcelItem}>
                <strong>AWB No:</strong> <span>{parcelDetails.awbNo || 'N/A'}</span>
              </div>
              <div className={styles.parcelItem}>
                <strong>Courier No:</strong> <span>{parcelDetails.courierNo || 'N/A'}</span>
              </div>
              <div className={styles.parcelItem}>
                <strong>Party Name:</strong> <span>{deliveryParty.companyName || 'N/A'}</span>
              </div>
              <div className={styles.parcelItem}>
                <strong>Delivery Date:</strong> <span>{parcelDetails.estimatedDelivery || 'N/A'}</span>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </Layout>
  );
};

export default Tracking;
