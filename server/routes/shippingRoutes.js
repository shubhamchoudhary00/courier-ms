const express = require('express');

const { createShippingController, getAllShippingDetailsController, getAllPendingDocumentsShippingController, getShippingDetailController, modifyShippingController, updateStatusController, deleteParcelController, unsucessfullParcelController, accedptedParcelController, collectedParcelController, shippedParcelController, inTransitParcelController, arrivedParcelController, outForDeliveryParcelController, deliveredParcelController, pickedUpParcelController } = require('../controllers/shippingController');

const router = express.Router();
const authMiddleware=require('../middleware/authMiddleware')

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
  ]),authMiddleware, createShippingController);

router.post('/modify-shipping/:id', upload.fields([
    { name: 'otherDocuments', maxCount: 10 }, // Field for 'otherDocuments'
    { name: 'invoiceCopy', maxCount: 5 }, // Field for 'files'
    { name: 'courierSlip', maxCount: 5 }, // Field for 'files'
    { name: 'cargoPhoto', maxCount: 5 }, // Field for 'files'
    { name: 'boa', maxCount: 5 }, // Field for 'files'
    { name: 'courierBill', maxCount: 5 }, // Field for 'files'
    { name: 'shippingBill', maxCount: 5 }, // Field for 'files'
  ]),authMiddleware, modifyShippingController);


router.post('/get-all-shipment',authMiddleware,getAllShippingDetailsController)
router.post('/get-all-pending-shipment',authMiddleware,getAllPendingDocumentsShippingController)

router.get('/get-parcel-details/:id',authMiddleware,getShippingDetailController);

router.post('/update-status/:id',authMiddleware,updateStatusController);

router.delete('/delete-parcel/:id',authMiddleware,deleteParcelController);

router.post('/unsuccessful-parcel',authMiddleware,unsucessfullParcelController)

router.post('/accepted-parcel',authMiddleware,accedptedParcelController)

router.post('/collected-parcel',authMiddleware,collectedParcelController)

router.post('/shipped-parcel',authMiddleware,shippedParcelController)

router.post('/in-transit-parcel',authMiddleware,inTransitParcelController)

router.post('/arrived-parcel',authMiddleware,arrivedParcelController)

router.post('/out-for-delivery-parcel',authMiddleware,outForDeliveryParcelController)


router.post('/delivered-parcel',authMiddleware,deliveredParcelController)

router.post('/pick-up-parcel',authMiddleware,pickedUpParcelController)


module.exports = router;
