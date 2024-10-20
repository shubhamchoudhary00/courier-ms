import  { useEffect, useState } from 'react';
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
import {message} from 'antd';
import {useSelector} from 'react-redux'
import Confirmation from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';

const ShippingLabelForm = () => {
  const {user}=useSelector((state)=>state.user);
  const navigate=useNavigate()
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
    deliveryAddress:'',
      deliveryPersonName:'',
      deliveryPersonNumber:'',
      deliveryGst:'',
      deliveryEwayBillNo:'',
      supplierAddress:'',
      supplierPersonName:'',
      supplierPersonNumber:'',
      supplierGst:'',
      awbNo:''
  });
  const [isConfirm,setIsConfirm]=useState(false)
  const [volumetricWeight, setVolumetricWeight] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dimensions, setDimensions] = useState({ length: 0, breadth: 0, height: 0 });
  const [id,setId]=useState();

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
  
    const keys = name.split('.'); // Split the name to handle nested state
    setFormData((prevState) => {
      let updatedState = { ...prevState };
  
      // Use reduce to navigate through nested structure
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value; // Update the final key
        }
        return acc[key] = acc[key] || {}; // Create nested objects if they don't exist
      }, updatedState);
  
      return updatedState;
    });
  };
  
  const handleSubmit = async (e) => {
    // e.preventDefault(); // Prevent default form submission
    
    // console.log(formData);
    setIsConfirm(true); // Set confirmation state
  
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
        const shipping = res.data.shipping;
        setId(shipping?._id); // Store the created shipping ID
      }
  
    } catch (error) {
      console.error('Error during form submission:', error.message); // Detailed error log
      message.error('Something went wrong during shipping creation.');
    } finally {
      // Reset confirmation state after the request completes
      setIsConfirm(false);
    }
  };
  
  
  
  
  
  

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
                <Form.Select name="modeOfTransport" onChange={handleInputChange}>
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
                <Form.Control type="text" placeholder="Enter company name" name="courierCompanyName" onChange={handleInputChange} />
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

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill No</Form.Label>
                <Form.Control type="text" placeholder="Shipping Bill Number" name="shippingBillNo" onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill Date</Form.Label>
                <Form.Control type="date" name="shippingBillDate" onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Bill Submitted To Bank</Form.Label>
                <Form.Select name="shippingBillSubmittedToBank" onChange={handleInputChange}>
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
                <Form.Control type="text" placeholder="Enter account number" name="accountNo" onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Account With</Form.Label>
                <Form.Control type="text" placeholder="Enter account details" name="accountWith" onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Party Name</Form.Label>
                <Form.Control type="text" placeholder="Enter party name" name="partyName" onChange={handleInputChange} />
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
                <Form.Label>Charges</Form.Label>
                <Form.Control type="number" placeholder="Charges" name="charges" onChange={handleInputChange} />
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
                <Form.Control type="date" name="deliveredDate" onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Vehicle No.</Form.Label>
                <Form.Control type="text" placeholder="Vehicle number" name="vehicleNo" onChange={handleInputChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>BOA Date</Form.Label>
                <Form.Control type="date" name="boaDate" onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>BOA Submitted to Bank</Form.Label>
                <Form.Select name="boaSubmittedToBank" onChange={handleInputChange}>
                  <option>Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GST Refund Status</Form.Label>
                <Form.Select name="gstRefundStatus" onChange={handleInputChange}>
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
                  />
                </Form.Group>
              </Col>
            </Row>

         


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
          
          <button className='btn btn-primary' onClick={(e)=>{
            e.preventDefault()
            setIsConfirm(true)
          }} >Submit</button>
          <button className='btn btn-danger' onClick={()=>navigate('/')} >Cancel</button>
        </Form>
      </Container>
    </Layout>
  );
};

export default ShippingLabelForm;
