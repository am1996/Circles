"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import { useAuth } from "@/app/context/GlobalContext";
import Link from "next/link";
import PostComponent from "../components/PostComponent";
import WithAuth from "../components/WithAuth";

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
    return <PreloaderComponent />
  } else {
    return (
      <>
        {isAuthenticated ?
          <div className="grid grid-cols-12 my-5">
            {
              posts.map(post => (
                <PostComponent post={post} key={post._id} />
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