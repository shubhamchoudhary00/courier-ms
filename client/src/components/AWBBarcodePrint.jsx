import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AWBPrint.css'; // Updated print styles
import host from '../APIRoute/APIRoute';

const AWBBarcodePrint = () => {
  const params = useParams();
  const [formData, setFormData] = useState({
    transportType: '',
    modeOfTransport: '',
    courierCompanyName: '',
    courierNo: '',
    dispatchDate: '',
    accountWith: '',
    accountNo: '',
    invoiceNo: '',
    partyName: '',
    noOfBox: '',
    actualWeight: '',
    charges: '',
    currentStatus: '',
    deliveredDate: '',
    vehicleNo: '',
    boaDate: '',
    boaSubmittedToBank: '',
    shippingBillNo: '',
    shippingBillDate: '',
    shippingBillSubmittedToBank: '',
    gstRefundStatus: '',
    documents: {
      invoiceCopy: null,
      courierSlip: null,
      cargoPhoto: null,
      boa: null,
      shippingBill: null,
      courierBill: null,
      otherDocuments: [],
    },
    deliveryAddress: '',
    deliveryPersonName: '',
    deliveryPersonNumber: '',
    deliveryGst: '',
    deliveryEwayBillNo: '',
    supplierAddress: '',
    supplierPersonName: '',
    supplierPersonNumber: '',
    supplierGst: '',
    awbNo: ''
  });

  const [volumetricWeight, setVolumetricWeight] = useState(0);
  const [dimensions, setDimensions] = useState({ length: 0, breadth: 0, height: 0 });

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Function to fetch parcel details from the server
  const getParcelDetails = async () => {
    try {
      const { data } = await axios.get(`${host}/shipping/get-parcel-details/${params?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (data.success) {
        const shippingData = data.shipping;
        console.log(shippingData)
        setFormData({
          ...formData,
          ...shippingData,
          documents: {
            ...shippingData.documents,
            otherDocuments: shippingData.documents.otherDocuments || [],
          }
        });

        // Set dimensions
        if (shippingData.dimensions) {
          setDimensions({
            length: shippingData.dimensions.length || 0,
            breadth: shippingData.dimensions.breadth || 0,
            height: shippingData.dimensions.height || 0,
          });
        }
      } else {
        alert('Failed to fetch parcel details.');
      }
    } catch (error) {
      console.error('Error fetching parcel details:', error.message);
      alert('An error occurred while fetching parcel details.');
    }
  };

  // Function to calculate volumetric weight
  useEffect(() => {
    const calculateVolumetricWeight = () => {
      const { length, breadth, height } = dimensions;
      if (length && breadth && height) {
        const weight = (length * breadth * height) / 5000; // Standard formula for cm to kg
        setVolumetricWeight(weight.toFixed(2)); // Set the weight with 2 decimal precision
      }
    };

    calculateVolumetricWeight();
  }, [dimensions]);

  // Fetch parcel details on component mount
  useEffect(() => {
    getParcelDetails();
  }, [params?.id]);

  return (
    <div className="awb-container">
      {/* Button to trigger print */}
      <div className="input-section">
        <button onClick={handlePrint} className="print-button">Print AWB</button>
      </div>

      <div className="print-section">
        {/* Delivery Details */}
        <div className="delivery-details">
          <h3>Delivery Address</h3>
          <p>{formData?.deliveryAddress}</p>
          <p>Contact Person: {formData?.deliveryPersonName}</p>
          <p>Mobile No: {formData?.deliveryPersonNumber}</p>
          <p>GST No: {formData?.deliveryGst}</p>
          <p>Eway Bill No: {formData?.deliveryEwayBillNo}</p>
          <p>Invoice No: {formData?.invoiceNo}</p>
          <p>Invoice Amount: {formData?.charges}</p>
          <p>No of Box: {formData?.noOfBox}</p>
          <p>Mode of Courier: {formData?.modeOfTransport}</p>
          <p>Courier Company Name: {formData?.courierCompanyName}</p>
          <p>Courier AWB No: {formData?.awbNo}</p>
        </div>

        {/* Barcode Section */}
        <div className="barcode-section">
          {formData?.awbNo ? (
            <Barcode value={formData?.awbNo} width={1.5} height={60} displayValue={false} />
          ) : (
            <p>No AWB Number available</p>
          )}
        </div>

        {/* Box Details */}
        <div className="box-details">
          <h3>Box Dimensions</h3>
          <p>{dimensions?.length} x {dimensions?.breadth} x {dimensions?.height} (CM)</p>
          <p>Weight: {formData?.actualWeight} kg</p>
          <p>Dimension Weight: {volumetricWeight} kg</p>
        </div>

        {/* Supplier Details */}
        <div className="supplier-details">
          <h3>Supplier Address</h3>
          <p>{formData?.supplierAddress}</p>
          <p>Contact Person: {formData?.supplierPersonName}</p>
          <p>Mobile No: {formData?.supplierPersonNumber}</p>
          <p>GST No: {formData?.supplierGst}</p>
        </div>

        {/* Footer Section */}
        <p className="handle-with-care">HANDLE WITH CARE</p>
      </div>
    </div>
  );
};

export default AWBBarcodePrint;
