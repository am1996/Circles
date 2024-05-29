"use client";
import { useState, useRef } from "react";
import WithGuest from "@/app/components/WithGuest";

function register() {
    let formComponent = useRef();
    let [errors, setErrors] = useState([]);
    let [message, setMessage] = useState("");
    async function submitData(e) {
        e.preventDefault();
        try {
            let formdata = new FormData(formComponent.current);
            let data = JSON.stringify({
                fullname: formdata.get("fullname"),
                email: formdata.get("email"),
                password: formdata.get("password"),
                repeatpassword: formdata.get("repeatpassword"),
            });
            let resp = await fetch(process.env.SERVER_URL + "user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
                mode: "cors",
            }).then(resp => resp.json());
            if (resp.errors) {
                setErrors([...resp.errors]);
                setMessage("");
            }
            if (resp.Message) {
                setMessage(resp.Message);
                setTimeout(() => setMessage(""), 3000);
                setErrors([]);
            }
            formComponent.current.reset();
        } catch (e) {
            setErrors([{ msg: e + "", path: "Server Error" }]);
        }

    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                <h1 className="text-3xl py-5 text-center">Register</h1>
                <form ref={formComponent} onSubmit={submitData}>
                    {message != "" ? <p className="p-4 my-2 bg-green-500 text-white">{message}</p> : ""}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Fullname
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="fullname" id="fullname" type="text" placeholder="Enter Fullname" required/>
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "fullname")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder="Enter E-Mail" required/>
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "email")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="Enter Password" required/>
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "password")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Repeat Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="repeatpassword" id="repeatpassword" type="password" placeholder="Repeat Password" required/>
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "repeatpassword" || error.path == "Server Error")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <input value="Register" className="btn bg-green-900 text-white p-3 cursor-pointer" type="submit" />
                </form>
            </div>
        </div>
    );
}

export default WithGuest(register);