
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

import "../styles/bot.css";

import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";

import sendBtn from "../assets/send.svg";
import userIcon from "../assets/user.png";
import botIcon from "../assets/robot.png";

import { UserInfoContext } from "../context/UserInfoContext";
import { useRef } from "react";

import axios from "axios";

const Bot = () => {

  const botName = useSelector(state => state.botName);
  const fileNames = useSelector((state) => state.fileNames);
  const [input, setInput] = useState("");
  const msgEnd = useRef(null);
  const [messages, setMessages] = useState([
    {
      text: "Hello, I am QnA.AI, your personal assistant. How can I help you today?",
      isBot: true,
    }
  ]);

  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const { display_name } = React.useContext(UserInfoContext); // Get display name from context

  const handleSend = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    console.log(user.uid);


    const text = input;
    setInput(""); 
    // clear the input
    
    setMessages([...messages, { text, isBot: false }]); // add the message to the list of messages
    
    const response = await axios.get(`http://localhost:3001/api/response?user_id=${user.uid}&bot_name=${botName}&prompt=${text}`);
  
    const responseData = await response.data // parse the response data

    console.log(responseData);
  
    console.log(input);
    setMessages([
      ...messages,
      { text, isBot: false},
      { text: responseData, isBot: true }, // use the parsed response data
    ]); // add the message to the list of messages
  };

  return (
    <div className="bot-container">
      <div className="left-container">
        <div className="logo-section">
          <div className="logo-main">QnA.AI</div>
        </div>
        <p>
          <Link to="/QnA-Input">
            <span>Create a New BOT </span>
          </Link>
        </p>
        <div className="prev-chats">
          <h1>Bot Name : <br /> {botName}</h1>
          <ul>
            {fileNames.map((fileName, i) => (
              <li key={i}>
                <p>{fileName}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="profile-menu">
          <div className="profile-name">
            <span>Hii, </span>
            {display_name || "Guest"}
          </div>
        </div>
      </div>

      <div className="right-container">
        <div className="blob"></div>
        <div className="chat-container">
          <div className="chats">
            <div className="chat">
              {messages.map((message, i) => (
                <div key={i} className={message.isBot ? "chat bot" : "chat"}>
                  <img
                    className="chatimg "
                    src={message.isBot ? botIcon : userIcon}
                    alt=""
                  />
                  <p className="txt">{message.text}</p>
                </div>
              ))}
            </div>
            <div ref={msgEnd}></div>
          </div>
          <div className="chatFooter">
            <div className="inp">
              <input
                type="text"
                placeholder="Send a message"
                value={input}
                onKeyDown={handleEnter}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="send" onClick={handleSend}>
                <img src={sendBtn} alt="" />
              </button>
            </div>
            <p> QNA.AI may produce inaccurate information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bot;
