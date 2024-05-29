"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import { useAuth } from "@/app/context/GlobalContext";
import Link from "next/link";
import moment from "moment";
import WithAuth from "../components/WithAuth";
import { useRouter } from "next/navigation";

function Dashboard() {
  const { isLoading,token } = useAuth();
  const [postLoading, setPostLoading] = useState(true);
  let [errors, setErrors] = useState([]);
  let [userData, setUserData] = useState({});
  let [message,setMessage] = useState("");
  let fullnameField = useRef();
  let emailField = useRef();
  let [clicked,setClicked] = useState(false);
  let router = useRouter();
  const [posts, setPosts] = useState([]);

  async function changeFullname() {
    let fullname = fullnameField.current.value;
    let resp = await fetch(process.env.SERVER_URL + "user/changefullname/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ fullname }),
      mode: "cors",
    }).then(res => res.json()).then(res=>res);
    if(resp.Message) {
      setUserData({...userData,fullname})
      setMessage(resp.Message);
      setTimeout(() => setMessage(""), 3000);
    }
    else setErrors([resp.Error]);
  }

  async function changeEmail() {
    let email = emailField.current.value;
    let resp = await fetch(process.env.SERVER_URL + "user/changeemail/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ email }),
      mode: "cors",
    }).then(res => res.json()).then(res=>res);
    if(resp.Message) {
      setUserData({...userData,email})
      setMessage(resp.Message);
      setTimeout(() => setMessage(""), 3000);
    }
    else setErrors([resp.Error]);
  }

  async function deletePost(id){
    let resp = await fetch(process.env.SERVER_URL + "post/delete/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ id }),
      mode: "cors",
    }).then(res => res.json()).then(res=>res);
    setClicked(!clicked);
  }

  useLayoutEffect(() => {
    let getData = async () => {
      let token = localStorage.getItem("accesstoken");
      let resp = await fetch(process.env.SERVER_URL + "post/user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        mode: "cors",
      }).then(resp => {
        return resp.json();
      }).then(resp => resp);

      if (resp.Error) {
        setErrors([resp.Error]);
      } else {
        setPosts([...resp]);
      }
    }
    let getUser = async () => {
      let token = localStorage.getItem("accesstoken");
      let resp = await fetch(process.env.SERVER_URL + "user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        mode: "cors",
      }).then(resp => resp.json()).then(resp => resp);
      if (resp.Error) setErrors([resp.Error]);
      else {
        setUserData({ ...resp });
        setPostLoading(false);
      }
    }
    getData();
    getUser();
  }, [clicked]);
  if (isLoading || postLoading) {
    return <PreloaderComponent />
  } else {
    return (
      <>
        {
          <div className="grid grid-cols-12 my-5">
            <h1 className="col-start-2 text-4xl font-bold col-span-10">User Data:</h1>
            <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
              {message =="" ? "":
              <p className="col-start-2 my-2 bg-green-500 p-2 text-white col-span-10">{message}</p>}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" >
                  Fullname
                </label>
                <input ref={fullnameField} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="fullname" id="fullname" type="text" placeholder={userData.fullname} defaultValue={userData.fullname} required />
                {errors.length > 0 ? errors.map((error, id) => {
                  if (error.path == "fullname")
                    return (<p className="text-red-500" key={id}>{error.msg}</p>);
                }) : ""}
                <div className="flex flex-row-reverse gap-1 mt-2 justify-content-end">
                  <button onClick={() => fullnameField.current.value = userData.fullname} className="bg-blue-400 p-2 text-white float-right">Reset</button>
                  <button onClick={() => changeFullname()} className="bg-red-400 p-2 text-white float-right">Change Fullname</button>
                </div>
              </div>

              {/** EMail */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" >
                  E-Mail
                </label>
                <input ref={emailField} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder={userData.email} defaultValue={userData.email} required/>
                <div className="flex flex-row-reverse gap-1 mt-2 justify-content-end">
                  <button onClick={() => emailField.current.value = userData.email} className="bg-blue-400 p-2 text-white float-right">Reset</button>
                  <button onClick={() => changeEmail()} className="bg-red-400 p-2 text-white float-right">Change E-Mail</button>
                </div>
                {errors.length > 0 ? errors.map((error, id) => {
                  if (error.path == "email")
                    return (<p className="text-red-500" key={id}>{error.msg}</p>);
                }) : ""}
              </div>
            </div>
            {/** Email end */}

            <h1 className="col-start-2 mt-3 text-4xl font-bold col-span-10">Posts</h1>
            {posts.length > 0 ?
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
                    <div className="font-bold text-xl mb-2">{post.title}</div>
                    <p className="text-gray-700 text-base">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex flex-row-reverse gap-1 justify-content-end">
                    <Link href={"/post/" + post._id} className="bg-blue-400 p-2 text-white float-right">Edit</Link>
                    <button onClick={()=> deletePost(post._id)} className="bg-red-400 p-2 text-white float-right">Delete</button>
                  </div>
                </div>
              ))
              :
              <p className="col-start-2 mt-3 text-xl text-center col-span-10">No posts created yet...</p>
            }
          </div>
        }
      </>
    )
  }
}
export default WithAuth(Dashboard);