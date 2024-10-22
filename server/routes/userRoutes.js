const express=require('express')
const { loginController, registerController, authController, getUserDetailsController, changePasswordController, forgotPasswordController, resetPasswordController } = require('../controllers/userController');
const authMiddleware=require('../middleware/authMiddleware');

const router=express.Router()

router.post('/login',loginController)
router.post('/register',registerController)
router.post('/getUserData',authMiddleware,authController)

router.get('/get-user-details/:id',authMiddleware,getUserDetailsController);
router.post('/change-password',authMiddleware,changePasswordController);

router.post('/forgot-password',forgotPasswordController)
router.post('/reset-password/:id',resetPasswordController)

module.exports=router