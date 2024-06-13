"use client";
import PreloaderComponent from "@/app/components/PreloaderComponent";
import WithAuth from "@/app/components/WithAuth";
import { useAuth } from "@/app/context/GlobalContext";
import { useSearchParams } from "next/navigation";
import { useState, useLayoutEffect } from "react";
import SearchBar from "@/app/components/SearchBar";
import PostComponent from "@/app/components/PostComponent";

function SearchPost() {
	let searchParams = useSearchParams();
	const { isLoading } = useAuth();
	const [postLoading, setPostLoading] = useState(true);
	let [errors, setErrors] = useState([]);
	const [posts, setPosts] = useState([]);

	useLayoutEffect(() => {
		let q = searchParams.get("q");
		let getData = async () => {
			let token = localStorage.getItem("accesstoken");
			let resp = await fetch(process.env.SERVER_URL + "post/search?q=" + q, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				},
				mode: "cors",
			}).then(resp => {
				setPostLoading(false);
				return resp.json()
			}
			).then(resp => resp);

			if (resp.Error) {
				setErrors([resp.Error]);
			} else {
				setPosts([...resp]);
			}
		}
		getData();
	}, [posts]);
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
									<PostComponent post={post} key={post._id} element={
										<div className="flex flex-row-reverse gap-1 justify-content-end">
											<Link href={"/post/" + post._id} className="bg-green-500 p-2 text-white float-right">Show Post</Link>
										</div>
									} />
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

export default WithAuth(SearchPost);