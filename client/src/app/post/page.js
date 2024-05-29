"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import Preloader from "@/app/components/Preloader";
import { useAuth } from "@/app/context/GlobalContext";
import Link from "next/link";

function Home() {
  const { isAuthenticated, isLoading } = useAuth();
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
        {isAuthenticated ?
          <div className="grid grid-cols-12 my-5">
            {
              posts.map(post => (
                <div key={post._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5 cursor-pointer">
                  <Link href={"/post/" + post._id}>
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{post.title}</div>
                      <p className="text-gray-700 text-base">
                        {post.content}
                      </p>
                      <div className="text-sm">
                        <p className="text-gray-900 leading-none">Jonathan Reinink</p>
                        <p className="text-gray-600">Aug 18</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            }
          </div>
          :
          <h1>UnAuth</h1>
        }
      </>
    )
  }
}
export default WithAuth(Home);
