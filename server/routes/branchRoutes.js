const express=require('express');
const { createBranchController, getAllBranchController, getAllBranchForUsersController } = require('../controllers/branchController');
const authMiddleware=require('../middleware/authMiddleware')

const router=express.Router();

router.post('/create-branch',authMiddleware,createBranchController);

router.post('/get-all-branch',authMiddleware,getAllBranchController);

router.post('/get-user-specific-branches',authMiddleware,getAllBranchForUsersController);

module.exports=router;
