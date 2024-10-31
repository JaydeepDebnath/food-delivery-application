'use client';

import axios, { AxiosError } from "axios";
import { UserProfile } from "@/components/UserProfile";
import { useParams } from "next/navigation";
import { useEffect,useState } from "react";
import { Toast, ToastAction } from "@/components/ui/toast"; 
import { useToast } from "@/components/ui/use-toast";
import { ToastClose } from "@radix-ui/react-toast";


export default function UserPage(){
    const toast = useToast()
    const [user,setUser] = useState();
    const {id} = useParams();

    useEffect(()=>{
        fetchUserData();
    },[id])

    async function fetchUserData(){
        try{
            const response = await axios.get(`/api/profile?._id=${id}`)
            setUser(response.data);
            return response.data;
        }catch(error){
            const axiosError = error as AxiosError,
            toast({
              title:'Failed to fetch categories',
              description:axiosError.message
            })
            return axiosError.message
        }
    }

    async function handleSaveButtonClick(e,data){
        e.preventDefault();
        const toast = useToast()
        try{
            const response = await axios.put('/api/profile',{
                ...data,
                _id:id
            });
            toast({
                title: 'Saving user',
                description: `User saved`,
            });
            return response.data;
        }catch (error) {
            console.error("Error saving user:", error);
        }
    }
    return (
        <section className="mt-8 mx-auto max-w-2xl">
          <div className="mt-8">
            <UserForm user={user} onSave={handleSaveButtonClick} />
          </div>
        </section>
      );
}
