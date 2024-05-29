"use client";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import WithAuth from "@/app/components/WithAuth";
import { useAuth } from "@/app/context/GlobalContext";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function User() {
  const { isLoading, token } = useAuth();
  let [UserLoading, setUserLoading] = useState(true);
  let [message, setMessage] = useState("");
  let [userData, setUserData] = useState({});
  let [FollowStatus, setFollowStatus] = useState(false);
  let userId = usePathname().split("/").at(-1);
  async function Follow(e) {
    e.preventDefault();
    let resp = await fetch(process.env.SERVER_URL + "user/follow/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      mode: "cors",
    }).then(resp => resp.json());
    setFollowStatus(!FollowStatus);
  }
  useEffect(() => {
    let getData = async () => {
      let resp = await fetch(process.env.SERVER_URL + "user/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        mode: "cors",
      }).then(resp => {
        return resp.json();
      }).then(resp => resp);
      setUserData(resp);
      setFollowStatus(resp.followed);
      setUserLoading(false);
    }
    getData();
  }, [message, FollowStatus]);
  if (isLoading || UserLoading) {
    return <PreloaderComponent />
  } else {
    return (
      <>
        <div className="grid grid-cols-12">
          <div key={userData._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
            <div className="flex items-center mt-3">
              <div className="text-2xl font-bold">
                <p className="text-gray-900 leading-none py-2">
                  {userData.user.fullname}
                </p>
              </div>
            </div>
            <div className="py-2">
              <div className="font-bold mb-2">{userData.user.email}</div>
              <div className="text-gray-500 text-sm">Joined {moment(userData.user.createdAt).fromNow()}</div>
            </div>
            <div className="flex flex-row-reverse gap-1 justify-content-end">
              <p className="p-2">{userData.numberOfFollowers} &nbsp;
                {userData.numberOfFollowers > 1 ? "Followers" : " Follower"}</p>
              <Link className={userData.followed ? "bg-blue-400 text-white p-2 float-right" : "p-2 float-right"} onClick={Follow} href="#">{userData.followed ? "Followed":"Follow"}</Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WithAuth(User);