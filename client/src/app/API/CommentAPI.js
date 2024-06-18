export async function getPostComments(token,postId,page,limit) {
    let resp = await fetch(process.env.SERVER_URL + "comment/post/" + postId + `?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        mode: "cors",
    }).then(resp => resp.json()).then(resp => resp);
    return {
        items: resp.comments,
        pages: resp.pages
    };
}