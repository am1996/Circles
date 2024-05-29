import Link from "next/link";
import moment from "moment";

export default function PostComponent({post}){
	return (
		<div key={post._id} className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
			<div className="flex items-center mt-3">
				<div className="text-sm">
					<p className="text-gray-900 leading-none py-2">
						<Link href={"/user/" + post.createdBy._id}>{post.createdBy.fullname.toUpperCase()}</Link>
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
	);
}
