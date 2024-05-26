'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useAuth } from "@/app/context/GlobalContext";
import png from "../../../public/Capture.PNG";
import Image from "next/image";

export default function Navbar() {
    let {isAuthenticated,isLoading,logout,token} =useAuth();
    let Router = useRouter();
    useLayoutEffect(()=>{
    },[isAuthenticated,token,isLoading]);
    let logOut = async (e)=>{
        e.preventDefault();
        let resp = await fetch(process.env.SERVER_URL + "user/logout",{
            method: "GET",
            headers: {
                Authorization: "Bearer "+token
            }
        }).then(res=>res.json());
        logout();
        Router.refresh();
    }
    return (
        !isLoading ? 
        <>
            <nav className="bg-gray-800 text-white">
                <div className="py-4">
                    <Link href="/">
                        <Image priority={false} className="px-2 inline-block" src={png} alt="my gif" height={30} />
                    </Link>
                    <Link href="/" className="p-3">Home</Link>
                        {
                        isAuthenticated ?
                        <>
                            <Link href="/user/" className="p-3">Dashboard</Link>
                            <Link href="/post/add" className="p-3">Add Post</Link>
                            <Link href="#" onClick={logOut} className="p-3">Logout</Link>
                        </> 
                        :
                        <>
                            <Link href="/user/login" className="p-3">Login</Link>
                            <Link href="/user/register" className="p-3">Register</Link>
                        </>
                        }
                </div>
            </nav>
      </> : <></>
    );
}
