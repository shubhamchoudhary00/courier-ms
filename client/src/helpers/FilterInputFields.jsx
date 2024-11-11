import { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";

const FilterInputFields = ({ modeOfTransport, transportType, formData, setFormData }) => {
  const [fieldConfig, setFieldConfig] = useState([]);

  // Update field configuration based on transportType and modeOfTransport
  const updateFieldConfig = () => {
    let fields = [];

    if ((transportType === 'COURIER OUTGOING' && modeOfTransport === 'BY ROAD') ||
        (transportType === 'COURIER INCOMING' && modeOfTransport === 'BY ROAD') ||
        (transportType === 'COURIER OUTGOING' && modeOfTransport === 'BY AIR') ||
        (transportType === 'COURIER INCOMING' && modeOfTransport === 'BY AIR')) {
      fields = [
       
        { name: "currentStatus", label: "Current Status", type: "select", options: [
          "Item Accepted By Courier", "Collected", "Shipped", "In-Transit", 
          "Arrived At Destination", "Out for Delivery", "Delivered", 
          "Picked Up", "Unsuccessful Delivery Attempt"
        ] },
        { name: "deliveredDate", label: "Delivered Date", type: "date" }
      ];
    } else if ((transportType === 'COURIER EXPORT' && modeOfTransport === 'BY AIR') ||
               (transportType === 'COURIER EXPORT' && modeOfTransport === 'BY SEA')) {
      fields = [
   
        { name: "currentStatus", label: "Current Status", type: "select", options: [
          "Item Accepted By Courier", "Collected", "Shipped", "In-Transit", 
          "Arrived At Destination", "Out for Delivery", "Delivered", 
          "Picked Up", "Unsuccessful Delivery Attempt"
        ] },
        { name: "deliveredDate", label: "Delivered Date", type: "date" },
        { name: "boaDate", label: "BOA Date", type: "date" },
        { name: "boaSubmittedToBank", label: "BOA Submitted to Bank", type: "select", options: ["Yes", "No"] }
       
      ];
    }

    else if (
      (transportType === 'COURIER IMPORT' && modeOfTransport === 'BY AIR') ||
      (transportType === 'COURIER IMPORT' && modeOfTransport === 'BY SEA')
    ) {
      fields = [
       
        { name: "currentStatus", label: "Current Status", type: "select", options: [
          "Item Accepted By Courier", "Collected", "Shipped", "In-Transit", 
          "Arrived At Destination", "Out for Delivery", "Delivered", 
          "Picked Up", "Unsuccessful Delivery Attempt"
        ] },
        { name: "deliveredDate", label: "Delivered Date", type: "date" },
        { name: "boaDate", label: "BOA Date", type: "date" },
        { name: "boaSubmittedToBank", label: "BOA Submitted to Bank", type: "select", options: ["Yes", "No"] },
        { name: "shippingBillNo", label: "Shipping Bill No", type: "text" },
        { name: "shippingBillDate", label: "Shipping Bill Date", type: "date" },
        { name: "shippingBillSubmittedToBank", label: "Shipping Bill Submitted to Bank", type: "select", options: ["Yes", "No"] },
        { name: "gstRefundStatus", label: "GST Refund Status", type: "select", options: ["Yes", "No"] },
      ];
     
    } else if (
      (transportType === 'BY HAND INCOMING' && modeOfTransport === 'BY ROAD') ||
      (transportType === 'BY HAND OUTGOING' && modeOfTransport === 'BY ROAD')
    ) {
      fields = [
        { name: "vehicleNo", label: "Vehicle No", type: "text" },
      
      ];
    
    }
    // Add more cases here based on transportType and modeOfTransport requirements...

    setFieldConfig(fields);
  };
  useEffect(() => {
    updateFieldConfig();
  }, [transportType, modeOfTransport]);

  // Update formData when input value changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
  };

  // Render select field
  const renderSelectField = (field) => (
    <Form.Group className="mb-3" key={field.name}>
      <Form.Label>{field.label}</Form.Label>
      <Form.Select 
        name={field.name} 
        onChange={handleInputChange} 
        value={formData[field.name] || ""}
      >
        <option>Select</option>
        {field.options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Form.Select>
    </Form.Group>
  );

  // Render text, date, or other fields
  const renderTextField = (field) => {
    const value = field.type === "date" ? formatDateToInput(formData[field.name]) : formData[field.name] || "";
    return (
      <Form.Group className="mb-3" key={field.name}>
        <Form.Label>{field.label}</Form.Label>
        <Form.Control
          type={field.type}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          name={field.name}
          onChange={handleInputChange}
          value={value}
        />
      </Form.Group>
    );
  };

  // Render each form field based on type
  const renderField = (field) => {
    if (field.type === "select") {
      return renderSelectField(field);
    } else {
      return renderTextField(field);
    }
  };

  return (
    <div>
      <Row>
        {fieldConfig.map((field, index) => (
          <Col md={6} key={index}>
            {renderField(field)}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FilterInputFields;