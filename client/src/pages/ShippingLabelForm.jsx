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

const ShippingLabelForm = () => {
  const {user}=useSelector((state)=>state.user)
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
  });

  const [volumetricWeight, setVolumetricWeight] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dimensions, setDimensions] = useState({ length: 0, breadth: 0, height: 0 });

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
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log(formData);
  
    try {
      // Create a FormData object
      const formDataToSend = new FormData();
  
      // Append regular fields
      for (const key in formData) {
        if (key === 'documents') {
          // Append document files
          for (const docKey in formData.documents) {
            const docValue = formData.documents[docKey];
  
            if (Array.isArray(docValue)) {
              // If it's an array (other documents), append each file along with docKey
              docValue.forEach((file) => {
                if (file) {
                  // Append the file directly and the associated docKey
                  formDataToSend.append(`otherDocuments`, file); // File as 'files'
                  // formDataToSend.append(`docKey_${index}`, docKey);
                }
              });
            } else if (docValue) {
              // Append non-array files directly with the docKey
              formDataToSend.append(docKey, docValue); // File as 'files'
        
            }
          }
        } else {
          formDataToSend.append(key, formData[key]); // Append other form data
        }
      }
      
      formDataToSend.append('dimensions',JSON.stringify(dimensions))
      formDataToSend.append('volumetricWeight',volumetricWeight)
      formDataToSend.append('addedBy',JSON.stringify(user))
      // for (let pair of formDataToSend.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }
      // return;
      const res = await axios.post(`${host}/shipping/create-shipping`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (res.data.success) {
        message.success('Created Shipping');
        console.log(res.data);
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  
    // setLoading(false);
  };
  
  
  

  return (
    <Layout>
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
                <Form.Select name="transportType" onChange={handleInputChange}>
                  <option>Select transport type</option>
                  <option value="courier-outgoing">COURIER OUTGOING</option>
                  <option value="courier-incoming">COURIER INCOMING</option>
                  <option value="courier-export">COURIER EXPORT</option>
                  <option value="courier-import">COURIER IMPORT</option>
                  <option value="by-hand-incoming">BY HAND INCOMING</option>
                  <option value="by-hand-outgoing">BY HAND OUTGOING</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mode of Transport</Form.Label>
                <Form.Select name="modeOfTransport" onChange={handleInputChange}>
                  <option>Select mode of transport</option>
                  <option value="by-road">BY ROAD</option>
                  <option value="by-air">BY AIR</option>
                  <option value="by-sea">BY SEA</option>
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dispatch Date</Form.Label>
                <Form.Control type="date" name="dispatchDate" onChange={handleInputChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Invoice No.</Form.Label>
                <Form.Control type="text" placeholder="Enter invoice number" name="invoiceNo" onChange={handleInputChange} />
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
                <Form.Control type="text" placeholder="Enter current status" name="currentStatus" onChange={handleInputChange} />
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

          <Button variant="primary" type="submit">Submit</Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default ShippingLabelForm;
