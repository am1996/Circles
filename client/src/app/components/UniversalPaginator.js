import { useQuery } from "react-query"
import Link from "next/link";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import { useAuth } from "@/app/context/GlobalContext";
import PostComponent from "@/app/components/PostComponent";
import { useEffect, useState } from "react";
import CommentComponent from "@/app/components/CommentComponent";
import { getPostComments } from "@/app/API/CommentAPI";
import { getPosts } from "@/app/API/PostsAPI";
import { getUserPosts, deleteUserPost, deleteUserComment, getUserComments } from "@/app/API/UserAPI";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import PaginatorCounter from "@/app/components/PaginatorCounter";

export default function UniversalPaginator({ limit, resourceName, allowEdit, PostId = 0 }) {
    let limitNo = limit || 1;
    let [pageNo, setPageNo] = useState(1);
    let { token } = useAuth();
    let { isLoading, data, error, refetch, isError, isFetching } = useQuery([token, resourceName, pageNo],
        (qr) => {
            switch (resourceName) {
                case "UserPosts":
                    return getUserPosts(token, pageNo, limit);
                case "UserComments":
                    return getUserComments(token, pageNo, limit);
                case "PostComments":
                    return getPostComments(token, PostId, pageNo, limit);
                case "PostsHome":
                    return getPosts(token, pageNo, limit);
                default:
                    throw new Error("Invalid resourceName provided");
            }
        }
    );
    useEffect(() => {
    }, [data, isFetching]);
    let deletePost = async (id) => {
        deleteUserPost(id, token);
        refetch();
    }
    let deleteComment = async (id) => {
        deleteUserComment(id, token);
        refetch();
    }
    if (isLoading) {
        return (
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                <div className="py-2">
                    <div className="font-bold mb-2"><Skeleton width={100} height={20} baseColor="#888888" /></div>
                    <p className="text-base">
                        <Skeleton count={4} height={10} baseColor="#888888" />
                    </p>
                </div>
            </div>
        );
    }
    if (isError) {
        console.log(error);
        return (
            <>
                <h2 className="col-start-2 mt-3 text-4xl col-span-10">An error has occured</h2>
            </>
        );
    }

    if (resourceName == "UserPosts") {
        return (
            <>
                {data.items.length > 0 ?
                    data.items.map(post => (
                        <PostComponent key={post._id} post={post} element={
                            allowEdit ?
                                <div className="flex flex-row-reverse gap-1 justify-content-end">
                                    <Link href={"/post/" + post._id} className="bg-blue-400 p-2 text-white float-right">Edit</Link>
                                    <button onClick={() => deletePost(post._id)} className="bg-red-400 p-2 text-white float-right">Delete</button>
                                </div> :
                                <></>
                        } />
                    ))
                    :
                    <p className="col-start-2 mt-3 text-xl text-center col-span-10">None created yet...</p>
                }
                <PaginatorCounter data={data} pageNo={pageNo} setPageNo={setPageNo} />
            </>
        );
    } else if (resourceName == "UserComments") {
        return (
            <>
                {data.items.length > 0 ?
                    data.items.map(comment => (
                        <CommentComponent key={comment._id} item={comment} />
                    ))
                    :
                    <p className="col-start-2 mt-3 text-xl text-center col-span-10">None created yet...</p>
                }
                <PaginatorCounter data={data} pageNo={pageNo} setPageNo={setPageNo} />
            </>
        );
    } else if (resourceName == "PostComments") {
        return (
            <>
                {data.items.length > 0 ?
                    data.items.map(comment => (
                        <CommentComponent key={comment._id} item={comment} />
                    ))
                    :
                    <p className="col-start-2 mt-3 text-xl text-center col-span-10">None created yet...</p>
                }
                <PaginatorCounter data={data} pageNo={pageNo} setPageNo={setPageNo} />
            </>
        );
    } else if (resourceName == "PostsHome") {
        return (
            <>
                {data.items.length > 0 ?
                    data.items.map(post => (
                        <PostComponent key={post._id} post={post} element={
                            allowEdit ?
                                <div className="flex flex-row-reverse gap-1 justify-content-end">
                                    <Link href={"/post/" + post._id} className="bg-blue-400 p-2 text-white float-right">Edit</Link>
                                    <button onClick={() => deletePost(post._id)} className="bg-red-400 p-2 text-white float-right">Delete</button>
                                </div> :
                                <div className="flex flex-row-reverse gap-1 justify-content-end">
                                    <Link href={"/post/" + post._id} className="bg-green-500 p-2 text-white float-right">Show Post</Link>
                                </div>
                        } />
                    ))
                    :
                    <p className="col-start-2 mt-3 text-xl text-center col-span-10">None created yet...</p>
                }
                <PaginatorCounter data={data} pageNo={pageNo} setPageNo={setPageNo} />
            </>
        );
    }


}