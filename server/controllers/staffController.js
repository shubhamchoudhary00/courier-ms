const bcryptjs=require('bcryptjs');
const userModel = require('../models/userModel');
const { messaging } = require('firebase-admin');



const addStaffController=async(req,res)=>{
    try{
        const {id,branch,name,phone,email,password}=req.body;
        console.log(req.body)
        const staff=await userModel.findOne({email:email });
        if(staff){
            return res.status(400).send({success:false,message:'Staff with same email already exists'})
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const newUser=new userModel({
            name,
            email,phone,password,
            userId:id,
            branch:branch,
            role:'Staff'
        })
        await newUser.save();
        return res.status(200).send({success:true,messaging:'Staff added successfully'});
    }catch(error){
        console.log(error.message);
        return res.status(500).send({success:false,message:'Internal Server Error'});
    }
}

const getAllStaffController=async(req,res)=>{
    try{
        const {id}=req.body;
        const staffs=await userModel.find({userId:id,role:'Staff'});
        if(!staffs){
            return res.status(404).send({success:false,message:'Staff does not exist'});
        }

        return res.status(200).send({success:true,message:'Staff fetched',staffs});

    }catch(error){
        console.log(error.message);
        return res.status(500).send({success:false,message:'Internal Server Error'})
    }
}

const getSpecificStaffController=async(req,res)=>{
    try{
        const {id,branchId}=req.body;
        const staff=await userModel.findOne({userId:id,branch:branchId,role:'Staff'});
        if(!staff){
            return res.status(404).send({success:false,message:'staff not found'});
        }
        return res.status(200).send({success:true,message:'staff fetched',staff});
    }catch(error){
        console.log(error.message);
        return res.status(500).send({success:false,message:'Internal Server Error'})
    }
}

const deleteSpecificeStaffController=async(req,res)=>{
    try{
        const {id}=req.body;
        const user=await userModel.findOne({_id:id,role:'Staff'});
        if(!user){
            return res.status(404).send({success:false,message:'Staff does not exist'})
        }
        await user.deleteOne();
        return res.status(200).send({success:true,message:'Deleted Successfully'});

    } catch(error){
        console.log(error.message);
        return res.status(500).send({success:false,message:'Internal Server Error'});
    }
}

const changeActiveStatusController=async(req,res)=>{
    try{
        const {id}=req.body;
        const staff=await userModel.findOne({_id:id});
        if(!staff){
            return res.status(404).send({success:false,message:'Staff not found'});
        }

        staff.active=!staff.active;
        await staff.save();
        return res.status(200).send({success:true,message:'Status changed successfully'});

    }catch(error){
        console.log(error.message);
        return res.status(500).send({success:false,message:'Internal Server Error'});
    }
}

module.exports={addStaffController,getAllStaffController,getSpecificStaffController,changeActiveStatusController,deleteSpecificeStaffController};