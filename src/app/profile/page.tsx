'use client'

import { useSession } from "next-auth/react"
import { User } from "@/model/UserModel"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect,useState } from "react"
import { Toast } from "@/components/ui/toast"
import axios from "axios"
export default function ProfilePage(){
  const session = useSession()
  const toast = Toast;

  const [user,setUser] = useState<User []>([])
  const [isAdmin,setIsAdmin] = useState(false)
  const [profileFetched,setProfileFetched] = useState(false)
  const {status} = session;

  useEffect(()=>{
    if(status == 'authenticated'){
      fetchUserprofuile();
    }
  },[status])

  async function fetchUserprofuile (){
  try {
      const response = await axios.get('/api/profile');
      setUser(response.data);
      setIsAdmin(response.data.isAdmin); // Assuming isAdmin is a boolean field in User model
      setProfileFetched(true);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        status: "error",
      });
    }
  }

 async function handleProfileInfoUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await axios.put('/api/profile', formData);
      setUser(response.data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        status: "error",
      });
    }
  }

  if(status === 'loading' || !profileFetched){
   return 'Loading..'
  }

  if(status === 'unauthenticated'){
   return redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      
      {profileFetched && user && (
        <div className="flex items-center mb-4">
          {/* <div className="relative h-16 w-16 mr-4">
            <Image
              src={user.avatarUrl}
              alt="User Avatar"
              className="rounded-full"
              layout="fill"
              objectFit="cover"
            />
          </div> */}
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            {isAdmin && <p className="text-green-500">Admin</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleProfileInfoUpdate} className="mb-4">
        <label className="block mb-2">
          <span className="text-gray-700">Update Profile Information:</span>
        </label>
        <input
          type="text"
          name="username" // Adjust fields according to your UserModel
          placeholder="Username"
          className="border border-gray-300 p-2 mb-2"
          defaultValue={user?.username}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border border-gray-300 p-2 mb-2"
          defaultValue={user?.email}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
}

