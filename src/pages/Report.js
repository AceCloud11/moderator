import axios from 'axios';
import React, { useContext, useState } from 'react';
import UserContext from '../Context/UserContext';
import { useToast } from "@chakra-ui/react";

export default function Report() {
    const [report, setReport] = useState('');
    const [msg, setMsg] = useState('');
    const toast = useToast();

    const { token } = useContext(UserContext);
   const sendReport = async () => {
        if (report !== '') {
           await axios({
             url: "/reports",
             method: "POST",
             responseType: "json",
             data: {
               text: report,
             },
             headers: {
               Authorization: "Bearer " + token,
               Accept: "application/json",
               "Content-Type": "application/json",
             },
           })
             .then((res) => {
                 setMsg(res.data);
                 toast({
                   title: "Report was sent thank you for your feedback",
                   description: "success",
                   status: "success",
                   duration: 9000,
                   isClosable: true,
                   position: "top-right"
                 });
               setReport('');
             })
             .catch((err) => {
               console.error(err);
             }); 
        }
   }
  return (
    <div className="mx-16 space-y-4">
      <h1 className="text-white my-4 text-center text-2xl">
        Dites-nous quel est le problème
      </h1>
      <textarea
        name=""
        id=""
        rows="10"
        placeholder="Report text"
        className="w-full border-2 border-gray-400 rounded-md text-white font-semibold p-3 placeholder:font-bold"
        style={{
          backgroundColor: "#2d3041",
        }}
        value={report}
        onChange={e => setReport(e.target.value)}
      ></textarea>

      <button className="py-2 px-4 rounded-md bg-blue-500 text-white font-semibold"
        onClick={sendReport}
      >Send</button>
    </div>
  );
}
