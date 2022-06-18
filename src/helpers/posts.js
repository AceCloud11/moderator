import axios from "axios";
import {toast} from "react-toastify";
import {logoutUnAuthenticatedUsers} from "./helpers";

export const restore = async (id, token) => {
    await axios({
        url: '/moderator/posts/restore/' + id,
        method: "put",
        responseType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then(async (response) => {
            //  await this.fetchMovies(1);
            if (response.data.success) {
                toast.success(response.data.success);
            }else{
                toast.error(response.data.error);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export const forceDelete = async (id, token) => {
    await axios({
        url: '/moderator/posts/force-delete/' + id,
        method: "delete",
        responseType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then(async (response) => {
            //  await this.fetchMovies(1);
            if (response.data.success) {
                toast.success(response.data.success);
            }else{
                toast.error(response.data.error);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export const addToSlider = async (id, token) => {
    await axios({
        url: '/moderator/featured/' + id,
        method: "post",
        responseType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then(async (response) => {
            //  await this.fetchMovies(1);
            if (response.data.success) {
                toast.success(response.data.success);
            }else{
                toast.error(response.data.error);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export const deletePost = async (id, token) => {
    await axios({
        url: '/moderator/posts/' + id,
        method: "delete",
        responseType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then(async (response) => {
            toast.success(response.data.success);
        })
        .catch((error) => {
            console.log(error);
        });
}

export const handleApprove = async (id, action, token) => {
    await axios({
        url: "/admin/posts/" + id + "/" + action,
        method: "put",
        responseType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then((res) => {
            // console.log(res)
            toast.success(res.data.success);
        })
        .catch((err) => {
            console.error(err);
        });
};

export const fetchPosts = async (page, token, trash, type) => {
    if (token !== '') {
        let url;
        let data = [];
        let currentPage, lastPage;
        if (!trash) {
            let pg = new URLSearchParams(window.location.search).get("page") || 1;
            if (page !== 1) {
                window.location.search = "page=" + page;
            }

            url = "/moderator/posts?type=" + type + "&order=created_at|desc&page=" + pg;
        } else {
            url = "/moderator/posts?type=" + type + "&order=created_at|desc&trash=1&page=" + page;
        }

        await axios({
            url,
            method: "GET",
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(async (response) => {
                data = response.data.data;
                currentPage = response.data.current_page;
                lastPage = response.data.last_page;
            })
            .catch((error) => {
                console.log(error);
                //logoutUnAuthenticatedUsers(error.response.status);
            });

        return {
            data,
            currentPage,
            lastPage
        }
    }
};

export const emptyTrash = async (type, token) => {
    let res = '';
    await axios({
        url: `/moderator/posts/empty/trash/${type}`,
        method: "delete",
        responseType: "json",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then(async (response) => {
            //  await fetchPosts(1(, 1);
            if (response.data.success) {
                toast.success(response.data.success);
                res = "success";
            } else {
                toast.error(response.data.error);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    return res;
}