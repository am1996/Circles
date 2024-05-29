"use client";
import Preloader from "@/app/components/Preloader";
import WithAuth from "@/app/components/WithAuth";
import { useAuth } from "@/app/context/GlobalContext";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

function Post() {
    const { isLoading, token } = useAuth();
    let [postLoading, setPostLoading] = useState(true);
    let [postData, setPostData] = useState({});
    let [errors, setErrors] = useState([]);
    let [message, setMessage] = useState("");
    let [likeStatus,setLikeStatus] = useState(null);
    let router = useRouter();
    let formComponent = useRef();
    let postId = usePathname().split("/").at(-1);
    async function like(e){
        e.preventDefault();
        let resp = await fetch(process.env.SERVER_URL + "post/like/" + postId,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            mode: "cors",
        }).then(resp => resp.json());
        setLikeStatus(!likeStatus);
    }
    async function submitData(e) {
        e.preventDefault();
        try {
            let formdata = new FormData(formComponent.current);
            let data = JSON.stringify({
                content: formdata.get("content"),
                postId:postId
            });
            let resp = await fetch(process.env.SERVER_URL + "comment/add", {
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
                setMessage(`Comment ${resp._id} Added successfully.`);
                router.refresh();
                setErrors([]);
            }
            formComponent.current.reset();
        } catch (e) {
            setErrors([{ msg: e + "", path: "Server Error" }]);
        }
    }
    useEffect(() => {
        let getData = async () => {
            let resp = await fetch(process.env.SERVER_URL + "post/" + postId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                mode: "cors",
            }).then(resp => {
                return resp.json();
            }).then(resp => resp);
            setPostData(resp);
            setLikeStatus(resp[0].liked);
            setPostLoading(false);
        }
        getData();
    }, [message,likeStatus]);
    if (isLoading || postLoading) {
        return <Preloader />
    } else {
        return (
            <div className="grid grid-cols-12 my-5">
                <div key={postData[0]._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                    <div className="flex items-center mt-3">
                        <div className="text-sm">
                            <p className="text-gray-900 leading-none py-2">
                                <Link href="#">{postData[0].owner[0].fullname.toUpperCase()}</Link>
                            </p>
                            <p className="text-gray-900 leading-none">{moment(postData[0].createdAt).fromNow()}</p>
                        </div>
                    </div>
                    <div className="py-2">
                        <div className="font-bold text-l mb-2">{postData[0].title}</div>
                        <p className="text-l">
                            {postData[0].content}
                        </p>
                    </div>
                    <div className="flex flex-row-reverse gap-1 justify-content-end">
                        <p className="p-2">{postData[0].likesCount} 
                            {postData[0].likesCount > 1 ? "Likes" : " Like"}</p>
                        <Link className={postData[0].liked ? "bg-blue-400 text-white p-2 float-right": "p-2 float-right"} onClick={like} href="#">Like</Link>
                    </div>
                </div>
                <h1 className="col-start-2 col-span-10 mt-5 text-2xl font-bold">Comments</h1>
                {
                    postData[0].comments.map(item => {
                        return (
                            <div key={item._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                                <div className="flex items-center mt-3">
                                    <div className="text-sm">
                                        <p className="text-gray-900 leading-none py-2">
                                            <Link href="#">{item.owner[0].fullname.toUpperCase()}</Link>
                                        </p>
                                        <p className="text-gray-900 leading-none">{moment(item.createdAt).fromNow()}</p>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <p className="text-l">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                    <h1 className="text-xl font-bold py-5">Comment</h1>
                    <form ref={formComponent} onSubmit={submitData}>
                        <div className="mb-4">
                            <textarea rows="3" className="shadow border-slate-300 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="content" id="Content" type="Content" placeholder="Enter Content" required></textarea>
                            {errors.length > 0 ? errors.map((error, id) => {
                                if (error.path == "content" || error.path == "Server Error")
                                    return (<p className="text-red-500" key={id}>{error.msg}</p>);
                            }) : ""}
                        </div>
                        <input value="Comment" className="btn bg-green-900 text-white p-3 cursor-pointer" type="submit" />

                    </form>
                </div>
            </div>
        );
    }
}

export default WithAuth(Post);