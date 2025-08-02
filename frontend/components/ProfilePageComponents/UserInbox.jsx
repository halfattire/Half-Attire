"use client";
import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../../lib/server";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiOutlineArrowRight, AiOutlineSend, AiOutlineMessage } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../style/style";
import { getAvatarUrl, handleAvatarError, getImageUrl, handleImageError } from "@/lib/utils/avatar";

const UserInboxPage = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();

  const socketId = useRef();

  useEffect(() => {
    try {
      socketId.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://halfattire-socket.onrender.com", {
        transports: ["websocket"],
        withCredentials: true, // if your backend uses cookies
        secure: true, // ensures HTTPS websocket
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socketId.current.on("connect", () => {
        console.log("Socket connected to server");
      });

      socketId.current.on("disconnect", () => {
        console.log("Socket disconnected from server");
      });

      socketId.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketId.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    } catch (error) {
      console.error("Socket initialization error:", error);
    }

    return () => {
      if (socketId.current) {
        socketId.current.disconnect();
      }
    };
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
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        // Error fetching conversations
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.current.emit("addUser", sellerId);
      socketId.current.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
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

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socketId.current.emit("sendMessage", {
      senderId: user?._id,
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
          });
      }
    } catch (error) {
      // Error sending message
    }
  };

  const updateLastMessage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: newMessage,
        lastMessageId: user._id,
      }
    );
    setNewMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-600 mt-1">Communicate with sellers</p>
      </div>

      {!open && (
        <div className="p-4">
          {conversations && conversations.length > 0 ? (
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
                router={router}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AiOutlineMessage size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation with a seller</p>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <SellerInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            sellerId={user._id}
            userData={userData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
          />
        </div>
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
  router,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);

  const handleClick = (id) => {
    // Don't navigate away from profile page, just open the chat
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        // Error fetching user data
      }
    };
    getUser();
  }, [me, online, setActiveStatus, data]);

  return (
    <div
      className={`w-full flex p-4 rounded-lg mb-3 transition-all duration-200 ${
        active === index 
          ? "bg-blue-50 border border-blue-100" 
          : "bg-gray-50 hover:bg-gray-100 border border-transparent"
      } cursor-pointer`}
      onClick={(e) => {
        setActive(index);
        handleClick(data._id);
        setCurrentChat(data);
        setUserData(user);
        setActiveStatus(online);
      }}
    >
      <div className="relative">
        <img
          src={getAvatarUrl(user?.avatar)}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
          onError={handleAvatarError}
        />
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{user?.name}</h3>
          <span className="text-xs text-gray-500 ml-2">
            {data?.lastMessageTime && format(data.lastMessageTime)}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">
          {!loading && data?.lastMessageId === me
            ? "You: "
            : user?.name?.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
}) => {
  return (
    <div className="w-full h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center">
          <img
            src={getAvatarUrl(userData?.avatar)}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
            onError={handleAvatarError}
          />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{userData?.name}</h3>
            <span className={`text-sm ${activeStatus ? 'text-green-600' : 'text-gray-500'}`}>
              {activeStatus ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-lg hover:bg-white transition-colors"
        >
          <AiOutlineArrowRight size={20} className="text-gray-600" />
        </button>
      </div>


      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages && messages.length > 0 ? (
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full my-3 ${item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={getAvatarUrl(userData?.avatar)}
                  className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0"
                  alt="User Avatar"
                  onError={handleAvatarError}
                />
              )}

              {item.text !== "" && (
                <div className="max-w-xs lg:max-w-md">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      item.sender === sellerId 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{item.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}

              {/* Display message images if they exist */}
              {item.images && item.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.images.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={getImageUrl(image)}
                      alt="Message attachment"
                      className="max-w-[200px] max-h-[200px] rounded-lg object-cover cursor-pointer shadow-sm"
                      onClick={() => {
                        window.open(getImageUrl(image), '_blank');
                      }}
                      onError={handleImageError}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form
          className="flex items-center gap-3"
          onSubmit={sendMessageHandler}
        >
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <AiOutlineSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInboxPage;