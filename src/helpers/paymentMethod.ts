import Stripe from "stripe";
import Razorpay from "razorpay";
import { Order } from "@/model/OrderModel";
import { NextApiResponse } from "next";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
  apiVersion:'2024-06-20',
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret:process.env.RAZORPAY_KEY_SECRET as string,
});

export async function handleCreditCardPayment(order:Order,amount:number,response:NextApiResponse){
  try {
     const stripePayment = await stripe.paymentIntents.create({
      amount,
      currency:order.payment.currency,
      payment_method: order.paymentMethod,
      confirm:true,
     })
     return response.status(200).json({
       success:true,
       payment:stripePayment,
       recipet : order._id,
     })       
  } catch (error) {
    console.error('Stripe payment error:',error)
    return response.status(404).json({
     message:'Stripe payment error',
     success:false
    })
  }
}


export async function handelUPIPayment(order:Order,amount:number,response:NextApiResponse){
  try {
    const options = {
      amount:amount*100,
      currency:order.payment.currency,
      recipet:order._id,
    };
    const payment = await razorpay.orders.create(options);
    return response.status(200).json({
     payment,
     success:true,
    })   
  } catch (error) {
    console.error('UPI payment error',error);
    return response.status(404).json({
     message:'UPI payment error',
     success:false
    })  
  }
}