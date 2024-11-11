import  { useState, useEffect } from 'react';
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
          <h3 style={{fontSize:'1.4rem'}}><strong>Delivery Address</strong></h3>
          <p><strong>Address:</strong> {formData?.deliveryAddress}</p>
          <p><strong>Contact Person:</strong> {formData?.deliveryPersonName}</p>
          <p><strong>Mobile No:</strong> {formData?.deliveryPersonNumber}</p>
          <p><strong>GST No:</strong> {formData?.deliveryGst}</p>
          <p><strong>Eway Bill No:</strong> {formData?.deliveryEwayBillNo}</p>
          <p><strong>Invoice No:</strong> {formData?.invoiceNo}</p>
          <p><strong>Invoice Amount:</strong> {formData?.charges} (in INR)</p>
          <p><strong>No of Box:</strong> {formData?.noOfBox}</p>
          <p><strong>Mode of Courier:</strong> {formData?.modeOfTransport}</p>
          <p><strong>Courier Company Name:</strong> {formData?.courierCompanyName}</p>
          <p><strong>Courier AWB No:</strong> {formData?.awbNo}</p>
        </div>

        {/* Barcode Section */}
        <div className="barcode-section">
          {formData?.awbNo ? (
          <>
           <Barcode value={formData?.awbNo} width={1.5} height={60} displayValue={false} />
            <span><strong>AWB no: </strong>{formData?.awbNo}</span>
            <span><strong>Tracking no: </strong>{formData?._id}</span>
          </>
           
          ) : (
            <p><strong>No AWB Number available</strong></p>
          )}
        </div>

        {/* Box Details */}
        <div className="box-details">
          <h3 style={{fontSize:'1.4rem'}}><strong>Box Dimensions</strong></h3>
          <p><strong>Dimensions:</strong> {dimensions?.length} x {dimensions?.breadth} x {dimensions?.height} (CM)</p>
          <p><strong>Weight:</strong> {formData?.actualWeight} kg</p>
          <p><strong>Dimension Weight:</strong> {volumetricWeight} kg</p>
        </div>

        {/* Supplier Details */}
        <div className="supplier-details">
          <h3 style={{fontSize:'1.4rem'}}><strong>Supplier Address</strong></h3>
          <p><strong>Address:</strong> {formData?.supplierAddress}</p>
          <p><strong>Contact Person:</strong> {formData?.supplierPersonName}</p>
          <p><strong>Mobile No:</strong> {formData?.supplierPersonNumber}</p>
          <p><strong>GST No:</strong> {formData?.supplierGst}</p>
        </div>

        {/* Footer Section */}
        <p className="handle-with-care"><strong>HANDLE WITH CARE</strong></p>
      </div>
    </div>
  );
};

export default AWBBarcodePrint;
