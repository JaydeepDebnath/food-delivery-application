import 'next-auth'
import { DefaultSession } from 'next-auth';
import { UserType } from '@/model/UserModel';

declare module 'next-auth'{
    interface User{
        _id?:string;
        isVerified?:boolean;
        role?:UserType;
        username?: string;
        contactNumber?:number;
        email?:string;
    }
    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            role?:UserType;
            username?: string;
            contactNumber?:number;
            email?:string;
        } & DefaultSession ["user"]
    }
}

declare module 'next-auth/jwt'{
    interface JWT {
        _id?:string;
        isVerified?:boolean;
        role?:UserType;
        username?: string;
        contactNumber?:number;
        email?:string;
    }
}