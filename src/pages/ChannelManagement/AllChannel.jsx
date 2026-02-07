import { AttachmentIcon, Navigation03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clubAvatar from "../../assets/images/avatar.jpg";
import { clubs as clubData } from "../../constants/clubs";
import { initSocket } from "../../socket"; // import the socket instance

const AllChannel = () => {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const user = useMemo(
    () => authUser || { id: "user-1", fullName: "Demo Admin" },
    [authUser]
  );
  const role = authUser?.role || "admin";
  const channelsData = useMemo(
    () => ({
      data: clubData.map((club, index) => ({
        _id: `channel-${index + 1}`,
        title: `${club.clubname} Channel`,
        clubId: {
          clubProfileImage: "",
          clubName: club.clubname,
        },
        members: club.members,
      })),
    }),
    []
  );
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [leftMenuOpen, setLeftMenuOpen] = useState(null);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const tokenFromStore = authUser?.token;
  // console.log(`token`, token);

  // socket initialized
  useEffect(() => {
    if (!tokenFromStore || !user) return;

    const newSocket = initSocket(tokenFromStore); // pass raw token
    setSocket(newSocket);

    newSocket.connect();

    newSocket.on("connect", () => console.log("✅ Socket connected:", newSocket.id));
    newSocket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    newSocket.on("connect_error", (err) => console.error("Socket connection error:", err));

    return () => {
      newSocket.disconnect();
    };
  }, [tokenFromStore, user]);






  // Join conversation and listen for messages
  useEffect(() => {
    if (!socket || !activeConversation?._id) return;

    socket.emit("join", { convId: activeConversation._id });

    const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleError = (err) => console.error("Socket error:", err);

    socket.on("new-msg", handleNewMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("new-msg", handleNewMessage);
      socket.off("error", handleError);
    };
  }, [socket, activeConversation]);



  // Set conversations when API returns data
  useEffect(() => {
    if (channelsData?.data) {
      setConversations(channelsData.data);
    }
  }, [channelsData]);

  // Update messages when API response changes
  useEffect(() => {
    setMessages([]);
  }, [activeConversation]);

  // Scroll chat to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation?._id || !socket) return;

    const messagePayload = {
      convId: activeConversation._id,
      content: inputValue,
      type: "text",
    };

    socket.emit("send-msg", messagePayload);

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        ...messagePayload,
        senderId: { _id: user.id, role: role, [role]: { fullName: user.fullName } },
        createdAt: new Date(),
      },
    ]);

    setInputValue("");
    // no refetch needed with local data
  };



  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleEdit = (id) => {
    setLeftMenuOpen(null);
    setRightMenuOpen(false);
    navigate(`/channel-management/edit-channel/${id}`);
  };

  const confirmDelete = (id) => {
    setConversationToDelete(id);
    setShowDeleteConfirm(true);
    setLeftMenuOpen(null);
    setRightMenuOpen(false);
  };

  const handleDelete = () => {
    if (!conversationToDelete) return;
    const updated = conversations.filter((c) => c._id !== conversationToDelete);
    setConversations(updated);

    if (activeConversation?._id === conversationToDelete) {
      setActiveConversation(null);
      setMessages([]);
      setShowChat(false);
    }

    setShowDeleteConfirm(false);
    setConversationToDelete(null);
  };

  return (
    <div className="flex h-[calc(100vh-130px)] bg-gray-50">
      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Channel</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this channel? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 bg-white flex flex-col border-r transition-all duration-300
          ${showChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">All Channels</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations?.map((c) => (
            <div
              key={c._id}
              className={`relative flex flex-col p-5 border-b cursor-pointer transition-colors ${activeConversation?._id === c._id
                ? "bg-[#F5EDE8] border-l-4 border-l-[#9D4C1D]"
                : "hover:bg-gray-50"
                }`}
              onClick={() => {
                setActiveConversation(c);
                setLeftMenuOpen(null);
                setShowChat(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <img
                    src={c.clubId.clubProfileImage || clubAvatar}
                    alt="channel"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3 min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {c.title || c.name || "Untitled Channel"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {/* {console.log(c.members)} */}
                      {c.members.length} members
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLeftMenuOpen(leftMenuOpen === c._id ? null : c._id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  ⋮
                </button>
              </div>

              {/* Participants avatars */}
              <div className="flex items-center mt-3">
                <div className="flex -space-x-2">
                  {/* {c.members.slice(0, 4).map((p) => (
                    < img
                      key={p._id}
                      src={p.golfer.profileImage!==null ? p.golfer.profileImage : clubAvatar}
                      alt={p.golfer.fullName}
                      className="w-6 h-6 rounded-full"
                    />
                  ))} */}
                </div>
              </div>

              {leftMenuOpen === c._id && (
                <div className="absolute right-4 top-14 bg-white border rounded-lg shadow z-10 w-32">
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => handleEdit(c._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    onClick={() => confirmDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${showChat ? "flex" : "hidden md:flex"}`}
      >
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="bg-[#9D4C1D] text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <button
                  className="mr-3 md:hidden"
                  onClick={() => setShowChat(false)}
                >
                  ←
                </button>
                <img
                  src={activeConversation.clubId.clubProfileImage || clubAvatar}
                  alt="channel"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold text-xl">
                    {activeConversation.title || activeConversation.name || "Untitled"}
                  </h3>
                  <p className="text-sm opacity-80">Online</p>
                </div>
              </div>
              <button
                onClick={() => setRightMenuOpen(!rightMenuOpen)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                ⋮
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F5EDE8]">
              {messages?.map((m, idx) => {
                const role = m.senderId.role; // "golfer" or "admin"
                const sender = m.senderId[role]; // dynamically access senderId.golfer or senderId.admin
                const senderName = sender?.fullName;
                // const senderAvatar = sender?.profileImage;

                return (
                  <div
                    key={idx}
                    className={`flex mb-3 ${m.senderId._id === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-xs md:max-w-md">
                      {m.senderId._id !== user.id && (
                        <span className="text-xs font-medium text-gray-700">
                          {senderName}
                        </span>
                      )}
                      <div
                        className={`px-4 py-2 rounded-xl ${m.senderId._id === user.id
                          ? "bg-[#9D4C1D] text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                          }`}
                      >
                        {m.content}
                      </div>
                      <div className={`text-xs mt-1 ${m.senderId._id === user.id ? "justify-end" : "justify-start"}"text-gray-600"`}>
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>


            {/* Input */}
            <div className="bg-[#F5EDE8] p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="flex-1 bg-white border rounded-xl flex items-center px-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-2 py-2 bg-transparent focus:outline-none"
                  />

                  {/* Attachment Button */}
                  <label className="text-gray-500 p-1 cursor-pointer flex items-center">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => console.log("Selected file:", e.target.files[0])}
                    />
                    <HugeiconsIcon icon={AttachmentIcon} size={20} />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-[#9D4C1D] text-white rounded-xl px-4 py-2 disabled:opacity-50"
                >
                  <HugeiconsIcon icon={Navigation03Icon} size={24} />
                </button>
              </form>
            </div>

          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a channel to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChannel;
