"use client";
import { useState, useRef, useContext } from "react";
import { useRouter } from 'next/navigation';
import WithGuest from "@/app/components/WithGuest";
import { useAuth } from "@/app/context/GlobalContext";

function login() {
    let router = useRouter();
    let formComponent = useRef();
    let [errors, setErrors] = useState([]);
    let {login} = useAuth();

    async function submitData(e) {
        e.preventDefault();
        
        try {
            let formdata = new FormData(formComponent.current);
            let data = JSON.stringify({
                email: formdata.get("email"),
                password: formdata.get("password"),
            });
            let resp = await fetch(process.env.SERVER_URL + "user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
                mode: "cors",
            }).then(resp => resp.json());
            if (resp.errors) {
                setErrors([...resp.errors]);
            }
            if(resp.accesstoken) {
                login(resp.accesstoken,resp.refreshtoken);
                setErrors([]);
                router.push("/");
            }
            formComponent.current.reset();
        } catch (e) {
            setErrors([{msg:e+"",path:"Server Error"}]);
        }

    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                <h1 className="text-3xl py-5 text-center">Login</h1>
                <form ref={formComponent} onSubmit={submitData}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            E-Mail
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder="Enter Email" />
                        {errors.length > 0 ? errors.map((error, id) => {
                            if(error.path =="email")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="Enter Password" />
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "password")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <input value="login" className="btn bg-green-900 text-white p-3 cursor-pointer" type="submit" />
                </form>
            </div>
        </div>
    );
}

export default WithGuest(login);