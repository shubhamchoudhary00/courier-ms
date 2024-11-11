import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const FilterInputFields = ({ modeOfTransport, transportType }) => {
  const [field, setField] = useState({});

  const filterOut = () => {
    let newField = {};
    if ((transportType === 'COURIER OUTGOING' && modeOfTransport === 'BY ROAD') ||
        (transportType === 'COURIER INCOMING' && modeOfTransport === 'BY ROAD') ||
        (transportType === 'COURIER OUTGOING' && modeOfTransport === 'BY AIR') ||
        (transportType === 'COURIER INCOMING' && modeOfTransport === 'BY AIR')) {
      newField = {
        courierCompanyName: '',
        courierNo: '',
  
        accountWith: '',
        accountNo: '',
        
        actualWeight: '',
        charges: '',
        currentStatus: '',
        deliveredDate: '',
  
      };
    } else if ((transportType === 'COURIER EXPORT' && modeOfTransport === 'BY AIR') ||
               (transportType === 'COURIER EXPORT' && modeOfTransport === 'BY SEA')) {
      newField = {
        courierCompanyName: '',
        courierNo: '',
      
        accountWith: '',
        accountNo: '',
      
        actualWeight: '',
        charges: '',
        currentStatus: '',
        vehicleNo: '',
        boa: '',
        boaDate: '',
        boaSubmittedToBank: '',
       
      };
    } else if ((transportType === 'COURIER IMPORT' && modeOfTransport === 'BY AIR') ||
               (transportType === 'COURIER IMPORT' && modeOfTransport === 'BY SEA')) {
      newField = {
        courierCompanyName: '',
        courierNo: '',
      
        accountWith: '',
        accountNo: '',
      
        actualWeight: '',
        charges: '',
        currentStatus: '',
        vehicleNo: '',
        boaSubmittedToBank: '',
        shippingBillNo: '',
        shippingBillDate: '',
        shippingBillSubmittedToBank: '',
        gstRefundStatus: '',
      
      };
    } else if ((transportType === 'BY HAND INCOMING' && modeOfTransport === 'BY ROAD') ||
               (transportType === 'BY HAND OUTGOING' && modeOfTransport === 'BY ROAD')) {
      newField = {
        dispatchDate: '',
      
        vehicleNo: '',
       
      };
    }
    setField(newField);
  };

  useEffect(() => {
    filterOut();
  }, [transportType, modeOfTransport]);

  const handleChange = (e, key, isDocument) => {
    const { name, value } = e.target;
    setField((prevField) => {
      if (isDocument) {
        return {
          ...prevField,
          documents: {
            ...prevField.documents,
            [key]: value
          }
        };
      }
      return {
        ...prevField,
        [name]: value
      };
    });
  };

  return (
    <div>
      {Object.keys(field).map((key) => (
        typeof field[key] === 'object' && field[key] !== null ? (
          // For nested 'documents' fields
          Object.keys(field[key]).map((docKey) => (
            <Form.Group key={docKey} controlId={docKey}>
              <Form.Label>{docKey}</Form.Label>
              <Form.Control 
                type="text" 
                name={docKey}
                value={field[key][docKey] || ''} 
                onChange={(e) => handleChange(e, docKey, true)} 
              />
            </Form.Group>
          ))
        ) : (
          // For main fields
          <Form.Group key={key} controlId={key}>
            <Form.Label>{key}</Form.Label>
            <Form.Control 
              type="text" 
              name={key} 
              value={field[key] || ''} 
              onChange={handleChange} 
            />
          </Form.Group>
        )
      ))}
    </div>
  );
};

export default FilterInputFields;
