'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useAuth } from "@/app/context/GlobalContext";
import png from "../../../public/Capture.PNG";
import Image from "next/image";
import { UserCircleIcon,HomeIcon, ArrowLeftStartOnRectangleIcon, PlusIcon, UserPlusIcon, ArrowLeftEndOnRectangleIcon, BellAlertIcon } from '@heroicons/react/24/solid';

export default function NavbarComponent() {
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
                <div>
                    <Link href={isAuthenticated ? "/":"/user/login"}>
                        <Image priority={false} className="px-2 inline-block" src={png} alt="my gif" height={30} />
                    </Link>
                        {
                        isAuthenticated ?
                        <>
                            <Link className="p-4 inline-block" href="/">
                                <HomeIcon className="inline-block h-[25px] w-[25px]" />
                            </Link>
                            <Link className="p-4 inline-block"  href="/user/">
                                <UserCircleIcon className="inline-block h-[25px] w-[25px]" />
                            </Link>
                            <Link href="/post/add" className="inline-block p-4">
                                <PlusIcon className="inline-block h-[25px] w-[25px]" />
                            </Link>
                            <Link href="#" onClick={logOut} className="inline-block p-4">
                                <ArrowLeftStartOnRectangleIcon className="inline-block h-[25px] w-[25px]" />
                            </Link>
                            <Link href="#" onClick={logOut} className="inline-block p-4 float-end">
                                <BellAlertIcon className="ml-auto inline-block h-[25px] w-[25px]" />
                            </Link>
                        </> 
                        :
                        <>
                            <Link className="p-4 inline-block" href="/user/register">
                                <UserPlusIcon className="inline-block h-[25px] w-[25px]" />
                            </Link>
                            <Link className="p-4 inline-block" href="/user/login">
                                <ArrowLeftEndOnRectangleIcon className="inline-block h-[25px] w-[25px]" />
                            </Link>
                        </>
                        }
                </div>
            </nav>
      </> : <></>
    );
}
