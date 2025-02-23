
"use client"
import { useAuth } from "@/app/context/Auth"
import { useRouter } from "next/navigation";

export default function (){
    const {user} = useAuth();
    const router = useRouter()
    if(!user ){
       router.push("sign-in")
    }
    return(
        <div>
            <p className="text-[32px]"> Welcome to your home page</p>
        </div>
    )
}