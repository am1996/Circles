export const getPosts = async (token,page,limit) => {
    let resp = await fetch(process.env.SERVER_URL + "post/" + `?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        mode: "cors",
    }).then(resp => {
        return resp.json();
    }).then(resp => resp);

    if (resp.Error) {
        throw Error(resp.Error);
    } else {
        return {
            items: resp.posts,
            pages: resp.pages
        }
    }
}