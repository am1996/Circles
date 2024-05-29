"use client";
import { useState, useRef } from "react";
import WithAuth from "@/app/components/WithAuth";
import { useAuth } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";

function addPost() {
    let formComponent = useRef();
    const { token } = useAuth();
    let [errors, setErrors] = useState([]);
    let [message, setMessage] = useState("");
    const router = useRouter()
    async function submitData(e) {
        e.preventDefault();
        try {
            let formdata = new FormData(formComponent.current);
            let data = JSON.stringify({
                title: formdata.get("title"),
                content: formdata.get("content"),
            });
            let resp = await fetch(process.env.SERVER_URL + "post/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: data,
                mode: "cors",
            }).then(resp => resp.json());
            if (resp.errors) {
                setErrors([...resp.errors]);
                setMessage("");
            }
            if (resp.content) {
                setMessage("Post Added successfully.");
                router.push('/');
                setErrors([]);
            }
            formComponent.current.reset();
            console.log(message);
        } catch (e) {
            setErrors([{ msg: e + "", path: "Server Error" }]);
        }
    }
    return (
        <div className="grid grid-cols-12">
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                {message !="" ?
                    <div className="flex items-center bg-green-500 text-white text-sm font-bold px-4 py-3" role="alert">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
                        <p>{message} has been added.</p>
                    </div>
                    : ""}
                <h1 className="text-3xl py-5 text-center">Add Post</h1>
                <form ref={formComponent} onSubmit={submitData}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Title
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="title" id="title" type="text" placeholder="Enter Title" required />
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "content" || error.path == "Server Error")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Content
                        </label>
                        <textarea rows="7" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="content" id="Content" type="Content" placeholder="Enter Content" required></textarea>
                        {errors.length > 0 ? errors.map((error, id) => {
                            if (error.path == "content" || error.path == "Server Error")
                                return (<p className="text-red-500" key={id}>{error.msg}</p>);
                        }) : ""}
                    </div>
                    <input value="Add Post" className="btn bg-green-900 text-white p-3 cursor-pointer" type="submit" />

                </form>
            </div>
        </div>
    );
}
export default WithAuth(addPost);