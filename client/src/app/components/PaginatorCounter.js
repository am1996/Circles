export default function PaginatorCounter({ data,pageNo,setPageNo }) {
    let pageNos = Array.from(Array(data?.pages).keys());
    return (
        <>
            {pageNos.length > 0 ?
                <div className="col-start-2 col-span-10 border border-slate-300 rounded mt-5">
                    {pageNos.map(page => (
                        <button key={page + 1} onClick={() => setPageNo(page + 1)} className={pageNo === page + 1 ? "p-3 bg-gray-800 rounded text-white" : "p-3"}>{page + 1}</button>
                    ))
                    }
                </div>
                : ""
            }
        </>
    );
}