"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/GlobalContext";
import WithAuth from "../components/WithAuth";
import DefaultProfileImage from "../../../public/profile.svg";
import UniversalPaginator from "@/app/components/UniversalPaginator";
import PreloaderComponent from "@/app/components/PreloaderComponent";

function Dashboard() {
  const { isLoading, token } = useAuth();
  const [postLoading, setPostLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  let [errors, setErrors] = useState([]);
  let [userData, setUserData] = useState({});
  let [message, setMessage] = useState("");
  let fullnameField = useRef();
  let emailField = useRef();

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
    }).then(res => res.json()).then(res => res);
    if (resp.Message) {
      setUserData({ ...userData, fullname })
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
    }).then(res => res.json()).then(res => res);
    if (resp.Message) {
      setUserData({ ...userData, email })
      setMessage(resp.Message);
      setTimeout(() => setMessage(""), 3000);
    }
    else setErrors([resp.Error]);
  }

  function changeProfile(e) {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
  }
  useLayoutEffect(() => {
    let getUser = async () => {
      let token = localStorage.getItem("accesstoken");
      let resp = await fetch(process.env.SERVER_URL + "user", {
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
    getUser();
  }, [profileImage]);
  if (isLoading || postLoading) {
    return <PreloaderComponent />
  } else {
    return (
      <>
        <div className="grid grid-cols-12 my-5">
          <h1 className="col-start-2 text-4xl font-bold col-span-10">User Data:</h1>
          <div className="col-start-2 col-span-3 rounded flex justify-center items-center">
            <img src={profileImage || DefaultProfileImage.src} width="250" />
          </div>
          <div className="col-start-5 col-span-7 border border-slate-300 rounded p-5 mt-5">
            {message == "" ? "" :
              <p className="col-start-2 my-2 bg-green-500 p-2 text-white col-span-10">{message}</p>}
            {/**fullname */}
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
            {/**fullname end */}
            {/** EMail */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" >
                E-Mail
              </label>
              <input ref={emailField} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="email" placeholder={userData.email} defaultValue={userData.email} required />
              <div className="flex flex-row-reverse gap-1 mt-2 justify-content-end">
                <button onClick={() => emailField.current.value = userData.email} className="bg-blue-400 p-2 text-white float-right">Reset</button>
                <button onClick={() => changeEmail()} className="bg-red-400 p-2 text-white float-right">Change E-Mail</button>
              </div>
              {errors.length > 0 ? errors.map((error, id) => {
                if (error.path == "email")
                  return (<p className="text-red-500" key={id}>{error.msg}</p>);
              }) : ""}
            </div>
            {/** Email end */}
            {/** Image */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" >
                Profile Photo
              </label>
              <input onChange={changeProfile} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" id="email" type="file" />
              <div className="flex flex-row-reverse gap-1 mt-2 justify-content-end">
                <button className="bg-blue-400 p-2 text-white float-right">Upload Profile Photo</button>
              </div>
              {errors.length > 0 ? errors.map((error, id) => {
                if (error.path == "email")
                  return (<p className="text-red-500" key={id}>{error.msg}</p>);
              }) : ""}
            </div>
            {/** Image end */}
          </div>
          <h1 className="col-start-2 mt-3 text-4xl font-bold col-span-10">User Posts:</h1>
          <UniversalPaginator limit={1} resourceName="UserPosts" allowEdit={true} />
          <h1 className="col-start-2 mt-3 text-4xl font-bold col-span-10">User Comments:</h1>
          <UniversalPaginator limit={1} resourceName="UserComments" allowEdit={false} />
        </div>
      </>
    )
  }
}
export default WithAuth(Dashboard);