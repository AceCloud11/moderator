import {Avatar} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import axios from "axios";
import UserContext from "../../../../Context/UserContext";

import './message.css'

export default function Message({ msg, fetch, isMine }){
    const [options, setOptions] = useState(false);
    const { token } = useContext(UserContext);
    //delete message
    const deleteMessage = async (id) => {
        await axios({
            url: "/moderator/messages/" + id,
            method: "delete",
            responseType: "json",
            headers: {
                Authorization: ` Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                fetch();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (

        <div
            className={`chat-message flex items-start  gap-3 ${isMine == "true" ? 'justify-end' : 'justify-end flex-row-reverse'}`}
            // className="flex gap-2 items-start flex-row-reverse justify-end"
            key={msg.id}
        >

            <div className="flex flex-col-reverse">
                <div className="flex flex-col space-y-2 text-xs  mx-2 order-2 items-start">
                    <div>

                        <div
                            onDoubleClick={() => setOptions(!options)}
                            className={`my-msg px-4 pb-2 rounded-lg inline-block rounded-bl-none text-white text-lg  relative space-y-2 ${isMine === "true" ? 'bg-cyan-700' : 'bg-emerald-600'}`}
                            style={{
                                minWidth: 200
                            }}
                            // style={{ backgroundColor: "#05a582" }}
                        >
                            {
                                isMine === "true" ?
                                    (
                                        <i
                                            className="fa fa-trash text-sm absolute right-1 top-1 cursor-pointer hover:text-red-400 hidden"
                                            onClick={() => deleteMessage(msg.id)}
                                        ></i>
                                    )
                                    : null
                            }
                            <span className={`block text-xs text-slate-300 ${isMine === 'true' ? '' : 'pt-2'}`}>
                                {msg.username}
                            </span>
                            <span className="block">
                            {msg.text}
                                </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                        <span className="text-xs text-gray-400 italic">
                          {msg.updated_at.split("T")[1].split(":")[0] +
                              ":" +
                              msg.updated_at.split("T")[1].split(":")[1]}
                        </span>

                </div>
            </div>


            <div>
                <div
                    className="bg-blue-500 flex items-center justify-center"
                    style={{ width: 30, height: 30, borderRadius: "50%" }}
                    title={msg.username}
                >
                    <div className="text-white font-bold">
                        {msg.avatar ? (
                            <Avatar src={msg.avatar} />
                        ) : (
                            <Avatar />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}