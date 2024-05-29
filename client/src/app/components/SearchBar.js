import { useRouter } from "next/navigation";
import { useRef } from "react";


function SearchBar() {
	let router = useRouter();
	let selector = useRef();
	let data = useRef();
	async function routeToSearch(e) {
		e.preventDefault();
		let choice = selector.current.value;
		let q = data.current.value;
		if (q === "") {
			return;
		}
		if (choice === "post") {
			router.push("/post/search?q=" + q, undefined, { shallow: true });
		} else if (choice === "user") {
			router.push("/user/search?q=" + q, undefined, { shallow: true });
		}
	}
	return (
		<form className="max-w-lg mx-auto my-4">
			<div className="flex">
				<div id="dropdown-button" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200" type="button">
					<select ref={selector} name="cars" id="cars">
						<option value="post">Post</option>
						<option value="user">User</option>
					</select>
				</div>
				<div className="relative w-full">
					<input ref={data} type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-green-700 focus:border-green-700" placeholder="Search For Users and Posts..." required />
					<button onClick={routeToSearch} className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-green-700 rounded-e-lg border border-green-700 hover:bg-green-800">
						<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
						</svg>
						<span className="sr-only">Search</span>
					</button>
				</div>
			</div>
		</form>
	)
}
export default SearchBar;