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