"use client";
import CommentComponent from "@/app/components/CommentComponent";
import PostComponent from "@/app/components/PostComponent";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import UniversalPaginator from "@/app/components/UniversalPaginator";
import WithAuth from "@/app/components/WithAuth";
import { useAuth } from "@/app/context/GlobalContext";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";

function Post() {
    let queryClient = useQueryClient();
    const { isLoading, token } = useAuth();
    let [postLoading, setPostLoading] = useState(true);
    let [postData, setPostData] = useState({});
    let [errors, setErrors] = useState([]);
    let [message, setMessage] = useState("");
    let [likeStatus, setLikeStatus] = useState(null);
    let router = useRouter();
    let formComponent = useRef();
    let postId = usePathname().split("/").at(-1);
    async function like(e) {
        e.preventDefault();
        let resp = await fetch(process.env.SERVER_URL + "post/like/" + postId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            mode: "cors",
        }).then(resp => resp.json());
        setLikeStatus(!likeStatus);
    }
    async function AddComment(e) {
        e.preventDefault();
        try {
            let formdata = new FormData(formComponent.current);
            let data = JSON.stringify({
                content: formdata.get("content"),
                postId: postId
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
            queryClient.refetchQueries();
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
            setLikeStatus(resp.liked);
            setPostLoading(false);
        }
        getData();
    }, [message, likeStatus]);
    if (isLoading || postLoading) {
        return <PreloaderComponent />
    } else {
        return (
            <div className="grid grid-cols-12 my-5">
                <PostComponent key={postData._id} post={postData} element={
                    <div className="flex flex-row-reverse gap-1 justify-content-end">
                        <p className="p-2">{postData.likesCount}
                            {postData.likesCount > 1 ? " Likes" : " Like"}</p>
                        <Link className={postData.liked ? "bg-blue-400 text-white p-2 float-right" : "p-2 float-right"} onClick={like} href="#">Like</Link>
                    </div>
                } />
                <h1 className="col-start-2 col-span-10 mt-5 text-2xl font-bold">Comments</h1>
                <UniversalPaginator PostId={postData._id} allowEdit={false} limit={1} resourceName="PostComments" />
                <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                    <h1 className="text-xl font-bold py-5">Comment</h1>
                    <form ref={formComponent} onSubmit={AddComment}>
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