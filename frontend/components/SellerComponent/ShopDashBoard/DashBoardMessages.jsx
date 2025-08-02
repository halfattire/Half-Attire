
"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { backend_url, server } from "@/lib/server";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { IoImagesOutline } from "react-icons/io5";
import socketIO from "socket.io-client";
import Image from "next/image";
import { getAvatarUrl, handleAvatarError, getImageUrl, handleImageError } from "@/lib/utils/avatar";

// Update to your WebSocket server URL
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://halfattire-socket.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

function DashBoardMessages() {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const isAdmin = user && user.role === "Admin";
  const [conversation, setConversation] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          },
        );

        setConversation(response.data.conversations);
      } catch (error) {
        // Error fetching conversations
      }
    };
    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`,
        );
        setMessages(response.data.messages);
      } catch (error) {
        // Error fetching messages
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    // Null safety check for seller._id
    if (!seller?._id) {
      console.error("Cannot send message: seller information not available");
      return;
    }

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id,
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            // Error sending message
          });
      }
    } catch (error) {
      // Error in message handler
    }
  };

  const updateLastMessage = async () => {
    // Null safety check for seller._id
    if (!seller?._id) {
      console.error("Cannot update last message: seller information not available");
      return;
    }

    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        // Error updating last message
      });
  };

  // Fetch user data for the conversation
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentChat?.members || !seller?._id) return;
      
      const receiverId = currentChat.members.find(
        (member) => member !== seller._id
      );
      if (!receiverId) return;
        
      try {
        const response = await axios.get(
          `${server}/user/user-info/${receiverId}`,
          { withCredentials: true }
        );
        setUserData(response.data.user);
      } catch (error) {
        // Error fetching user data
      }
    };
    fetchUserData();
  }, [currentChat?._id, seller?._id]); // Only depend on chat ID and seller ID

  return isAdmin && !seller?._id ? (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Admin Access</h3>
        <p className="text-gray-500">Messaging system is available for seller accounts only.</p>
      </div>
    </div>
  ) : (
    <div className="no-scrollbar m-3 h-[82vh] w-[90%] overflow-y-scroll rounded bg-white">
      {!open && (
        <>
          <h1 className="py-4 text-center font-Poppins text-2xl font-semibold">
            All Messages
          </h1>
          {conversation &&
            conversation.map((item, index) => (
              <MessageList
                key={index}
                data={item}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                seller={seller}
                user={user}
              />
            ))}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller?._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          seller={seller}
        />
      )}
    </div>
  );
}

function MessageList({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  seller,
  user, 
}) {
  const [active, setActive] = useState(0);
  const [memberData, setMemberData] = useState(null);

  // Fetch member data for the conversation
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!data?.members || !me) return;
      
      const memberId = data.members.find((member) => member !== me);
      if (!memberId) return;
      
      try {
        const response = await axios.get(`${server}/user/user-info/${memberId}`, {
          withCredentials: true,
        });
        setMemberData(response.data.user);
        setUserData(response.data.user);
      } catch (error) {
        // Error fetching member data
      }
    };
    fetchMemberData();
  }, [data?._id, me]); // Only depend on chat ID and seller ID

  const handleClick = (id) => {
    setOpen(true);
    setCurrentChat(data);
    setActiveStatus(online);
    setActive(index);
  };

  // Determine the message preview prefix and content
  const isLastMessageFromSeller = data.lastMessageId === me;
  const messagePreviewPrefix = isLastMessageFromSeller
    ? "You: "
    : `${memberData?.name || "User"}: `;
  const messagePreview = data.lastMessage || "No messages yet";

  return (
    <div
      className={`flex w-full cursor-pointer p-2 px-3 ${active === index ? "bg-gray-300" : "bg-transparent"}`}
      onClick={() => handleClick(data._id)}
    >
      <div className="relative">
        <img
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          src={getAvatarUrl(memberData?.avatar)}
          alt="User Avatar"
          onError={handleAvatarError}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-lg">{memberData?.name || "Unknown User"}</h1>
        <p className="text-[#000c]">{messagePreviewPrefix}{messagePreview}</p>
      </div>
    </div>
  );
}

function SellerInbox({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  seller,
}) {
  return (
    <div className="flex min-h-full w-full flex-col justify-between">
      {/* message header */}
      <div className="flex w-full items-center justify-between bg-slate-200 p-4">
        <div className="flex items-center">
          <img
            src={getAvatarUrl(userData?.avatar)}
            className="h-12 w-12 rounded-full object-cover"
            alt="User Avatar"
            onError={handleAvatarError}
          />
          <div className="pl-3">
            <h1 className="text-lg font-semibold">{userData?.name || "Unknown User"}</h1>
          </div>
        </div>
        <div>
          <AiOutlineArrowRight
            size={20}
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
      </div>
{/* messages */}
  <div className="no-scrollbar h-[55vh] overflow-y-scroll p-4">
    {messages &&
      messages.map((item, index) => (
        <div
          className={`flex w-full ${item.sender === sellerId ? "justify-end" : "justify-start"}`}
          key={index}
        >
          {item.sender !== sellerId && (
            <img
              src={getAvatarUrl(userData?.avatar)}
              className="h-8 w-8 rounded-full object-cover"
              alt="User Avatar"
              onError={handleAvatarError}
            />
          )}
          <div
            className={`mx-2 mt-2 flex h-min max-w-[40%] flex-col items-start rounded p-2 px-3 text-[#fff] ${
              item.sender === sellerId ? "bg-[#38c776]" : "bg-[#38bdf8]"
            }`}
          >
            {item.text && <p>{item.text}</p>}
            
            {/* Display message images if they exist */}
            {item.images && item.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={getImageUrl(image)}
                    alt="Message attachment"
                    className="max-w-[200px] max-h-[200px] rounded-lg object-cover cursor-pointer"
                    onClick={() => {
                      // Open image in new tab or modal
                      window.open(getImageUrl(image), '_blank');
                    }}
                    onError={handleImageError}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

    <div ref={scrollRef} />
  </div>
      {/* send message input */}
      <div className="flex w-full items-center justify-between border-t border-gray-300 p-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter your message..."
            className="w-full rounded-lg border border-[#38bdf8] bg-[#f5f5f5] p-3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>
        <div className="ml-1 flex cursor-pointer items-center justify-center rounded-full bg-[#38bdf8] p-2">
          <AiOutlineSend size={20} className="text-white" onClick={sendMessageHandler} />
        </div>
      </div>
    </div>
  );
}

export default DashBoardMessages;