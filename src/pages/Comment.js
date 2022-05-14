import React, { useContext, useState } from "react";
import { Avatar, Badge } from "@chakra-ui/react";
import UserContext from "../Context/UserContext";
import axios from "axios";

export default function Comment({
  com,
  likeComment,
  dislikeComment,
  updateState,
}) {
  const { token } = useContext(UserContext);

  const [isRespond, setIsRespond] = useState(false);
  const [response, setRespond] = useState("");

  const sendRespond = async (id) => {
    if (response !== null) {
      await axios({
        url: "/comments/respond/" + id,
        method: "post",
        responseType: "json",
        data: {
          text: response,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(async (res) => {
          // console.log(res.data);
          setIsRespond(!isRespond);
          setRespond("");
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <article
      className="rounded-md p-4 relative"
      key={com.id}
      style={{ backgroundColor: "#30365aa4" }}
    >
      <div>
        <div className="flex items-center gap-4 ">
          <Avatar
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            size="md"
          />
          <span className="text-sm font-bold text-gray-500">
            {com.username}
          </span>
        </div>

        {com.parent_id !== null ? (
          <p
            className="p-2 text-gray-400 rounded-md mt-4"
            style={{ backgroundColor: "rgba(48, 54, 90, 0.4)" }}
            dangerouslySetInnerHTML={{ __html: com.parent.text }}
          ></p>
        ) : null}

        <div
          className="p-4 text-white ml-8"
          dangerouslySetInnerHTML={{ __html: com.text }}
        >
          {/* <p>
                          { com.text}
                        </p> */}
        </div>

        <div className="flex justify-between p-4">
          <button
            className="text-blue-600 font-bold"
            onClick={() => setIsRespond(!isRespond)}
          >
            Repondre
          </button>
          <article className="flex gap-2 flex-row-reverse">
            <div className="space-x-2 flex items-center">
              <Badge colorScheme="red">{com.dislikes}</Badge>
              <button
                title="dislike commentaire"
                className="bg-red-700 px-2 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  if (token) {
                    dislikeComment(com.id);
                  } else {
                    window.location.href = "/login";
                  }
                }}
              >
                <i className="fa-solid fa-thumbs-down text-white text-xl"></i>
              </button>
            </div>

            <div className="space-x-2 flex items-center">
              <Badge colorScheme="green">{com.likes}</Badge>
              <button
                title="like commentaire"
                className="bg-blue-500 px-2  rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  if (token) {
                    likeComment(com.id);
                  } else {
                    window.location.href = "/login";
                  }
                }}
              >
                <i className="fa-solid fa-thumbs-up text-white text-xl"></i>
              </button>
            </div>
          </article>
        </div>
        <div style={{ display: isRespond ? "block" : "none" }}>
          <textarea
            rows="3"
            className="w-full rounded-md bg-transparent resize-none border border-gray-200 focus:outline-none p-2 text-white"
            style={{ backgroundColor: "rgba(48, 54, 90, 0.4)" }}
            value={response}
            onChange={(e) => setRespond(e.target.value)}
          />
          <button
            className="bg-blue-600 p-2 rounded-md text-white font-bold"
            onClick={(e) => {
              e.preventDefault();
              sendRespond(com.id);
            }}
          >
            Envoyer repondre
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 space-x-4">
        <button
          title="signaler commentaire"
          className=" p-2 rounded-md"
          onClick={(e) => {
            if (token) {
              updateState(true, com.id);
            } else {
              window.location.href = "/login";
            }
          }}
        >
          <i className="fa-solid fa-flag text-gray-300 text-md"></i>
        </button>
      </div>
    </article>
  );
}
