
const express=require('express');
const { addStaffController, deleteSpecificeStaffController, getAllStaffController, getSpecificStaffController, changeActiveStatusController } = require('../controllers/staffController');

const router=express.Router();


const authMiddleware=require('../middleware/authMiddleware')

router.post('/add-staff',authMiddleware,addStaffController);

router.post('/delete-staff',deleteSpecificeStaffController)

router.post('/get-all-staff',getAllStaffController);

router.post('/get-staff',authMiddleware,getSpecificStaffController);

router.post('/change-status',changeActiveStatusController)

module.exports=router