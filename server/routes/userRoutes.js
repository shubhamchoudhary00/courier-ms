const express=require('express')
const { loginController, registerController, authController, getUserDetailsController } = require('../controllers/userController');
const authMiddleware=require('../middleware/authMiddleware');

const router=express.Router()

router.post('/login',loginController)
router.post('/register',registerController)
router.post('/getUserData',authMiddleware,authController)

router.get('/get-user-details/:id',authMiddleware,getUserDetailsController)

module.exports=router