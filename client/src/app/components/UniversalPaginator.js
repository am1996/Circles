import { useQuery } from "react-query"
import { getUserPosts, deleteUserPost, deleteUserComment, getUserComments } from "../API/UserAPI";
import Link from "next/link";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import { useAuth } from "../context/GlobalContext";
import PostComponent from "./PostComponent";
import { useState } from "react";
import CommentComponent from "./CommentComponent";

export default function UniversalPaginator({ limit, resourceName, allowEdit }) {
    let limitNo = limit || 1;
    let [pageNo, setPageNo] = useState(1);
    let { token } = useAuth();
    let { isLoading, data, error, refetch, isError } = useQuery([token, resourceName, pageNo, limitNo],
        (qr) => {
            switch (resourceName) {
                case "UserPosts":
                    return getUserPosts(token, pageNo, limit);
                case "UserComments":
                    return getUserComments(token, pageNo, limit);
                default:
                    throw new Error("Invalid resourceName provided");
            }
        });

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
            <div className="col-start-2 mt-3 text-4xl font-bold col-span-10">
                <PreloaderComponent />
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
    let noOfPages = Array.from(Array(data.pages).keys());
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
                {noOfPages.length > 0 ?
                    <div className="col-start-2 col-span-10 border border-slate-300 rounded mt-5">
                        {noOfPages.map(page => (
                            <button key={page + 1} onClick={() => setPageNo(page + 1)} className={pageNo === page + 1 ? "p-3 bg-gray-800 rounded text-white" : "p-3"}>{page + 1}</button>
                        ))
                        }
                    </div>
                    : ""
                }
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
                {noOfPages.length > 0 ?
                    <div className="col-start-2 col-span-10 border border-slate-300 rounded mt-5">
                        {noOfPages.map(page => (
                            <button key={page + 1} onClick={() => setPageNo(page + 1)} className={pageNo === page + 1 ? "p-3 bg-gray-800 rounded text-white" : "p-3"}>{page + 1}</button>
                        ))
                        }
                    </div>
                    : ""
                }
            </>
        );
    }


}