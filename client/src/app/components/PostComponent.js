import Link from "next/link";
import moment from "moment";
import DefaultProfileImage from "../../../public/profile.svg";

export default function PostComponent({post,element}){
	if(post.owner) post.createdBy = post.owner[0];
	return (
		<div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
			<div className="flex items-center mt-3">
				<div>
					<img src={DefaultProfileImage.src} className="inline-block rounded" height="50" width="50" />
					<div className="text-gray-900 ml-2 mt-2 leading-none inline-block">
						<Link className="font-bold" href={"/user/" + post.createdBy._id}>{post.createdBy.fullname}</Link> &nbsp;
						<span className="text-gray-600 text-sm leading-none inline-block">@{post.createdBy.username}</span>
						<br/>
						<span className="text-gray-600 text-sm leading-none">{moment(post.createdAt).fromNow()}</span>
					</div>
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