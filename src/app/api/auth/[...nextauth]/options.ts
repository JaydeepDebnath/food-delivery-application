import UserModel from "@/model/UserModel";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from 'bcryptjs'


export const authOptions : NextAuthOptions = {
   providers : [
      CredentialsProvider({
        id:'credentials',
        name:"Credentials",
        credentials:{
           username:{label:"Username",type:"text"},
           email:{label:"Email",type:"text"},
           password:{label:"Password",type:"password"}
        },
        async authorize(credentials:any):Promise<any> {
           await dbConnect();
           try {
              const user = await UserModel.findOne({
                  $or:[
                  {email:credentials.identifier},
                  {username:credentials.identifier},
                  {contactNumber:credentials.identifier}
                  ],
             });
             if(!user){
             throw new Error(`User not found with this Email ${credentials.email} or Contact Number ${credentials.contactNumber}`)
             }
             if(!user.isVerified){
             throw new Error('Please verify your account before login')
             }
             const isPasswordCorrect = await bcryptjs.compare(
             credentials.password,
             user.password || '',
             );
             if(isPasswordCorrect){
             return user;
             }else {
                  throw new Error('Incorrect password')
             }
           } catch (error:any) {
                  throw new Error(error);
           }
        },
      }),
      GoogleProvider({
         clientId:process.env.GOOGLE_CLIENT_ID as string,
         clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
      }),
   ],

   callbacks:{
     async jwt ({token,user}){
       if(user){
         token._id = user._id?.toString();
         token.role = user.role,
         token.contactNumber = user.contactNumber;
         token.isVerified = user.isVerified;
         token.username = user.username;
       }
       return token;
     },
     async session({session,token}){
       if(token){
         session.user._id = token._id;
         session.user.role = token.role;
         session.user.isVerified = token.isVerified;
         session.user.username = token.username;
         session.user.contactNumber = token.contactNumber;
       }
       return session;
     },
   },
   session:{
     strategy:'jwt',
   },
   secret:process.env.NEXTAUTH_SECRET,
   pages:{
     signIn:'/signin'
   },
};