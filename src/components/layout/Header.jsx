'use client';

import {CartContext} from "@/components/AppContext";
// import Bars2 from "@/components/icons/"
import ShoppingCart from "../icons/ShoppingCart";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import { useContext,useState } from "react";


function AuthLinks({status,userName}){
    if(status === 'authenticated'){
      return(
        <>
            <Link href={'/profile'} className="whitespace-nowap">
                Hello , {userName}
            </Link>
            <button
                onClick={() => signOut}
                className="bg-primary rounded-ful text-white px-8 py-2">
                Logout
            </button>
        </>
      );
    }
    if(status === 'unauthenticated'){
        return (
            <>
                <Link href={'/login'}>Login</Link>
                <Link href={'/signup'} className="bg-primary rounded-full text-white px-8 py-2" >
                    SiggnUp
                </Link>
            </>
        );
    }
}

export default function Header(){
    const session = useSession();
    const status = session?.status;
    const userData = session.data?.user;
    let userName = userData?.name || userData?.email;
    const {cartProducts} = useContext(CartContext);
    
    if(userName && userName.includes('')){
        userName = userName.split('')[0];
    }

    return (
        <header></header>
    )
}