'use client'

import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect,useState } from "react"
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import { useDebounce } from '@uidotdev/usehooks'

import { Button } from "@/components/ui/button"
import { 
Form,
FormField,
FormItem,
FormLabel,
FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toast } from "@/components/ui/toast"
import axios,{AxiosError} from 'axios'
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { useToast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"


export default function SignUpForm () {
  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounce(username,300)

  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      fullname:'',
      contactNumber:undefined,
      email:'',
      password:'',
      location:'',
      role:'',
    },
  });

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>
          (`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
                 
        } catch (error) {
            
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
                  axiosError.response?.data.message ?? 'Error checking username'
          );      
        }finally{
         setIsCheckingUsername(false);
       }
      }
    };
    checkUsernameUnique()
  },[debouncedUsername])

  const onSubmit = async (data:z.infer<typeof signUpSchema>)=> {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/signup`,data)
      
      toast({
        title:'Success',
        description:response.data.message,
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false);
    } catch (error) {
      console.log('Error during signup')
      const axiosError = error as AxiosError<ApiResponse>;
      let errosMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');
      toast({
        title:'Sign Up Failed',
        description:errosMessage,
        variant:'destructive'
      })
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const googleSignUpResult = await signIn('google');

    if (googleSignUpResult?.error) {
      toast({
        title: 'Google Sign-Up Error',
        description: 'Failed to sign up with Google',
        variant: 'destructive',
      });
    } else if (googleSignUpResult?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-yellow-500 to-orange-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className=" text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-black lg:text-5xl mb-6">
            Join <br/> Delis Fusion
          </h1>
          <p className="text-lg text-black mb-4">Where Flavor Meets Your Doorstep</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-yellow-600' >Username</FormLabel>
                  <Input
                    placeholder='Username'{...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin text-purple-500 " />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm mt-1 ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="fullname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-yellow-600' >Fullname</FormLabel>
                  <Input placeholder='Fullname' {...field} name="fullname" className="rounded border-2
                   border-purple-400 focus:outline-none focus:border-purple-500 px-3 py-2 mt-1" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contactNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-yellow-600' >Contact Number</FormLabel>
                  <Input placeholder='Number' {...field} name="contactNumber" className="rounded border-2
                   border-purple-400 focus:outline-none focus:border-purple-500 px-3 py-2 mt-1" />
                  <FormMessage />
                </FormItem>
              )}
            />         
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-yellow-600' >Email</FormLabel>
                  <Input placeholder='Email' {...field} name="email" className="rounded border-2 border-purple-400 focus:outline-none focus:border-purple-500 px-3 py-2 mt-1" />
                  <p className='text-sm text-gray-400 mt-1'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-yellow-600'>Password</FormLabel>
                  <Input placeholder='Password' type="password" {...field} name="password" className='rounded' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-yellow-600'>Location</FormLabel>
                  <Input placeholder='Location' {...field} name="location" className='rounded' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-full bg-purple-600
             text-white font-semibold py-3 px-6 transition duration-300 ease-in-out 
             transform hover:scale-105" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <Button
          onClick={handleGoogleSignUp}
          className="w-full rounded-full bg-red-600 text-white font-semibold py-3 px-6 transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isSubmitting}
          >
            Sign Up with Google
          </Button>
        </Form>
        <div className="text-center mt-4">
          <p className='text-gray-300'>
            Already a member?{' '}
            <Link href="/signin" className="text-blue-400 hover:text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}