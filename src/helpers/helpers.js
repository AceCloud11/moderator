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
