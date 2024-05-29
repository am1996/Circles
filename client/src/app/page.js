"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import PreloaderComponent from "./components/PreloaderComponent";
import { useAuth } from "./context/GlobalContext";
import Link from "next/link";
import moment from "moment";
import WithAuth from "./components/WithAuth";
import SearchBar from "./components/SearchBar";
import PostComponent from "./components/PostComponent";

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
    return <PreloaderComponent />
  } else {
    return (
      <>
        <SearchBar />
        {posts.length > 0 ?
          <>
            <div className="grid grid-cols-12 my-5">
              {
                posts.map(post => (
                  <PostComponent post={post} key={post._id} />
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
