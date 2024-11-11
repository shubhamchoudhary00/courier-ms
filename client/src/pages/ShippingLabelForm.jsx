import  { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

import '../styles/ShippingLabelForm.css';
import axios from 'axios'
import host from '../APIRoute/APIRoute';
import {message} from 'antd';
import {useSelector} from 'react-redux'
import Confirmation from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import FilterInputFields from '../helpers/FilterInputFields';

const ShippingLabelForm = () => {
  const {user}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const [loader,setLoader]=useState(false);
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
  const [isConfirm,setIsConfirm]=useState(false)
  const [volumetricWeight, setVolumetricWeight] = useState(0);

  const [dimensions, setDimensions] = useState({ length: 0, breadth: 0, height: 0 });
  const [id,setId]=useState();
  const [transportType, setTransportType] = useState("");
  const [modeOptions, setModeOptions] = useState([]);
  const [party,setParty]=useState([])
  const [courier,setCourier]=useState([])
  const [partyOptions, setPartyOptions] = useState([]);
  const [courierOptions, setCourierOptions] = useState([]);
  const [selectedDelivery,setSelectedDelivery]=useState({});
  const [selectedSupplier,setSelectedSupplier]=useState({});
  const [selectedCourier,setSelectedCourier]=useState({});
  
  useEffect(() => {
    if (!localStorage.getItem('token')) {
        navigate('/login');
    }
}, [navigate]);


  // Update mode options based on selected transport type
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
    setFormData((prevState) => ({
      ...prevState,
      documents: {
        ...prevState.documents,
        [name]: files[0],
      },
    }));
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
    setIsConfirm(true); // Set confirmation state
    setLoader(false)
  
    try {
      // Create a FormData object
      const formDataToSend = new FormData();
  
      // Helper to append document files
      const appendDocuments = (documents) => {
        Object.keys(documents).forEach((docKey) => {
          const docValue = documents[docKey];
  
          if (Array.isArray(docValue)) {
            // For array of files (e.g., otherDocuments)
            docValue.forEach((file) => {
              if (file) formDataToSend.append('otherDocuments', file);
            });
          } else if (docValue) {
            // Append non-array files directly
            formDataToSend.append(docKey, docValue);
          }
        });
      };
  
      // Append regular form data
      Object.keys(formData).forEach((key) => {
        if (key === 'documents') {
          appendDocuments(formData.documents);
        } else {
          // Append regular fields
          formDataToSend.append(key, formData[key]);
        }
      });
  
      // Append additional fields
      formDataToSend.append('dimensions', JSON.stringify(dimensions));
      formDataToSend.append('volumetricWeight', volumetricWeight);
      formDataToSend.append('addedBy', JSON.stringify(user));
  
      // Conditionally append userId based on user role
      if (user?.role === 'User') {
        formDataToSend.append('userId', user?._id);
      } else if (user?.role === 'Staff') {
        formDataToSend.append('userId', user?.userId);
      }
  
      // Send the form data to the server
      const res = await axios.post(`${host}/shipping/create-shipping`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Handle success response
      if (res.data.success) {
        message.success('Shipping created successfully');
        const shipping = res.data.newShipping;
        // console.log(res.data)
        setId(shipping?._id); // Store the created shipping ID
      }
  
    } catch (error) {
      console.error('Error during form submission:', error.message); // Detailed error log
      message.error('Something went wrong during shipping creation.');
    } finally {
      // Reset confirmation state after the request completes
      setIsConfirm(false);
      setLoader(true)
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
        console.log(res.data)
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
    const selectedParty = courier.find((item) => item._id === selectedOption.value);
    
    if (selectedParty) {
      setSelectedCourier(selectedParty); // Set the selected party details
    }
  };

  useEffect(() => {
    if (user?.role === 'User') {
      getAllParty(user?._id);
      getAllCourier(user?._id);
    } else if (user?.role === 'Staff') {
      getAllParty(user?.userId);
      getAllCourier(user?.userId);
    }
  }, [ user]);
  
  
  

  return (
    <Layout>
    
   
    {isConfirm && <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={handleSubmit} />}
      <Container className="main">
        <h2 className="text-center mb-4">Shipping Details</h2>
        <Form className="form-container" >
          <Row>
            <Col>
              <h5>Transport Details</h5>
            </Col>
          </Row>

          <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type of Transport</Form.Label>
            <Form.Select name="transportType" onChange={handleInputChange}>
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
            <Form.Select name="modeOfTransport" value={formData.modeOfTransport} onChange={handleInputChange} disabled={!transportType}>
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
            <Form.Control type="date" name="dispatchDate" onChange={handleInputChange} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Invoice No.</Form.Label>
            <Form.Control type="text" placeholder="Enter invoice number" name="invoiceNo" onChange={handleInputChange} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>AWB No.</Form.Label>
            <Form.Control type="text" placeholder="Enter AWB number" name="awbNo" onChange={handleInputChange} />
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

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Invoice Copy</Form.Label>
                <Form.Control type="file" name="invoiceCopy" onChange={handleDocumentChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Courier Slip</Form.Label>
                <Form.Control type="file" name="courierSlip" onChange={handleDocumentChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cargo Photo</Form.Label>
                <Form.Control type="file" name="cargoPhoto" onChange={handleDocumentChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>BOA</Form.Label>
                <Form.Control type="file" name="boa" onChange={handleDocumentChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill</Form.Label>
                <Form.Control type="file" name="shippingBill" onChange={handleDocumentChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Courier Bill</Form.Label>
                <Form.Control type="file" name="courierBill" onChange={handleDocumentChange} />
              </Form.Group>
            </Col>
          </Row>

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
          {!loader && (
            <>
            <button className='btn btn-primary' onClick={(e)=>{
              e.preventDefault()
              setIsConfirm(true)
            }} >Submit</button>
            <button className='btn btn-danger' onClick={()=>navigate('/')} >Cancel</button>
            </>
         ) }

         {loader &&  
          <button className='btn btn-success' onClick={()=>navigate(`/print/${id}`)} >Print</button> }
        </Form>
      </Container>
    </Layout>
  );
};

export default ShippingLabelForm;
