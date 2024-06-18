import Link from "next/link";
import moment from "moment";

export default function PostComponent({post,element}){
	if(post.owner) post.createdBy = post.owner[0];
	return (
		<div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
			<div className="flex items-center mt-3">
				<div className="text-sm">
					<p className="text-gray-900 leading-none">
						<Link className="font-bold" href={"/user/" + post.createdBy._id}>{post.createdBy.fullname}</Link> &nbsp;
						<p className="text-gray-600 text-xs leading-none mb-3 inline-block">{moment(post.createdAt).fromNow()}</p>
					</p>
				</div>
			</div>
			<div className="py-2">
				<div className="font-bold inline-block">{post.title}</div>
				<p className="text-base">
					{post.content}
				</p>
			</div>
			{element}
		</div>
	);
}