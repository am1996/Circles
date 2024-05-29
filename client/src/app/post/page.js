"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import Preloader from "@/app/components/Preloader";
import { useAuth } from "@/app/context/GlobalContext";
import Link from "next/link";
import moment from "moment";
import WithAuth from "@/app/components/WithAuth";
import SearchBar from "@/app/components/SearchBar";

function Home() {
  const { isLoading } = useAuth();
  const [postLoading, setPostLoading] = useState(true);
  let [errors, setErrors] = useState([]);
  const [posts, setPosts] = useState([]);
  useLayoutEffect(() => {
    let getData = async () => {
      let token = localStorage.getItem("accesstoken");
      let resp = await fetch(process.env.SERVER_URL + "post/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        mode: "cors",
      }).then(resp => {
        setPostLoading(false);
        return resp.json();
      }).then(resp => resp);

      if (resp.Error) {
        setErrors([resp.Error]);
      } else {
        setPosts([...resp]);
      }
    }
    getData();
  }, []);
  if (isLoading || postLoading) {
    return <Preloader />
  } else {
    return (
      <>
        {posts.length > 0 ?
          <>
            <SearchBar />
            <div className="grid grid-cols-12 my-5">
              {
                posts.map(post => (
                  <div key={post._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
                    <div className="flex items-center mt-3">
                      <div className="text-sm">
                        <p className="text-gray-900 leading-none py-2">
                          <Link href="#">{post.createdBy.fullname.toUpperCase()}</Link>
                        </p>
                        <p className="text-gray-900 leading-none">{moment(post.createdAt).fromNow()}</p>
                      </div>
                    </div>
                    <div className="py-2">
                      <div className="font-bold mb-2">{post.title}</div>
                      <p className="text-base">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex flex-row-reverse gap-1 justify-content-end">
                      <Link href={"/post/" + post._id} className="bg-green-500 p-2 text-white float-right">Show Post</Link>
                    </div>
                  </div>
                ))
              }
            </div>
          </>
          :
          <div className="grid grid-cols-12 my-5">
            <h1 className="col-start-2 text-4xl font-bold col-span-10">Posts:</h1>
            <p className="col-start-2 mt-3 text-xl text-center col-span-10">No posts created yet...</p>
          </div>
        }
      </>
    )
  }
}
export default WithAuth(Home);
