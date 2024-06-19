"use client";
import { useState } from "react";
import WithGuest from "@/app/components/WithGuest"; import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema } from "@/app/Scheme/UserSchema";

function register() {
    let { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(RegisterUserSchema),
        mode: "all"
    });
    let [ErrorsList, setErrorsList] = useState([]);
    let [message, setMessage] = useState("");

    async function submitData(data) {
        try {
            data = JSON.stringify(data);
            let resp = await fetch(process.env.SERVER_URL + "user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: data,
                mode: "cors",
            }).then(resp => resp.json());
            if (resp.errors) {
                setErrorsList([...resp.errors]);
                setMessage("");
            }
            if (resp.errors) {
                setErrorsList([...resp.errors]);
            }
            if (resp.Message) {
                setMessage(resp.Message);
                setTimeout(() => setMessage(""), 3000); setErrorsList([]);
            }
            reset();
        } catch (e) {
            setErrorsList([{ msg: e + "", path: "Server Error" }]);
        }

    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                <h1 className="text-3xl py-5 text-center">Register</h1>
                <form autoComplete="off" onSubmit={handleSubmit(submitData)}>
                    {message != "" ? <p className="p-4 my-2 bg-green-500 text-white">{message}</p> : ""}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Fullname
                        </label>
                        <input {...register("fullname")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="fullname" id="fullname" type="text" placeholder="Enter Fullname" required />
                        <label className="text-xs text-red-500">
                            {errors["fullname"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                    if (error.path == "fullname")
                                        return (<span key={id}>{error.msg}</span>);
                                }) : ""}
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Username
                        </label>
                        <input {...register("username")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="username" id="username" type="text" placeholder="Enter Username" required />
                        <label className="text-xs text-red-500">
                            {errors["username"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                    if (error.path == "username")
                                        return (<span key={id}>{error.msg}</span>);
                                }) : ""}
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Email
                        </label>
                        <input {...register("email")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder="Enter E-Mail" required />
                        <label className="text-xs text-red-500">
                            {errors["email"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                    if (error.path == "email")
                                        return (<span key={id}>{error.msg}</span>);
                                }) : ""}
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Password
                        </label>
                        <input {...register("password")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="Enter Password" required />
                        <label className="text-xs text-red-500">
                            {errors["password"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                    if (error.path == "password")
                                        return (<span key={id}>{error.msg}</span>);
                                }) : ""}
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Repeat Password
                        </label>
                        <input {...register("repeatpassword")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="repeatpassword" id="repeatpassword" type="password" placeholder="Repeat Password" required />
                        <label className="text-xs text-red-500">
                            {errors["repeatpassword"]?.message}
                            {ErrorsList.length > 0 ? ErrorsList.map((error, id) => {
                                    if (error.path == "repeatpassword")
                                        return (<span key={id}>{error.msg}</span>);
                                }) : ""}
                        </label>
                    </div>
                    <input value="Register" className="btn mr-2 bg-green-900 text-white p-3 cursor-pointer" type="submit" />
                    <input value="Reset" className="btn mr-2 bg-red-900 text-white p-3 cursor-pointer" type="reset" />
                </form>
            </div>
        </div>
    );
}

export default WithGuest(register);