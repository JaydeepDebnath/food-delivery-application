'use client'

import { useEffect,useState } from "react"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "./ui/use-toast"

export function UserProfile(){
  const [data,setData] = useState(false)
  const [loading,setLoading] = useState(true)
  const {toast} = useToast()

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/profile`)
        setData(response.data)
        setLoading(false)   
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title:'Failed to load User Profile',
          description:axiosError.response?.data.message ??
          'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } 
    
  },[])
}