import  { useEffect,useRef, useState } from 'react';
import Layout from '../components/Layout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import FilterInputFields from '../helpers/FilterInputFields';
import '../styles/ShippingLabelForm.css';
import axios from 'axios'
import host from '../APIRoute/APIRoute';
import {message,Modal} from 'antd';
import {useSelector} from 'react-redux'
import {  useNavigate, useParams } from 'react-router-dom';
import PdfViewer from "../helpers/PdfViewer";
import Confirmation from '../components/Confirmation';

const ParcelDetails = () => {
  const {user}=useSelector((state)=>state.user);
  const navigate=useNavigate()
  const [filePreview, setFilePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileType, setFileType] = useState('');
  const [visibleInput, setVisibleInput] = useState(null); // Tracks which input is visible
  const [selectedFiles, setSelectedFiles] = useState({}); 
   const params=useParams();
  const [isConfirm,setIsConfirm]=useState(false)
  const [formData, setFormData] = useState({
    transportType: '',
    modeOfTransport: '',
    courierCompanyName: '',
    courierNo: '',
    dispatchDate: '',
    invoiceNo: '',
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
    deliveryParty:null,
      supplierParty:null,
      deliveryEwayBillNo:'',
      awbNo:''
  });
  const [transportType, setTransportType] = useState("");
  const [modeOptions, setModeOptions] = useState([]);
  const [party,setParty]=useState([])
  const [courier,setCourier]=useState([])
  const [partyOptions, setPartyOptions] = useState([]);
  const [courierOptions, setCourierOptions] = useState([]);
  const [selectedDelivery,setSelectedDelivery]=useState({});
  const [selectedSupplier,setSelectedSupplier]=useState({});
  const [selectedCourier,setSelectedCourier]=useState({});
  const [selectedDeliveryOption,setSelectedDeliveryOption]=useState({});
  const [selectedSupplierOption,setSelectedSupplierOption]=useState({});
  const [selectedCourierOption,setSelectedCourierOption]=useState({});
  

  const [volumetricWeight, setVolumetricWeight] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dimensions, setDimensions] = useState({ length: 0, breadth: 0, height: 0 });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
        navigate('/login');
    }
}, [navigate]);

  const updateModeOptions = (selectedTransportType) => {
    let options = [];
    if (selectedTransportType === "COURIER OUTGOING" || selectedTransportType === "COURIER INCOMING") {
      options = ["BY ROAD", "BY AIR"];
    } else if (selectedTransportType === "COURIER EXPORT" || selectedTransportType === "COURIER IMPORT") {
      options = ["BY AIR", "BY SEA"];
    } else if (selectedTransportType === "BY HAND INCOMING" || selectedTransportType === "BY HAND OUTGOING") {
      options = ["BY ROAD"];
    }
    setModeOptions(options);
  };
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
        const {transportType,modeOfTransport,courierCompanyName,courierNo,dispatchDate,invoiceNo,noOfBox,actualWeight,
          charges,currentStatus,deliveredDate,vehicleNo,boaDate,boaSubmittedToBank,shippingBillNo,shippingBillDate,shippingBillSubmittedToBank,gstRefundStatus,
          documents,deliveryParty,supplierParty,awbNo,
                deliveryEwayBillNo} = data.shipping;
  
        // Update formData with the received data
        setFormData({transportType,modeOfTransport,courierCompanyName,courierNo,dispatchDate,invoiceNo,
          noOfBox,actualWeight,charges,currentStatus,deliveredDate,vehicleNo,boaDate,boaSubmittedToBank,shippingBillNo,shippingBillDate,
        deliveryEwayBillNo,deliveryParty,supplierParty,
          shippingBillSubmittedToBank,gstRefundStatus,awbNo,documents: {
            ...documents, // Spread the existing documents
            otherDocuments: documents.otherDocuments || [], // Ensure it's an array
          },
        });
        setTransportType(transportType)
       
  
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
  



  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions({ ...dimensions, [name]: Number(value) });
  };

  useEffect(() => {
    const divisor = selectedDelivery?.country === 'India' ? 4000 : 5000;
    setVolumetricWeight((dimensions.length * dimensions.breadth * dimensions.height) / divisor);
    console.log(user);
  }, [selectedDelivery, dimensions]);

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

