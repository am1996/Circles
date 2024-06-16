export const getUserData = async (token) => {
    let url = process.env.SERVER_URL + "user";
    let resp = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        mode: "cors",
    }).then(resp => resp.json()).then(resp => resp);
    if (resp.Error) throw Error(resp.Error);
    else return resp;
}

export const deleteUserComment = async (id,token) => {
}

export const deleteUserPost = async (id,token) => {
    try {
        let resp = await fetch(process.env.SERVER_URL + "post/delete/" + id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ id }),
            mode: "cors",
        });
        if (!resp.ok)
            throw Error("Something went wrong");
    } catch (error) {

    }
}
export const getUserPosts = async (token,page,limit) => {
    let url = process.env.SERVER_URL + `post/user?limit=${limit}&page=${page}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            mode: "cors",
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.Error) {
            throw new Error(data.Error);
        }
        return {
            items: data.posts,
            pages: data.pages
        };
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
};

export const getUserComments = async (token,page,limit) => {
    let url = process.env.SERVER_URL + `comment/user?limit=${limit}&page=${page}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            mode: "cors",
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.Error) {
            throw new Error(data.Error);
        }
        return {
            items: data.comments,
            pages: data.pages
        };
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
};