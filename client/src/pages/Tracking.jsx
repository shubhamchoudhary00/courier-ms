import { useState } from 'react';
import axios from 'axios';
import { Input, Button, message, Card, Spin } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import '../styles/Tracking.css';
import Layout from '../components/Layout';
import host from '../APIRoute/APIRoute';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcelDetails, setParcelDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <Layout>
      <div className="tracking-container">
        <h2 className="tracking-title">Track Your Shipment</h2>
        <div className="tracking-input-section">
          <Input
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="tracking-input"
          />
          <Button type="primary" onClick={handleTrack} loading={loading}>
            Track
          </Button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Spin size="large" />
          </div>
        ) : parcelDetails ? (
          <Card className="parcel-details-section">
            <h3 className="parcel-heading">Shipment Details</h3>
            <div className="parcel-info">
              <div className="parcel-item">
                <strong>Status:</strong>
                <span className={`parcel-status ${parcelDetails.currentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {parcelDetails.currentStatus}
                </span>
              </div>
              <div className="parcel-item">
                <strong>Courier Company:</strong> <span>{parcelDetails.courierCompanyName || 'N/A'}</span>
              </div>
              <div className="parcel-item">
                <strong>AWB No:</strong> <span>{parcelDetails.awbNo || 'N/A'}</span>
              </div>
              <div className="parcel-item">
                <strong>Courier No:</strong> <span>{parcelDetails.courierNo || 'N/A'}</span>
              </div>
              <div className="parcel-item">
                <strong>Party Name:</strong> <span>{parcelDetails.partyName || 'N/A'}</span>
              </div>
              <div className="parcel-item">
                <strong>Courier Company Name:</strong> <span>{parcelDetails.courierCompanyName || 'N/A'}</span>
              </div>
              <div className="parcel-item">
                <strong> Delivery Date:</strong> <span>{parcelDetails.estimatedDelivery || 'N/A'}</span>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </Layout>
  );
};

export default Tracking;
