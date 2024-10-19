import  { useState } from 'react';
import axios from 'axios';
import { Input, Button, message } from 'antd';
import '../styles/Tracking.css'; // Assuming you will add custom styling here
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

      {parcelDetails && (
        <div className="parcel-details-section">
          <h2 className="parcel-heading">Parcel Details</h2>
          <div className="parcel-info">
            <div className="parcel-item">
              <strong>Status:</strong>
              <span className={`parcel-status ${parcelDetails?.currentStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                {parcelDetails.currentStatus}
              </span>
            </div>
            <div className="parcel-item">
              <strong>Courier Company:</strong>
              <span>{parcelDetails.courierCompanyName || 'N/A'}</span>
            </div>
            <div className="parcel-item">
              <strong>AWB No:</strong>
              <span>{parcelDetails.awbNo || 'N/A'}</span>
            </div>
            <div className="parcel-item">
              <strong>Courier No:</strong>
              <span>{parcelDetails.courierNo || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
    
  );
};

export default Tracking;
