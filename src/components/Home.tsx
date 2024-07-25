'use client'

import React,{useEffect,useState} from "react"
import axios,{AxiosError} from "axios"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"


export function Home (request:Request){
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const [isOrder,setIsOrder] = useState(false)
  const [isCart, setIsCart] = useState()

  const {toast} = useToast()

  useEffect(() => {
   
   if()
  },[])

}