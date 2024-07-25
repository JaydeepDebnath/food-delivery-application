import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcryptjs from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (request : Request){
  await dbConnect();
  try {
     const { username,fullname,contactNumber,email,location,password} = await request.json()
     const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified:true,
     })
     if(existingUserVerifiedByUsername){
         return Response.json({
         success:false,
         message:"Username is already taken"
         },{status:400})
     }
     
     const existingUserByEmail = await UserModel.findOne({email})
     const existingUserByContactNumber = await UserModel.findOne({contactNumber})

     const verifyCode = Math.floor(100000 + Math.random()
       *900000).toString()

     if (existingUserByEmail){
        if(existingUserByEmail.isVerified){
           return Response.json({
              success:false,
              message:"User already exsists with this email"
           },{status:400})
        }else {
           const hashedPassword = await bcryptjs.hash(password,12)
           existingUserByEmail.password = hashedPassword,
           existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
           await existingUserByEmail.save();

           return Response.json({
            success:true,
            message:"Verification code updated for existing user"
            },{status:200})
        }
     }

     if(existingUserByContactNumber){
       return Response.json({
         success:false,
         message:"User already exists with this contact number"
       },{status:200})
     }

     const hashedPassword = await bcryptjs.hash(password,12)
     const expiryDate = new Date()
     expiryDate.setHours(expiryDate.getHours() + 1)

     const newUser = new UserModel({
       username,
       fullname,
       email,
       contactNumber,
       location,
       //role,
       password:hashedPassword,
       verifyCode:verifyCode,
       verifyCodeExpiry:expiryDate,
       isVerified:false,
     })

     await newUser.save()

     const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode,
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status: 500})
        }
     return Response.json({
       success:true,
       message:"User registered successfully . Please verify your email"
     },{status:200})
  } catch (error) {
    console.error('Error registering user')
    return Response.json(
     {
       success:false,
       message:"Error registering user"
     },
     {
      status:500
     }
    ) 
  }
}