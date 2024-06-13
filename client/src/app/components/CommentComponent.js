import moment from "moment";
import Link from "next/link";

export default function CommentComponent({item}){
    return (
        <div className="col-start-2 col-span-10 border border-slate-300 rounded p-5 mt-5">
        <div className="flex items-center mt-3">
            <div className="text-sm">
                <p className="text-gray-900 leading-none py-2">
                    <Link href="#">{item.owner  [0].fullname.toUpperCase()}</Link>
                </p>
                <p className="text-gray-900 leading-none">{moment(item.createdAt).fromNow()}</p>
            </div>
        </div>
        <div className="py-2">
            <p className="text-l">
                {item.content}
            </p>
        </div>
    </div>
    );
}