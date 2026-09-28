import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function protect(req,res,next){try{const h=req.headers.authorization;if(!h?.startsWith("Bearer "))return res.status(401).json({success:false,message:"Authentication required"});const d=jwt.verify(h.split(" ")[1],process.env.JWT_SECRET);const user=await User.findById(d.id).select("-password");if(!user)return res.status(401).json({success:false,message:"User not found"});req.user=user;next();}catch{return res.status(401).json({success:false,message:"Invalid or expired token"});}}
export function authorize(...roles){return(req,res,next)=>{if(!roles.includes(req.user.role))return res.status(403).json({success:false,message:"Access denied"});next();};}
