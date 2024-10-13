const express = require('express');

const { createShippingController, getAllShippingDetailsController, getAllPendingDocumentsShippingController, getShippingDetailController, modifyShippingController } = require('../controllers/shippingController');

const router = express.Router();


const multer = require('multer');

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Set the destination folder for uploads

// Create shipping label with file handling
router.post('/create-shipping', upload.fields([
    { name: 'otherDocuments', maxCount: 10 }, // Field for 'otherDocuments'
    { name: 'invoiceCopy', maxCount: 5 }, // Field for 'files'
    { name: 'courierSlip', maxCount: 5 }, // Field for 'files'
    { name: 'cargoPhoto', maxCount: 5 }, // Field for 'files'
    { name: 'boa', maxCount: 5 }, // Field for 'files'
    { name: 'courierBill', maxCount: 5 }, // Field for 'files'
    { name: 'shippingBill', maxCount: 5 }, // Field for 'files'
  ]), createShippingController);

router.post('/modify-shipping/:id', upload.fields([
    { name: 'otherDocuments', maxCount: 10 }, // Field for 'otherDocuments'
    { name: 'invoiceCopy', maxCount: 5 }, // Field for 'files'
    { name: 'courierSlip', maxCount: 5 }, // Field for 'files'
    { name: 'cargoPhoto', maxCount: 5 }, // Field for 'files'
    { name: 'boa', maxCount: 5 }, // Field for 'files'
    { name: 'courierBill', maxCount: 5 }, // Field for 'files'
    { name: 'shippingBill', maxCount: 5 }, // Field for 'files'
  ]), modifyShippingController);


router.get('/get-all-shipment',getAllShippingDetailsController)
router.get('/get-all-pending-shipment',getAllPendingDocumentsShippingController)

router.get('/get-parcel-details/:id',getShippingDetailController);


module.exports = router;
