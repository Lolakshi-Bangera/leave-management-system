import {Router} from "express";
import Leave from "../models/Leave.js";
import {protect,authorize} from "../middleware/authMiddleware.js";
import {calculateDays} from "../utils/leave.js";
const router=Router();
router.get("/",protect,authorize("employee"),async(req,res,next)=>{try{const leaves=await Leave.find({employee:req.user._id}).populate("reviewedBy","name email").sort({createdAt:-1});res.json({success:true,leaves});}catch(e){next(e);}});
router.post("/",protect,authorize("employee"),async(req,res,next)=>{try{const{leaveType,startDate,endDate,reason}=req.body;if(!leaveType||!startDate||!endDate||!reason)return res.status(400).json({success:false,message:"All leave fields are required"});const days=calculateDays(startDate,endDate);if(days<=0)return res.status(400).json({success:false,message:"End date must be after start date"});const balance=req.user.leaveBalance?.[leaveType]??0;if(balance<days)return res.status(400).json({success:false,message:"Insufficient leave balance"});const overlap=await Leave.findOne({employee:req.user._id,status:{$in:["pending","approved"]},startDate:{$lte:new Date(endDate)},endDate:{$gte:new Date(startDate)}});if(overlap)return res.status(409).json({success:false,message:"You already have a leave request covering these dates"});const leave=await Leave.create({employee:req.user._id,leaveType,startDate,endDate,days,reason});res.status(201).json({success:true,leave});}catch(e){next(e);}});
router.get("/:id",protect,authorize("employee"),async(req,res,next)=>{try{const leave=await Leave.findOne({_id:req.params.id,employee:req.user._id});if(!leave)return res.status(404).json({success:false,message:"Leave request not found"});res.json({success:true,leave});}catch(e){next(e);}});
export default router;