const documentTypes = [
  { key: 'invoiceCopy', label: 'Invoice Copy' },
  { key: 'courierSlip', label: 'Courier Slip' },
  { key: 'cargoPhoto', label: 'Cargo Photo' },
  { key: 'BOA', label: 'BOA' },
  { key: 'shippingBill', label: 'Shipping Bill' },
  { key: 'courierBill', label: 'Courier Bill' }
];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    const keys = name.split("."); // Split the name to handle nested state
    setFormData((prevState) => {
      const updatedState = { ...prevState };
  
      // Use reduce to navigate through nested structure
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value; // Update the final key with value
        } else {
          acc[key] = acc[key] || {}; // Create nested objects if they don't exist
        }
        return acc[key];
      }, updatedState);
  
      return updatedState;
    });
  
    // Special handling for transportType changes
    if (name === "transportType") {
      setTransportType(value);
      updateModeOptions(value); // Update mode options based on selected transport type
      setFormData((prevState) => ({ ...prevState, modeOfTransport: "" })); // Reset modeOfTransport
    }
  };

const handleSubmit = async (e) => {
    // e.preventDefault(); // Prevent default form submission
    console.log(formData);

    try {
        // Create a FormData object
        const formDataToSend = new FormData();

        // Utility function to append regular form fields
        const appendField = (key, value) => {
            if (value) formDataToSend.append(key, value);
        };

        // Append regular fields
        Object.keys(formData).forEach((key) => {
            if (key === 'documents') {
                // Handle document uploads
                Object.keys(formData.documents).forEach((docKey) => {
                    const docValue = formData.documents[docKey];

                    if (Array.isArray(docValue)) {
                        docValue.forEach((file) => file && formDataToSend.append('otherDocuments', file));
                    } else if (docValue) {
                        formDataToSend.append(docKey, docValue);
                    }
                });
            } else {
                appendField(key, formData[key]);
            }
        });

        // Append additional fields
        appendField('dimensions', JSON.stringify(dimensions));
        appendField('country', selectedCountry?.value);
        appendField('volumetricWeight', volumetricWeight);
        appendField('modifiedBy', JSON.stringify(user));

        // Send the form data using Axios
        const { data } = await axios.post(
            `${host}/shipping/modify-shipping/${params?.id}`,
            formDataToSend,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        // Handle response and update form state if successful
        if (data.success) {
            const {
                transportType, modeOfTransport, courierCompanyName, courierNo, dispatchDate, invoiceNo,
                noOfBox, actualWeight, charges, currentStatus, deliveredDate, vehicleNo, boaDate,
                boaSubmittedToBank, shippingBillNo, shippingBillDate, shippingBillSubmittedToBank,
                gstRefundStatus, documents, supplierParty, awbNo, deliveryParty, deliveryEwayBillNo,
            } = data.shipping;

            // Update formData state with received data
            setFormData({
                transportType, modeOfTransport, courierCompanyName, courierNo, dispatchDate, invoiceNo,
                noOfBox, actualWeight, charges, currentStatus, deliveredDate, vehicleNo, boaDate,
                boaSubmittedToBank, shippingBillNo, shippingBillDate, shippingBillSubmittedToBank,
                gstRefundStatus, awbNo, deliveryParty, supplierParty, deliveryEwayBillNo,
                documents: {
                    ...documents,
                    otherDocuments: documents.otherDocuments || [],
                }
            });

            // Set country and dimensions
            setSelectedCountry({ label: data.shipping.country, value: data.shipping.country });
            const { length = 0, breadth = 0, height = 0 } = data.shipping.dimensions || {};
            setDimensions({ length, breadth, height });

            message.success('Updated Successfully');
        }
    } catch (error) {
        console.error('Error updating shipping:', error.message);
        message.error('Something went wrong');
    } finally {
        setIsConfirm(false); // Close confirmation modal if present
    }
};








  
    
  const getAllParty = async (id) => {
    try {
      const res = await axios.post(`${host}/party/get-all-party`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setParty(res.data.party);
        const partyList=res.data.party;
        const formattedOptions = partyList.map((party) => ({
          value: party._id,
          label: `${party.companyName} - ${party.city || ''} - ${party.gstNo || ''}`
        }));
        setPartyOptions(formattedOptions);
        const deliverParty = partyList.find((item) => item._id === formData.deliveryParty);
        const supplyParty = partyList.find((item) => item._id === formData.supplierParty);
          console.log(deliverParty)
          console.log(supplyParty)
          if (deliverParty) {
            setSelectedDelivery(deliverParty); // Set the selected party details
            setSelectedDeliveryOption({value:deliverParty?._id,
                     label: `${deliverParty.companyName} - ${deliverParty.city || ''} - ${deliverParty.gstNo || ''}` }); // Set the selected party details
          } 
          if (supplyParty) {
            setSelectedSupplier(supplyParty); // Set the selected party details
            setSelectedSupplierOption({value:supplyParty?._id,
                     label: `${supplyParty.companyName} - ${supplyParty.city || ''} - ${supplyParty.gstNo || ''}` });
          } 
            
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };
  const getAllCourier = async (id) => {
    try {
      const res = await axios.post(`${host}/courier/get-courier-partner`, { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setCourier(res.data.courier);
        const courierList=res.data.courier;
        const formattedOptions = courierList.map((party) => ({
          value: party._id,
          label: `${party.companyName} - ${party.city || ''} - ${party.gstNo || ''}`
        }));
        setCourierOptions(formattedOptions);
         const selectedParty = courierList.find((item) => item._id === formData?.courierCompanyName);
          console.log(selectedParty)
          if (selectedParty) {
            setSelectedCourier(selectedParty); // Set the selected party details
          setSelectedCourierOption({value:selectedParty?._id,
                     label: `${selectedParty.companyName} - ${selectedParty.city || ''} - ${selectedParty.gstNo || ''}` });
          } 
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  
  const handleDeliveryChange = (selectedOption) => {
    // Update the form data with the selected party ID
    setFormData((prevData) => ({
      ...prevData,
      deliveryParty: selectedOption.value,
    }));
        setSelectedDeliveryOption(selectedOption)

  
    // Find the selected party based on the ID and set it
    const selectedParty = party.find((item) => item._id === selectedOption.value);
    
    if (selectedParty) {
      setSelectedDelivery(selectedParty); // Set the selected party details
    }
  };
  
  const handleSupplierChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      supplierParty: selectedOption.value
    }));
        setSelectedSupplierOption(selectedOption)

    const selectedParty = party.find((item) => item._id === selectedOption.value);
    
    if (selectedParty) {
      setSelectedSupplier(selectedParty); // Set the selected party details
    }
  };
  const handleCourierChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      courierCompanyName: selectedOption.value
    }));
    setSelectedCourierOption(selectedOption)
    const selectedParty = courier.find((item) => item._id === selectedOption.value);
    
    if (selectedParty) {
      setSelectedCourier(selectedParty); // Set the selected party details
    }
  };


    useEffect(()=>{
    getParcelDetails();
   
    },[params?.id,user]);

    useEffect(()=>{
      if (user?.role === 'User') {
            getAllParty(user?._id);
            getAllCourier(user?._id);
          } else if (user?.role === 'Staff') {
            getAllParty(user?.userId);
            getAllCourier(user?.userId);
          }
      },[formData])
  
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
            <Form.Select name="transportType" onChange={handleInputChange} value={formData?.transportType}>
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
            <Form.Select name="modeOfTransport" value={formData?.modeOfTransport} onChange={handleInputChange} disabled={!transportType}>
              <option>Select mode of transport</option>
              {modeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Dispatch Date</Form.Label>
            <Form.Control type="date" 
            name="dispatchDate" 
            onChange={handleInputChange}
            value={formatDateToInput(formData?.dispatchDate)} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Invoice No.</Form.Label>
            <Form.Control type="text"
             placeholder="Enter invoice number"
              name="invoiceNo"
              value={formData?.invoiceNo}
               onChange={handleInputChange} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>AWB No.</Form.Label>
            <Form.Control type="text"
             placeholder="Enter AWB number"
              name="awbNo"
              value={formData?.awbNo}
               onChange={handleInputChange} />
          </Form.Group>
        </Col>
      </Row>
      </Row>
         

        <Row>
          <Col>
            <h5>Courier Company Details</h5>
          </Col>
        </Row>
          <Row>
            <Col md={6}>
            <Form.Group className="mb-2">
            <Form.Label>Courier Company Name</Form.Label>
            <Select
              options={courierOptions}
              onChange={handleCourierChange}
              placeholder="Select or search company"
              isSearchable
                value={selectedCourierOption}
            />
          </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Courier No.</Form.Label>
                <Form.Control type="text" placeholder="Enter courier number" name="courierNo" onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
          <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Account No.</Form.Label>
            <Form.Control type="text" placeholder="Enter account number"
             name="bankAccountNo"
              value={selectedCourier?.bankAccountNo || ''}
             disabled={true} 
             />
          </Form.Group>
        </Col>
          <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Bank Name" name="bankName"
              value={selectedCourier?.bankName || ''}
             disabled={true}  />
          </Form.Group>
        </Col>
          <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>IFSC Code</Form.Label>
            <Form.Control type="text" placeholder="Enter courier number" name="ifscCode"
              value={selectedCourier?.ifscCode || ''}
             disabled={true}  />
          </Form.Group>
        </Col>
          </Row>

                
{/* Delivery Details Start*/}
          
<Row className="mb-2">
<Col>
  <h5>Delivery Details</h5>
</Col>
</Row>

<Row>
<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>Company Name</Form.Label>
<Select
  options={partyOptions}
  onChange={handleDeliveryChange}
  placeholder="Select or search company"
  isSearchable
  value={selectedDeliveryOption}
/>
</Form.Group>
</Col>

<Col md={6}>
  <Form.Group className="mb-2">
    <Form.Label>Address</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Address" 
      name="address"  
      disabled={true}
      value={selectedDelivery?.address || ''}
    />
  </Form.Group>
</Col>

</Row>

<Row>
<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>City</Form.Label>
<Form.Control 
  type="text" 
  placeholder="Enter City" 
  name="city"  
  disabled={true}
  value={selectedDelivery?.city || ''}
/>
</Form.Group>
</Col>

<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>Contact Person Name</Form.Label>
<Form.Control 
  type="text" 
  placeholder="State" 
  name="state"  
  disabled={true}
  value={selectedDelivery?.state || ''}
/>
</Form.Group>
</Col>
<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>Contact Person Name</Form.Label>
<Form.Control 
  type="text" 
  placeholder="Country" 
  name="country"  
  disabled={true}
  value={selectedDelivery?.country || ''}
/>
</Form.Group>
</Col>
</Row>

<Row>
<Col md={4}>
  <Form.Group className="mb-2">
    <Form.Label>Contact Person Name</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Contact Person Name" 
      name="personName"  
      disabled={true}
      value={selectedDelivery?.personName || ''}

    />
  </Form.Group>
</Col>
<Col md={4}>
  <Form.Group className="mb-2">
    <Form.Label>Contact Person Number</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Contact Person Number" 
      name="personNumber"  
      disabled={true}
      value={selectedDelivery?.personNo || ''}

    />
  </Form.Group>
</Col>

<Col md={4}>
  <Form.Group className="mb-2">
    <Form.Label>GST No./Trans GST No</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="GST" 
      name="deliveryGst"  
      value={selectedDelivery?.gstNo || selectedDelivery?.transGstNo  || ''}
      disabled={true}
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
      onChange={handleInputChange} 
    />
  </Form.Group>
</Col>


</Row>
{/* Delivery Details End */}


{/* Supplier Details Start */}

<Row className="mb-2">
  <Col>
    <h5>Supplier Details</h5>
  </Col>
</Row>

<Row>
<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>Company Name</Form.Label>
<Select
  options={partyOptions}
  onChange={handleSupplierChange}
  placeholder="Select or search company"
  isSearchable
  value={selectedSupplierOption}

/>
</Form.Group>
</Col>

<Col md={6}>
  <Form.Group className="mb-2">
    <Form.Label>Address</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Address" 
      name="address"  
      disabled={true}
      value={selectedSupplier?.address  || ''}
    />
  </Form.Group>
</Col>

</Row>

<Row>
<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>City</Form.Label>
<Form.Control 
  type="text" 
  placeholder="Enter City" 
  name="city"  
  disabled={true}
  value={selectedSupplier?.city || ''}
/>
</Form.Group>
</Col>

<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>Contact Person Name</Form.Label>
<Form.Control 
  type="text" 
  placeholder="State" 
  name="state"  
  disabled={true}
  value={selectedSupplier?.state || ''}
/>
</Form.Group>
</Col>
<Col md={4}>
<Form.Group className="mb-2">
<Form.Label>Contact Person Name</Form.Label>
<Form.Control 
  type="text" 
  placeholder="Country" 
  name="country"  
  disabled={true}
  value={selectedSupplier?.country || ''}
/>
</Form.Group>
</Col>
</Row>

<Row>
<Col md={4}>
  <Form.Group className="mb-2">
    <Form.Label>Contact Person Name</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Contact Person Name" 
      name="personName"  
      disabled={true}
      value={selectedSupplier?.personName || ''}

    />
  </Form.Group>
</Col>
<Col md={4}>
  <Form.Group className="mb-2">
    <Form.Label>Contact Person Number</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="Contact Person Number" 
      name="personNumber"  
      disabled={true}
      value={selectedSupplier?.personNo || ''}

    />
  </Form.Group>
</Col>

<Col md={4}>
  <Form.Group className="mb-2">
    <Form.Label>GST No./Trans GST No</Form.Label>
    <Form.Control 
      type="text" 
      placeholder="GST" 
      name="deliveryGst"  
      value={selectedSupplier?.gstNo || selectedSupplier?.transGstNo || ''}
      disabled={true}
    />
  </Form.Group>
</Col>
</Row>




{/* Supplier Details End */}

{/* Dimension Details Start */}

{!(transportType==='BY HAND OUTGOING' || transportType==='BY HAND INCOMING') &&(
              <>
                <Row>
          <Col>
            <h5>Dimensions</h5>
          </Col>
        </Row>
          <Row>
          <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Length</Form.Label>
            <Form.Control type="text" placeholder="Enter Length" name="length" onChange={handleDimensionChange} />
          </Form.Group>
        </Col>
  
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Breadth</Form.Label>
            <Form.Control type="text" placeholder="Enter Breadth" name="breadth" onChange={handleDimensionChange} />
          </Form.Group>
        </Col>
          </Row>
          <Row>
          <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Height</Form.Label>
            <Form.Control type="text" placeholder="Enter Height" name="height" onChange={handleDimensionChange} />
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
              <Form.Control type="number" placeholder="Number of boxes" name="noOfBox" onChange={handleInputChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Actual Weight (kg)</Form.Label>
              <Form.Control type="number" placeholder="Actual weight" name="actualWeight" onChange={handleInputChange} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Charges (in INR)</Form.Label>
              <Form.Control type="number" placeholder="Charges" name="charges" onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>

         
              </>
) }
        

         {/* Dimension Details End*/}
          

        

          <Row>
          <Col>
            <h5>Transport Details</h5>
          </Col>
        </Row>

        <FilterInputFields
        modeOfTransport={formData.modeOfTransport} 
        transportType={formData.transportType} 
        formData={formData}
        setFormData={setFormData}
      />
        
         

          <Row>
            <Col>
              <h5>Documents</h5>
            </Col>
          </Row>

          <div className="documents-container">
  {documentTypes.map(({ key, label }) => (
    <div className="documents" key={key}>
      <span onClick={() => handleFileClick(formData?.documents?.[key])} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
        {label}
      </span>
      <span>
        {formData?.documents?.[key] !== null ? <i className="fa-solid fa-check check-icon"></i> : <i className="fa-solid fa-xmark cross-icon"></i>}
      </span>
      <div>
        <span onClick={() => triggerFileInput(key)} style={{ cursor: 'pointer' }}>
          {formData?.documents?.[key] ? 'Update' : 'Add'}
        </span>
        <div className='handle-file'>
          <input
            ref={fileInputRefs[key]}
            type="file"
            name={key}
            onChange={handleDocumentChange}
            style={{ width: '150px' }}
          />
          {selectedFiles?.[key] && (
            <div>
              <button onClick={() => handleRemoveFile(key)}><i className="fa-solid fa-delete-left"></i></button>
            </div>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
           
           
          

         

          <Row>
            <Col>
              <h5>Other Documents</h5>
              <Button onClick={addOtherDocumentInput} variant="link" className="p-0">Add Other Document</Button>
            </Col>
          </Row>

         {formData.documents.otherDocuments.map((doc, index) => (
  <div className='documents-container' key={index}>
    <div className="documents">
      <span onClick={() => handleFileClick(doc)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
        Other Document {index + 1}
      </span>
      <span>
        {doc !== null ? <i className="fa-solid fa-check check-icon"></i> : <i className="fa-solid fa-xmark cross-icon"></i>}
      </span>
      <div>
        <span onClick={() => triggerFileInput(`otherDocument_${index}`)} style={{ cursor: 'pointer' }}>
          {doc ? 'Update' : 'Add'}
        </span>
        <div className='handle-file'>
          <input
            ref={fileInputRefs[`otherDocument_${index}`]} // Dynamic ref for other documents
            type="file"
            name={`otherDocuments_${index}`} // Dynamic name for each file input
            onChange={(e) => handleOtherDocumentChange(index, e.target.files[0])} // Handle change for each specific document
            style={{ width: '150px' }}
          />
          {selectedFiles?.[`otherDocument_${index}`] && (
            <div>
              <span>{selectedFiles[`otherDocument_${index}`].name}</span>
              <button onClick={() => handleRemoveFile(`otherDocument_${index}`)}><i className="fa-solid fa-delete-left"></i></button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
))}

            <div style={{display:'flex',justifyContent:'space-between' ,alignItems:'center'}}>
          <div style={{display:'flex'}}>
           <Button variant="primary" onClick={()=>setIsConfirm(true)} >Update</Button>
          <Button variant="danger" onClick={()=>navigate('/manage-parcels')} >Cancel</Button>
          </div>
          <Button variant="success" onClick={()=>navigate(`/print/${params?.id}`)} >Print</Button>

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
