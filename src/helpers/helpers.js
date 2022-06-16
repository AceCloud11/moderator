import Cookies from "js-cookie";
import axios from "axios";
import {toast} from "react-toastify";


export function paginate(page) {
    let pg;
   if (page !== 1) {
     window.location.search = "page=" + page;
     pg = new URLSearchParams(window.location.search).get("page") || 1;
   }else{
       window.location.search = "";
       pg = 1; 
   }

   return pg;
}

function checkName(name) {
    if (name[0] == 'www' && name.length == 3) {
      // www.youtube.com
      return name[1];
    }else if(name[0] == 'www' && name.length > 3){
      // www.api.youtube.com
      // www.youtube.com.org
      return name[1]
    }
}


export function getNameFromUrl(url) {
  let name = url.split('//')[1].split('/')[0].split('.');
     
  name =
    name.length == 2
      ? name[0]
      : name[1];
  return name;
}

export function logoutUnAuthenticatedUsers(status){
    if (status == 401){
        Cookies.remove("token");
        Cookies.remove("role");
    }
}

export const validateDomain = (arr, hosts, vf) => {
    let err = [];
    let srcs = [];
    let domainNames = hosts.map(el => el.domain_name);
    arr.map(el => {
        if (el === ''){
            return;
        }
        if (!el.includes('http://') && !el.includes('https://')){
            return;
        }
        let domain =  el.split('//')[1].split('/')[0];
        if (!domainNames.includes(domain)){
            err.push(`le domain ${domain} n'est pas autorisée`);
        }else{
            srcs.push(generateSource(domain, el, hosts, vf));
        }
    });
    return [err, srcs];
}

const generateSource = (domain, src, hosts, vf) => {
    let name = hosts.filter(el => el.domain_name == domain)[0].name;
    let obj = {
        name,
        src,
        vf
    };
    return obj;
}

export  const addSources = async (arr, token, id) => {
    let err = [];
    await axios({
        url: "/moderator/movie-sources/" + id,
        method: "post",
        responseType: "json",
        data: {
            sources: arr
        },
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
            err.push(error.response.data.message)

        });
    return err;
};


export const deleteSources = async (srcid, token) => {
    await axios({
        url: "/moderator/movie-sources/" + srcid,
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
            toast.error(error.response.data.message);
        });
};

export const updateSources = async (name, src, srcId, token, h, vf) => {
    let err = [];
    if (name === "" || src === "") {
        err.push("Tout les champs est obligatoire");
        return err;
    }

    if (!src.includes("http://") && !src.includes("https://")) {
        err.push("veuillez entrer un lien valide");
        return err;
    }

    // extract name from the url
    let n = src.split("//")[1].split("/")[0];
    let hosts = h.map(el => el.domain_name);
    if (!hosts.includes(n)) {
        err.push(`la source ${n} n'est pas autorisée`);
        return err;
    }

    await axios({
        url: "/moderator/movie-sources/" + srcId,
        method: "put",
        responseType: "json",
        data: {
            name,
            vf,
            src,
        },
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
            toast.error(error.response.data.message);
        });

    return err;
};

