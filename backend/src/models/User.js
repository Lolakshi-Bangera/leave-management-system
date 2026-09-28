import mongoose from "mongoose";
const balance=new mongoose.Schema({casual:{type:Number,default:12,min:0},sick:{type:Number,default:8,min:0},earned:{type:Number,default:0,min:0}},{_id:false});
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},role:{type:String,enum:["employee","admin"],default:"employee"},department:{type:String,default:"General"},joiningDate:{type:Date,default:Date.now},leaveYear:{type:Number,default:()=>new Date().getFullYear()},lastEarnedLeaveAccrualAt:{type:Date,default:Date.now},leaveBalance:{type:balance,default:()=>({})}},{timestamps:true});
export default mongoose.model("User",schema);
