"use client";
import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../../lib/server";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
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
    <div className="w-full">
      {!open && (
        <>
          <Header />
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations &&
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
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
        />
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
    router.push(`/inbox?${id}`);
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
      className={`w-full flex p-3 px-3 ${active === index ? "bg-[#00000010]" : "bg-transparent"
        }  cursor-pointer`}
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
          className="w-[50px] h-[50px] rounded-full object-cover"
          onError={handleAvatarError}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
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


    <div className="w-[full] min-h-full flex flex-col justify-between p-5">
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={getAvatarUrl(userData?.avatar)}
            alt="User Avatar"
            className="w-[60px] h-[60px] rounded-full object-cover"
            onError={handleAvatarError}
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>


      {/* Message */}

      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">

        {/* <div className="flex items-center gap-2">
          <Image
            src={
              userData?.avatar
                ? userData.avatar.startsWith("http")
                  ? userData.avatar
                  : `${backend_url}/${userData.avatar}`
                : "/assets/fallback-avatar.png"
            }
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
            width={48}
            height={48}
          />
          <div className="h-max w-max rounded bg-green-500 px-3 py-2 text-white">
            Hello there!  How can I help you?
          </div>
        </div> */}

        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full my-2 ${item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={getAvatarUrl(userData?.avatar)}
                  className="w-[40px] h-[40px] rounded-full mr-3 object-cover"
                  alt="User Avatar"
                  onError={handleAvatarError}
                />
              )}

              {item.text !== "" && (
                <div>
                  <div
                    className={`w-max p-2 rounded ${item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                      } text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1">
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
          ))}
      </div>

      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        {/* <div className="w-[30px]">
          <input type="file" name="" id="image" className="hidden" />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div> */}
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInboxPage;