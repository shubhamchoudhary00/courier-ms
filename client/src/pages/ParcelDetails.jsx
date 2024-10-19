import  { useEffect,useRef, useState } from 'react';
import Layout from '../components/Layout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import Country from '../helpers/Country';
import '../styles/ShippingLabelForm.css';
import axios from 'axios'
import host from '../APIRoute/APIRoute';
import {message,Modal} from 'antd';
import {useSelector} from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import PdfViewer from "../helpers/PdfViewer";
import Confirmation from '../components/Confirmation';

const ParcelDetails = () => {
  const {user}=useSelector((state)=>state.user);
  const [filePreview, setFilePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileType, setFileType] = useState('');
  const [visibleInput, setVisibleInput] = useState(null); // Tracks which input is visible
  const [selectedFiles, setSelectedFiles] = useState({});  const params=useParams();
  const [isConfirm,setIsConfirm]=useState(false)
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
    awbNo:'',
    documents: {
      invoiceCopy: null,
      courierSlip: null,
      cargoPhoto: null,
      boa: null,
      shippingBill: null,
      courierBill: null,
      otherDocuments: [],
    },
      deliveryAddress:'',
      deliveryPersonName:'',
      deliveryPersonNumber:'',
      deliveryGst:'',
      deliveryEwayBillNo:'',
      supplierAddress:'',
      supplierPersonName:'',
      supplierPersonNumber:'',
      supplierGst:''
    
  });

  const [volumetricWeight, setVolumetricWeight] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dimensions, setDimensions] = useState({ length: 0, breadth: 0, height: 0 });

  const triggerFileInput = (documentType) => {
    // If a file has not been selected for the current visible input, hide the input when another is clicked
    if (!selectedFiles[visibleInput]) {
      setVisibleInput(documentType);
    }
  };

  const fileInputRefs = {
    invoiceCopy: useRef(null),
    courierSlip: useRef(null),
    cargoPhoto: useRef(null),
    boa: useRef(null),
    shippingBill: useRef(null),
    courierBill: useRef(null)
  };
  const handleRemoveFile = (documentType) => {
    const updatedFiles = { ...selectedFiles };
    delete updatedFiles[documentType];
    setSelectedFiles(updatedFiles);
    setVisibleInput(null); // Hide input once file is removed
  };

 
  
  const handleFileClick = (url) => {
    const cleanUrl = url.split('?')[0]; // Get the URL before any query parameters
    const fileExtension = cleanUrl.split('.').pop().toLowerCase(); // Extract the file extension
    setFileType(fileExtension);
    setFilePreview(url);
    setIsModalOpen(true);
};

const handleModalClose = () => {
    setIsModalOpen(false);
    setFilePreview(null);
};


  const getParcelDetails = async () => {
    try {
      const { data } = await axios.get(`${host}/shipping/get-parcel-details/${params?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (data.success) {
        // Assuming 'data.shipping' contains the necessary parcel details
        console.log(data.shipping)
        const {transportType,modeOfTransport,courierCompanyName,courierNo,dispatchDate,accountWith,accountNo,invoiceNo,partyName,noOfBox,actualWeight,
          charges,currentStatus,deliveredDate,vehicleNo,boaDate,boaSubmittedToBank,shippingBillNo,shippingBillDate,shippingBillSubmittedToBank,gstRefundStatus,
          documents,supplierAddress,supplierPersonName,awbNo,
                supplierPersonNumber,supplierGst,deliveryAddress, deliveryPersonName,deliveryPersonNumber,deliveryEwayBillNo,deliveryGst,deliveryBoxNo} = data.shipping;
  
        // Update formData with the received data
        setFormData({transportType,modeOfTransport,courierCompanyName,courierNo,dispatchDate,accountWith,accountNo,invoiceNo,partyName,
          noOfBox,actualWeight,charges,currentStatus,deliveredDate,vehicleNo,boaDate,boaSubmittedToBank,shippingBillNo,shippingBillDate,
          supplierAddress,supplierPersonName,supplierPersonNumber,supplierGst,deliveryAddress, deliveryPersonName,deliveryPersonNumber,deliveryEwayBillNo,deliveryGst,deliveryBoxNo,
          shippingBillSubmittedToBank,gstRefundStatus,awbNo,documents: {
            ...documents, // Spread the existing documents
            otherDocuments: documents.otherDocuments || [], // Ensure it's an array
          },
        });
        setSelectedCountry({label:data.shipping.country,value:data.shipping.country})
  
        // Set dimensions if available
        if (data.shipping.dimensions.length && data.shipping.dimensions.breadth && data.shipping.dimensions.height) {
          setDimensions({
            length: data.shipping.dimensions.length || 0,
            breadth: data.shipping.dimensions.breadth || 0,
            height: data.shipping.dimensions.height || 0,
          });
        }
      } else {
        message.error('Failed to fetch parcel details.'); // Handle unsuccessful response
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };
  

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions({ ...dimensions, [name]: Number(value) });
  };

  useEffect(() => {
    const divisor = selectedCountry?.value === 'India' ? 4000 : 5000;
    setVolumetricWeight((dimensions.length * dimensions.breadth * dimensions.height) / divisor);
    console.log(user);
  }, [selectedCountry, dimensions]);

const handleDocumentChange = (e) => {
  const { name, files } = e.target;

  if (files.length > 0) {
    setFormData((prevState) => ({
      ...prevState,
      documents: {
        ...prevState.documents,
        [name]: files[0],
      },
    }));

    setSelectedFiles((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  } else {
    // If no files are selected, clear the specific document
    setFormData((prevState) => ({
      ...prevState,
      documents: {
        ...prevState.documents,
        [name]: null,
      },
    }));

    setSelectedFiles((prevState) => {
      const updatedFiles = { ...prevState };
      delete updatedFiles[name];
      return updatedFiles;
    });
  }
};


  const handleOtherDocumentChange = (index, file) => {
    const updatedDocuments = [...formData.documents.otherDocuments];
    updatedDocuments[index] = file;
    setFormData((prevState) => ({
      ...prevState,
      documents: { ...prevState.documents, otherDocuments: updatedDocuments },
    }));
  };

  const addOtherDocumentInput = () => {
    setFormData((prevState) => ({
      ...prevState,
      documents: { ...prevState.documents, otherDocuments: [...prevState.documents.otherDocuments, null] },
    }));
  };

  const removeOtherDocumentInput = (index) => {
    const updatedDocuments = formData.documents.otherDocuments.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      documents: { ...prevState.documents, otherDocuments: updatedDocuments },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log(formData);

    try {
        // Create a FormData object
        const formDataToSend = new FormData();

       

        // Append form fields
        Object.keys(formData).forEach((key) => {
            if (key === 'documents') {
                // Handle document uploads
                Object.keys(formData.documents).forEach((docKey) => {
                    const docValue = formData.documents[docKey];

                    if (Array.isArray(docValue)) {
                        // If it's an array (like otherDocuments), append each file
                        docValue.forEach((file) => {
                            if (file) formDataToSend.append('otherDocuments', file);
                        });
                    } else if (docValue) {
                        // Append single files directly
                        formDataToSend.append(docKey, docValue);
                    }
                });
            
            } else {
                // Append regular fields directly
                formDataToSend.append(key, formData[key]);
            }
        });

     

        // Append additional fields that aren't part of formData
        formDataToSend.append('dimensions', JSON.stringify(dimensions));
        formDataToSend.append('country', selectedCountry?.value);
        formDataToSend.append('volumetricWeight', volumetricWeight);
        formDataToSend.append('modifiedBy', JSON.stringify(user));
     

        // Send the form data using Axios
        const { data } = await axios.post(`${host}/shipping/modify-shipping/${params?.id}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Handle response and update form state if successful
        if (data.success) {
            const {
                transportType, modeOfTransport, courierCompanyName, courierNo, dispatchDate, accountWith, accountNo, invoiceNo,
                partyName, noOfBox, actualWeight, charges, currentStatus, deliveredDate, vehicleNo, boaDate, boaSubmittedToBank,
                shippingBillNo, shippingBillDate, shippingBillSubmittedToBank, gstRefundStatus, documents, supplierAddress,supplierPersonName,
                supplierPersonNumber,supplierGst,awbNo,deliveryAddress, deliveryPersonName,deliveryPersonNumber,deliveryEwayBillNo,deliveryGst,deliveryBoxNo
            } = data.shipping;

            // Update formData state with received data
            setFormData({
                transportType, modeOfTransport, courierCompanyName, courierNo, dispatchDate, accountWith, accountNo, invoiceNo,
                partyName, noOfBox, actualWeight, charges, currentStatus, deliveredDate, vehicleNo, boaDate, boaSubmittedToBank,
                shippingBillNo, shippingBillDate, shippingBillSubmittedToBank, gstRefundStatus,
                 supplierAddress,supplierPersonName,awbNo,
                supplierPersonNumber,supplierGst,deliveryAddress, deliveryPersonName,deliveryPersonNumber,deliveryEwayBillNo,deliveryGst,deliveryBoxNo,
                documents: {
                    ...documents, // Spread existing documents
                    otherDocuments: documents.otherDocuments || [], // Ensure it's an array
                }
            });

            // Set country and dimensions
            setSelectedCountry({ label: data.shipping.country, value: data.shipping.country });
            if (data.shipping.dimensions.length && data.shipping.dimensions.breadth && data.shipping.dimensions.height) {
                setDimensions({
                    length: data.shipping.dimensions.length || 0,
                    breadth: data.shipping.dimensions.breadth || 0,
                    height: data.shipping.dimensions.height || 0,
                });
            }

            message.success('Updated Successfully');
        }
    } catch (error) {
        console.error('Error updating shipping:', error.message);
        message.error('Something went wrong');
    }

    setIsConfirm(false); // Close confirmation modal if present
};





  useEffect(()=>{
    getParcelDetails();
    },[params?.id])

    useEffect(()=>{
        console.log(formData);    
    },[handleDocumentChange])
  
  const formatDateToInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
};
  

  return (
    <Layout>
    <Confirmation isConfirm={isConfirm} onConfirm={handleSubmit} setIsConfirm={setIsConfirm} />
      <Container className="main">
        <h2 className="text-center mb-4">Shipping Details</h2>
        <Form className="form-container" onSubmit={handleSubmit}>
          <Row>
            <Col>
              <h5>Transport Details</h5>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type of Transport</Form.Label>
                <Form.Select name="transportType" onChange={handleInputChange} value={formData.transportType}>
                  <option>Select transport type</option>
                  <option value="COURIER OUTGOING">COURIER OUTGOING</option>
                  <option value="COURIER INCOMING">COURIER INCOMING</option>
                  <option value="COURIER EXPORT">COURIER EXPORT</option>
                  <option value="COURIER IMPORT">COURIER IMPORT</option>
                  <option value="BY HAND INCOMING">BY HAND INCOMING</option>
                  <option value="BY HAND OUTGOING">BY HAND OUTGOING</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mode of Transport</Form.Label>
                <Form.Select name="modeOfTransport" onChange={handleInputChange} value={formData.modeOfTransport}>
                  <option>Select mode of transport</option>
                  <option value="BY ROAD">BY ROAD</option>
                  <option value="BY AIR">BY AIR</option>
                  <option value="BY SEA">BY SEA</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Courier Company Name</Form.Label>
                <Form.Control type="text" placeholder="Enter company name" name="courierCompanyName" value={formData.courierCompanyName} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Courier No.</Form.Label>
                <Form.Control type="text" placeholder="Enter courier number" name="courierNo" value={formData.courierNo} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Dispatch Date</Form.Label>
                <Form.Control type="date" name="dispatchDate" onChange={handleInputChange} value={formatDateToInput(formData.dispatchDate) } />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Invoice No.</Form.Label>
                <Form.Control type="text" placeholder="Enter invoice number" name="invoiceNo" value={formData.invoiceNo} onChange={handleInputChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>AWB No.</Form.Label>
                <Form.Control type="text" placeholder="Enter AWB number" name="awbNo" value={formData.awbNo} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill No</Form.Label>
                <Form.Control type="text" placeholder="Shipping Bill Number" name="shippingBillNo" value={formData.shippingBillNo} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill Date</Form.Label>
                <Form.Control type="date" name="shippingBillDate" value={formatDateToInput(formData.shippingBillDate)} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill Submitted To Bank</Form.Label>
                <Form.Select name="shippingBillSubmittedToBank" value={formData.shippingBillSubmittedToBank} onChange={handleInputChange}>
                  <option>Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          

          <Row>
            <Col>
              <h5>Party Details</h5>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Account No.</Form.Label>
                <Form.Control type="text" placeholder="Enter account number" name="accountNo" value={formData.accountNo} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Account With</Form.Label>
                <Form.Control type="text" placeholder="Enter account details" name="accountWith" value={formData.accountWith} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Party Name</Form.Label>
                <Form.Control type="text" placeholder="Enter party name" name="partyName" value={formData.partyName} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  options={Country}
                  placeholder="Select or search country"
                  isSearchable
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
          <Col>
            <h5>Transport Details</h5>
          </Col>
        </Row>

        <Row>
        <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Length</Form.Label>
          <Form.Control type="text" placeholder="Enter Length" name="length" value={dimensions.length} onChange={handleDimensionChange} />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Breadth</Form.Label>
          <Form.Control type="text" placeholder="Enter Breadth" name="breadth" value={dimensions.breadth} onChange={handleDimensionChange} />
        </Form.Group>
      </Col>
        </Row>
        <Row>
        <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Height</Form.Label>
          <Form.Control type="text" placeholder="Enter Height" name="height" value={dimensions.height} onChange={handleDimensionChange} />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Volumetric Weight</Form.Label>
          <Form.Control type="text" placeholder="Enter Breadth" name="volumetricWeight" value={volumetricWeight} disabled={true} onChange={handleDimensionChange} />
        </Form.Group>
      </Col>
        </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Boxes</Form.Label>
                <Form.Control type="number" placeholder="Number of boxes" name="noOfBox" value={formData.noOfBox} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Actual Weight (kg)</Form.Label>
                <Form.Control type="number" placeholder="Actual weight" name="actualWeight" value={formData.actualWeight} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Charges</Form.Label>
                <Form.Control type="number" placeholder="Charges" name="charges" value={formData.charges} onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Current Status</Form.Label>
                <Form.Select name="currentStatus" onChange={handleInputChange}>
                <option>Select</option>
                <option value="Item Accepted By Courier">Item Accepted By Courier</option>
                <option value="Collected">Collected</option>
                <option value="Shipped">Shipped</option>
                <option value="In-Transit">In-Transit</option>
                <option value="Arrived At Destination">Arrived At Destination</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Unsuccessful Delivery Attempt">Unsuccessful Delivery Attempt</option>
              </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Delivered Date</Form.Label>
                <Form.Control type="date" name="deliveredDate" value={formatDateToInput(formData.deliveredDate)} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Vehicle No.</Form.Label>
                <Form.Control type="text" placeholder="Vehicle number" value={formData.vehicleNo} name="vehicleNo" onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>BOA Date</Form.Label>
                <Form.Control type="date" name="boaDate" value={formatDateToInput(formData.boaDate)} onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>BOA Submitted to Bank</Form.Label>
                <Form.Select name="boaSubmittedToBank" onChange={handleInputChange} value={formData.boaSubmittedToBank}>
                  <option>Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GST Refund Status</Form.Label>
                <Form.Select name="gstRefundStatus" onChange={handleInputChange} value={formData.gstRefundStatus}>
                  <option>Select</option>
                  <option value="Pending">Pending</option>
                  <option value="Processed">Processed</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
       <Row className="mb-2">
  <Col>
    <h5>Delivery Details</h5>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Delivery Address</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Enter delivery address" 
        name="deliveryAddress"  
        value={formData.deliveryAddress}
        onChange={handleInputChange} 
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Contact Person Name</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Enter Contact Person Name" 
        value={formData.deliveryPersonName}
        name="deliveryPersonName"  
        onChange={handleInputChange} 
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Contact Person Number</Form.Label>
      <Form.Control 
        type="text" 
        value={formData.deliveryPersonNumber}
        placeholder="Contact Person Number" 
        name="deliveryPersonNumber"  
        onChange={handleInputChange} 
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>GST No.</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="GST" 
        value={formData.deliveryGst}
        name="deliveryGst"  
        onChange={handleInputChange} 
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Eway Bill No.</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="E-way Bill No" 
        name="deliveryEwayBillNo"  
        value={formData.deliveryEwayBillNo}
        onChange={handleInputChange} 
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Box No</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Box No" 
        name="deliveryBoxNo"  
        value={formData.deliveryBoxNo}  // Corrected value to use delivery.boxNo
        onChange={handleInputChange} 
      />
    </Form.Group>
  </Col>
</Row>

<Row className="mb-2">
  <Col>
    <h5>Supplier Details</h5>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Delivery Address</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Enter delivery address" 
        name="supplierAddress" 
        onChange={handleInputChange} 
        value={formData?.supplierAddress}
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Contact Person Name</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Enter Contact Person Name" 
        name="supplierPersonName" 
        onChange={handleInputChange} 
        value={formData?.supplierPersonName}
      />
    </Form.Group>
  </Col>
</Row>

<Row>
  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>Contact Person Number</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="Contact Person Number" 
        name="supplierPersonNumber" 
        onChange={handleInputChange} 
        value={formData?.supplierPersonNumber}
      />
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group className="mb-2">
      <Form.Label>GST No.</Form.Label>
      <Form.Control 
        type="text" 
        placeholder="GST" 
        name="supplierGst" 
        onChange={handleInputChange} 
        value={formData?.supplierGst}
      />
    </Form.Group>
  </Col>
</Row>

        
         

          <Row>
            <Col>
              <h5>Documents</h5>
            </Col>
          </Row>

          <div className="documents-container">
  {/* Invoice Copy */}
  <div className="documents">
    <span onClick={() => handleFileClick(formData?.documents?.invoiceCopy)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Invoice Copy
    </span>
    <span>
      {formData?.documents?.invoiceCopy !== null ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>}
    </span>
    <div>
      <span onClick={() => triggerFileInput('invoiceCopy')} style={{ cursor: 'pointer' }}>
        {formData?.documents?.invoiceCopy ? 'Update' : 'Add'}
      </span>
        <div>
          <input
            ref={fileInputRefs.invoiceCopy}
            type="file"
            name="invoiceCopy"
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.invoiceCopy && (
            <div>
              <span>{selectedFiles.invoiceCopy.name}</span>
              <button onClick={() => handleRemoveFile('invoiceCopy')}>Remove</button>
            </div>
          )}
        </div>
      
    </div>
  </div>

  {/* Courier Slip */}
  <div className="documents">
    <span onClick={() => handleFileClick(formData?.documents?.courierSlip)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Courier Slip
    </span>
    <span>
      {formData?.documents?.courierSlip !== null ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>}
    </span>
    <div>
      <span onClick={() => triggerFileInput('courierSlip')} style={{ cursor: 'pointer' }}>
        {formData?.documents?.courierSlip ? 'Update' : 'Add'}
      </span>
        <div>
          <input
            ref={fileInputRefs.courierSlip}
            type="file"
            name="courierSlip"
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.courierSlip && (
            <div>
              <span>{selectedFiles.courierSlip.name}</span>
              <button onClick={() => handleRemoveFile('courierSlip')}>Remove</button>
            </div>
          )}
        </div>
    </div>
  </div>

  {/* Cargo Photo */}
  <div className="documents">
    <span onClick={() => handleFileClick(formData?.documents?.cargoPhoto)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Cargo Photo
    </span>
    <span>
      {formData?.documents?.cargoPhoto !== null ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>}
    </span>
    <div>
      <span onClick={() => triggerFileInput('cargoPhoto')} style={{ cursor: 'pointer' }}>
        {formData?.documents?.cargoPhoto ? 'Update' : 'Add'}
      </span>
        <div>
          <input
            ref={fileInputRefs.cargoPhoto}
            type="file"
            name="cargoPhoto"
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.cargoPhoto && (
            <div>
              <span>{selectedFiles.cargoPhoto.name}</span>
              <button onClick={() => handleRemoveFile('cargoPhoto')}>Remove</button>
            </div>
          )}
        </div>
    </div>
  </div>

  {/* BOA */}
  <div className="documents">
    <span onClick={() => handleFileClick(formData?.documents?.BOA)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      BOA
    </span>
    <span>
      {formData?.documents?.BOA !== null ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>}
    </span>
    <div>
      <span onClick={() => triggerFileInput('BOA')} style={{ cursor: 'pointer' }}>
        {formData?.documents?.BOA ? 'Update' : 'Add'}
      </span>
        <div>
          <input
            ref={fileInputRefs.BOA}
            type="file"
            name="BOA"
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.BOA && (
            <div>
              <span>{selectedFiles.boa.name}</span>
              <button onClick={() => handleRemoveFile('boa')}>Remove</button>
            </div>
          )}
        </div>
    </div>
  </div>

  {/* Shipping Bill */}
  <div className="documents">
    <span onClick={() => handleFileClick(formData?.documents?.shippingBill)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Shipping Bill
    </span>
    <span>
      {formData?.documents?.shippingBill !== null ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>}
    </span>
    <div>
      <span onClick={() => triggerFileInput('shippingBill')} style={{ cursor: 'pointer' }}>
        {formData?.documents?.shippingBill ? 'Update' : 'Add'}
      </span>
        <div>
          <input
            ref={fileInputRefs.shippingBill}
            type="file"
            name="shippingBill"
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.shippingBill && (
            <div>
              <span>{selectedFiles.shippingBill.name}</span>
              <button onClick={() => handleRemoveFile('shippingBill')}>Remove</button>
            </div>
          )}
        </div>
    </div>
  </div>

  {/* Courier Bill */}
  <div className="documents">
    <span onClick={() => handleFileClick(formData?.documents?.courierBill)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Courier Bill
    </span>
    <span>
      {formData?.documents?.courierBill !== null ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-xmark"></i>}
    </span>
    <div>
      <span onClick={() => triggerFileInput('courierBill')} style={{ cursor: 'pointer' }}>
        {formData?.documents?.courierBill ? 'Update' : 'Add'}
      </span>
        <div>
          <input
            ref={fileInputRefs.courierBill}
            type="file"
            name="courierBill"
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.courierBill && (
            <div>
              <span>{selectedFiles.courierBill.name}</span>
              <button onClick={() => handleRemoveFile('courierBill')}>Remove</button>
            </div>
          )}
        </div>
    </div>
  </div>
</div>

           
          

         

          <Row>
            <Col>
              <h5>Other Documents</h5>
              <Button onClick={addOtherDocumentInput} variant="link" className="p-0">Add Other Document</Button>
            </Col>
          </Row>

          {formData.documents.otherDocuments.map((doc, index) => (
            <Row key={index}>
              <Col md={11}>
                <Form.Group className="mb-3">
                  <Form.Control type="file" onChange={(e) => handleOtherDocumentChange(index, e.target.files[0])} />
                </Form.Group>
              </Col>
              <Col md={1}>
                <Button onClick={() => removeOtherDocumentInput(index)} variant="danger">Remove</Button>
              </Col>
            </Row>
          ))}
            <div style={{display:'flex',justifyContent:'space-between' ,alignItems:'center'}}>
          <div style={{display:'flex'}}>
           <Button variant="primary" onClick={()=>setIsConfirm(true)} >Update</Button>
          <Button variant="danger" ><Link to='/manage-parcels'>Cancel</Link> </Button>
          </div>
          <Button variant="success" ><Link to={`/print/${params?.id}`}>Print</Link> </Button>

          </div>

         
        </Form>

        {/* Modal for File Preview */}
            <Modal
                title="Document Preview"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="80%"
                styles={{
                    body: { height: '80vh' } // Use styles.body instead of bodyStyle
                }}
            >
                {fileType === 'pdf' ? (
                    <PdfViewer fileUrl={filePreview} />
                ) : ['png', 'jpg', 'jpeg', 'gif'].includes(fileType) ? (
                    <img
                        src={filePreview}
                        alt="Image Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h3>Preview not available for this file type.</h3>
                        <p>
                            <a href={filePreview} target="_blank" rel="noopener noreferrer">
                                Click here to download the file.
                            </a>
                        </p>
                    </div>
                )}
            </Modal>
      </Container>
    </Layout>
  );
};

export default ParcelDetails;
