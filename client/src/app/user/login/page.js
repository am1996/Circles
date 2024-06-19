"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import WithGuest from "@/app/components/WithGuest";
import { useAuth } from "@/app/context/GlobalContext";
import { LogInUserSchema } from "@/app/Scheme/UserSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function login() {
    let { register,handleSubmit,formState: {errors},reset } = useForm({
        resolver: zodResolver(LogInUserSchema),
        mode: "all"
    });
    let router = useRouter();
    let [ErrorsList, setErrorsList] = useState([]);
    let { login } = useAuth();

    async function submitData(data) {
        data = JSON.stringify(data);
        try {
            let resp = await fetch(process.env.SERVER_URL + "user/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: data,
                mode: "cors",
            }).then(resp => resp.json());
            if (resp.errors) {
                setErrorsList([...resp.errors]);
            }
            if(resp.accesstoken) {
                login(resp.accesstoken,resp.refreshtoken);
                setErrorsList([]);
                router.push("/");
            }
            reset();
        } catch (e) {
            setErrorsList([{msg:e+"",path:"Server Error"}]);
        }

    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                <h1 className="text-3xl py-5 text-center">Login</h1>
                <form autoComplete="off" onSubmit={handleSubmit(submitData)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            E-Mail
                        </label>
                        <input {...register("email")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder="Enter Email" />
                        <label className="text-xs text-red-500">
                            {errors["email"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                if(error.path =="email")
                                    return (<p className="text-red-500" key={id}>{error.msg}</p>);
                            }) : ""}
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Password
                        </label>
                        <input {...register("password")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="Enter Password" />
                        <label className="text-xs text-red-500">
                            {errors["password"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                if (error.path == "password" || error.path == "WrongCreds")
                                    return (<p className="text-red-500" key={id}>{error.msg}</p>);
                            }) : ""}
                        </label>
                    </div>
                    <input value="login" className="btn bg-green-900 text-white p-3 cursor-pointer" type="submit" />
                </form>
            </div>
        </div>
    );
}

export default WithGuest(login);