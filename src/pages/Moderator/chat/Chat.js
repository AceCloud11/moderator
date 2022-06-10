import { Avatar, Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../Context/UserContext";
import "./chat.css";

import { CgMoreO } from "react-icons/cg";
import { BsTrash } from "react-icons/bs";
import Picker from "emoji-picker-react";
import Message from "./components/Message";

export default function Chat() {
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [more, setMore] = useState();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [options, setOptions] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setMessage((old) => old + " " + emojiObject.emoji);
  };

  const { token } = useContext(UserContext);

  const fetchProfile = async () => {
    await axios
      .get("moderator/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        await setUser({
          username: res.data.username,
          email: res.data.email,
        });
      })
      .catch(console.error);
  };

  function getRandomColor(username) {
    var hash = 0;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  }
  

  // fetch messages
  const fetchMessages = async () => {
    await axios({
      url: "/moderator/messages",
      method: "get",
      responseType: "json",
      headers: {
        Authorization: ` Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        res.data.messages.forEach(el => {
          el.bg = getRandomColor(el.username);
        });
        // console.log(res.data.messages);
        setMessages(res.data.messages.reverse());
        setMore(res.data.loadMore);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // send a message
  const sendMessage = async () => {
    if (messages !== "") {
      await axios({
        url: "/moderator/messages",
        method: "post",
        responseType: "json",
        data: {
          text: message,
        },
        headers: {
          Authorization: ` Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          await fetchMessages();
          await setMessage("");
          // setIsTyping(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // load more messages
  const loadMoreMessages = async () => {
    let id = messages[0].id;
    await axios({
      url: "/moderator/messages/load/" + id,
      method: "get",
      responseType: "json",
      headers: {
        Authorization: ` Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        let arr = [...messages];
        let newArr = res.data.messages.reverse().concat(arr);
        setMessages(newArr);
        setMore(res.data.loadMore);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
          fetchMessages();
        })
        .catch((err) => {
          console.error(err);
        });
  }

  useEffect(async () => {
    await fetchProfile();
    await fetchMessages();

    const el = document.getElementById("messages");
    el.scrollTop = el.scrollHeight;

    return () => {};
  }, []);

  return (
    <div>
      <div
        className="flex-1 p:2 sm:p-6 justify-between flex flex-col"
        style={{ height: 960 }}
      >
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch pb-24 md:pb-0"
        >
          {more ? (
            <div className="flex justify-center">
              <Button
                leftIcon={<CgMoreO />}
                colorScheme="cyan"
                variant="solid"
                onClick={loadMoreMessages}
              >
                Load more
              </Button>
            </div>
          ) : null}
          {messages.length
            ? messages.map((msg) =>
                msg.username === user.username ? (
                  <Message msg={msg} fetch={fetchMessages} isMine="true"/>
                ) : (
                 <Message msg={msg} fetch={fetchMessages} isMine="false"/>
                )
              )
            : null}
        </div>

        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0 relative fixed bottom-24 md:bottom-0 pb-4 bg-white">
          <div
            className="absolute bottom-24 z-40"
            style={{ display: showEmoji ? "block" : "none" }}
          >
            <Picker onEmojiClick={onEmojiClick} />
          </div>
          <div className="relative md:flex bg-gray-200 p-3 rounded-md space-y-4">

            <textarea
              rows={1}
              type="text"
              placeholder="Rédigez votre message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 p-2 bg-gray-200 rounded-md py-3 resize-none "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="items-start inset-y-0 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                  style={{ color: showEmoji ? "tomato" : "gray" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 focus:outline-none"
                onClick={sendMessage}
              >
                <span className="font-bold">Envoyer</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
