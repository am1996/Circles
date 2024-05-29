"use client";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import WithAuth from "@/app/components/WithAuth";
import { useAuth } from "@/app/context/GlobalContext";
import { useSearchParams } from "next/navigation";
import { useState, useLayoutEffect } from "react";
import SearchBar from "@/app/components/SearchBar";
import Link from "next/link";
import moment from "moment";

function SearchPost() {
	let searchParams = useSearchParams();
	const { isLoading } = useAuth();
	const [UserLoading, setUserLoading] = useState(true);
	let [errors, setErrors] = useState([]);
	const [users, setUsers] = useState([]);

	useLayoutEffect(() => {
		let q = searchParams.get("q");
		let getData = async () => {
			let token = localStorage.getItem("accesstoken");
			let resp = await fetch(process.env.SERVER_URL + "user/search?q=" + q, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				},
				mode: "cors",
			}).then(resp => {
				setUserLoading(false);
				return resp.json()
			}
			).then(resp => resp);

			if (resp.Error) {
				setErrors([resp.Error]);
			} else {
				setUsers([...resp]);
			}
		}
		getData();
	}, [users]);
	if (isLoading || UserLoading) {
		return <PreloaderComponent />
	} else {
		return (
			<>
				<SearchBar />
				{users.length > 0 ?
					<>
						<div className="grid grid-cols-12 my-5">
							{
								users.map(user => (
									<div key={user._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
										<div className="flex items-center mt-3">
											<div className="text-sm">
												<p className="text-gray-900 leading-none py-2">
													<Link href={"/user/" + user._id}>{user.fullname.toUpperCase()}</Link>
												</p>
											</div>
										</div>
										<div className="py-2">
											<div className="font-bold mb-2">{user.email}</div>
										</div>
										<div className="flex flex-row-reverse gap-1 justify-content-end">
											<Link href={"/user/" + user._id} className="bg-green-500 p-2 text-white float-right">Visit Profile...</Link>
										</div>
									</div>
								))
							}
						</div>
					</>
					:
					<div className="grid grid-cols-12 my-5">
						<h1 className="col-start-2 text-4xl font-bold col-span-10">Users:</h1>
						<p className="col-start-2 mt-3 text-xl text-center col-span-10">No Users Found...</p>
					</div>
				}
			</>
		)
	}
}

export default WithAuth(SearchPost);