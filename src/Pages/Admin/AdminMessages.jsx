import { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, ArrowLeft } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "../../Components/Jobs/Navbar";
import socket from "../../socket";
import "react-toastify/dist/ReactToastify.css";
import icon3 from "../../assets/Jobs/icon3.svg";
import selectedIcon3 from "../../assets/Jobs/selectedIcon3.svg";
import { IoMdDownload } from "react-icons/io";
import { GrDocumentPdf } from "react-icons/gr";
import {
    AiOutlineFileExcel,
    AiOutlineFileText,
    AiOutlineFileWord,
    AiOutlineFile,
} from "react-icons/ai";
import icon4 from "../../assets/Jobs/icon4.svg";
import icon5 from "../../assets/Jobs/icon5.svg";
import usericon from "../../assets/Jobs/users.svg";
import selectedIcon4 from "../../assets/Jobs/selectedIcon4.svg";
import selectedIcon6 from "../../assets/Jobs/selectedIcon6.svg";
import categoryicon from "../../assets/Jobs/category.svg";
import ImageModal from "../../Components/ImageModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { decryptMessage } from '../../services/cryptoUtils';

const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || "";
    switch (type) {
        case "pdf":
            return <GrDocumentPdf className="w-[30px] h-[30px] text-[#DC2B31]" />;
        case "xls":
        case "xlsx":
            return <AiOutlineFileExcel className="w-[30px] h-[30px] text-green-500" />;
        case "csv":
        case "txt":
            return <AiOutlineFileText className="w-[30px] h-[30px] text-gray-500" />;
        case "doc":
        case "docx":
            return <AiOutlineFileWord className="w-[30px] h-[30px] text-blue-500" />;
        default:
            return <AiOutlineFile className="w-[30px] h-[30px] text-gray-400" />;
    }
};

const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const groupMessagesByDate = (messages) => {
    const grouped = messages.reduce((acc, msg) => {
        const dateLabel = getDateLabel(msg.date_time);
        if (!acc[dateLabel]) acc[dateLabel] = [];
        acc[dateLabel].push(msg);
        return acc;
    }, {});

    Object.keys(grouped).forEach((date) => {
        grouped[date].sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
    });

    return grouped;
};

function AdminMessages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [subMessages, setSubMessages] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [showConversationsList, setShowConversationsList] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const chatContainerRef = useRef(null);
    const currentChatUsersRef = useRef({ userA: null, userB: null });
    const isInitialLoadRef = useRef(true);
    const loadingRef = useRef(false);
    const lastFetchTimeRef = useRef(0);
    const lastFetchIdRef = useRef(null);
    const fetchedConversationsRef = useRef({});
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);

    const openImageModal = (imageSrc) => {
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
    };

    const currentConversation =
        conversations.find((c) => c.id === selectedConversation) || null;

    const admin_id = localStorage.getItem("user_id");

    useEffect(() => {
        const grouped = groupMessagesByDate(subMessages);
        setGroupedMessages(grouped);
    }, [subMessages]);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setShowConversationsList(true);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        socket.connect();
        socket.emit("register", admin_id);

        socket.on("get_admin_main_chat", (chatList) => {
            const formatted = chatList.map((chat) => {
                const userA = {
                    id: chat.user_a_id,
                    name: chat.user_a_name,
                    avatar: chat.user_a_profile,
                };
                const userB = {
                    id: chat.user_b_id,
                    name: chat.user_b_name,
                    avatar: chat.user_b_profile,
                };
                return {
                    id: `${userA.id}-${userB.id}`,
                    name: `${userA.name} & ${userB.name}`,
                    avatars: [userA.avatar, userB.avatar],
                    lastMessage: chat.last_message,
                    time: chat.last_message_time,
                    unread: chat.unread_admin_count,
                    userA: userA.id,
                    userB: userB.id,
                };
            });
            setConversations(formatted);
            setIsLoadingConversations(false);
        });

        socket.emit("get_admin_main_chat", { admin_user_id: admin_id });

        return () => {
            socket.disconnect();
        };
    }, [admin_id]);

    useEffect(() => {
        const handleSubChat = (messages) => {
            const { userA, userB } = currentChatUsersRef.current;

            if (!messages || messages.length === 0) {
                setHasMore(false);
                setIsLoading(false);
                loadingRef.current = false;
                lastFetchIdRef.current = null;
                return;
            }

            const belongsToCurrentConversation = messages.some(
                (msg) =>
                    (parseInt(msg.sender_id) === parseInt(userA) && parseInt(msg.receiver_id) === parseInt(userB)) ||
                    (parseInt(msg.sender_id) === parseInt(userB) && parseInt(msg.receiver_id) === parseInt(userA))
            );

            if (!belongsToCurrentConversation) {
                setIsLoading(false);
                loadingRef.current = false;
                lastFetchIdRef.current = null;
                return;
            }

            if (messages.length < 15) setHasMore(false);

            const updated = messages.map((msg) => ({
                ...msg,
                isRight: parseInt(msg.sender_id) === parseInt(userB),
                isOwn: parseInt(msg.sender_id) === parseInt(userA),
            }));

            setSubMessages((prev) => {
                const combined = [...prev, ...updated];
                const unique = combined.reduce((acc, msg) => {
                    if (!acc.find((m) => m.id === msg.id)) acc.push(msg);
                    return acc;
                }, []);
                return unique.sort((a, b) => b.id - a.id);
            });

            setIsLoading(false);
            loadingRef.current = false;
            setTimeout(() => {
                lastFetchIdRef.current = null;
            }, 500);

            if (isInitialLoadRef.current) {
                setTimeout(() => {
                    const container = chatContainerRef.current;
                    if (container) container.scrollTop = container.scrollHeight;
                    isInitialLoadRef.current = false;
                }, 100);
            }

            socket.emit("mark_conversation_read", {
                user_a_id: userA,
                user_b_id: userB,
            });
        };

        socket.on("get_sub_chat", handleSubChat);
        return () => socket.off("get_sub_chat", handleSubChat);
    }, []);

    const fetchMoreMessages = () => {
        const now = Date.now();

        if (now - lastFetchTimeRef.current < 2000) return;
        if (!currentConversation || loadingRef.current || !hasMore || subMessages.length === 0 || isLoading) return;

        const sortedMessages = [...subMessages].sort((a, b) => a.id - b.id);
        const oldestMessageId = sortedMessages[0].id;

        if (lastFetchIdRef.current === oldestMessageId) return;

        loadingRef.current = true;
        setIsLoading(true);
        lastFetchTimeRef.current = now;
        lastFetchIdRef.current = oldestMessageId;

        socket.emit("get_sub_chat", {
            user_id: currentConversation.userA,
            receiver_id: currentConversation.userB,
            max_id: oldestMessageId,
        });
    };

    const handleConversationClick = (conversationId) => {
        setSelectedConversation(conversationId);
        setSubMessages([]);
        setHasMore(true);
        setIsLoading(false);
        loadingRef.current = false;
        isInitialLoadRef.current = true;
        lastFetchTimeRef.current = 0;
        lastFetchIdRef.current = null;

        if (isMobile) setShowConversationsList(false);

        const convo = conversations.find((c) => c.id === conversationId);
        if (!convo) return;

        currentChatUsersRef.current = {
            userA: convo.userA,
            userB: convo.userB,
        };

        socket.emit("get_sub_chat", {
            user_id: convo.userA,
            receiver_id: convo.userB,
            max_id: 0,
        });

        if (Number(convo.unread) > 0) {
            socket.emit("mark_conversation_read", {
                user_a_id: convo.userA,
                user_b_id: convo.userB,
            });
        }
    };

    const handleBackToConversations = () => {
        if (isMobile) {
            setShowConversationsList(true);
            setSelectedConversation(null);
        }
    };

    const EmptyState = () => (
        <div className="flex-1 flex mx-2 sm:mx-4 rounded-[16px] items-center justify-center border-3 border-[#f6f6f7]">
            <div className="text-center px-4">
                <div className="mb-6">
                    <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                    Welcome to Messages
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-sm">
                    Select a conversation from the left to start messaging with your
                    contacts.
                </p>
            </div>
        </div>
    );

    const displayedConversations = searchText.trim() ? searchResults : conversations;

    useEffect(() => {
        const handleSearchResults = (results) => {
            setSearchResults(results);
        };

        socket.on("search_main_chat_result", (results) => {
            const formatted = results.map((chat) => {
                const userA = {
                    id: chat.user_a_id,
                    name: chat.user_a_name,
                    avatar: chat.user_a_profile,
                };
                const userB = {
                    id: chat.user_b_id,
                    name: chat.user_b_name,
                    avatar: chat.user_b_profile,
                };
                return {
                    id: `${userA.id}-${userB.id}`,
                    name: `${userA.name} & ${userB.name}`,
                    avatars: [userA.avatar, userB.avatar],
                    lastMessage: chat.last_message,
                    time: chat.last_message_time,
                    unread: chat.unread_admin_count,
                    userA: userA.id,
                    userB: userB.id,
                };
            });
            setSearchResults(formatted);
        });

        return () => {
            socket.off("search_main_chat_result", handleSearchResults);
        };
    }, []);

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Jobs", path: "/admin/jobs", icon: icon3, iconActive: selectedIcon3 },
                    { name: "Tradepersons", path: "/admin/managetradeperson", icon: usericon, iconActive: selectedIcon4 },
                    { name: "Subcontractors", path: "/admin/managesubcontractor", icon: usericon, iconActive: selectedIcon4 },
                    { name: "Categories", path: "/admin/categories", icon: categoryicon, iconActive: icon4 },
                    { name: "All Chats", path: "/admin/messages", icon: selectedIcon6, iconActive: icon5 }
                ]}
                showProfile={false}
                showSearch={false}
            />

            <div
                className={`container mx-auto px-4 md:px-8 flex items-center justify-between ${isMobile && !showConversationsList ? "hidden" : ""
                    }`}
            >
                <p className="text-[#1A202C] text-xl sm:text-2xl font-bold">Messages</p>
            </div>

            <div className="container mx-auto py-2 sm:py-3 px-2 sm:px-0">
                <div className="bg-white rounded-lg h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] flex relative overflow-hidden">
                    <div
                        className={`${isMobile ? "absolute inset-0 z-10" : "w-80 relative"
                            } ${isMobile && !showConversationsList ? "hidden" : ""
                            } border-r bg-[#F6F6F7] border-gray-200 flex flex-col rounded-[16px] ${isMobile ? "rounded-[16px]" : ""
                            }`}
                    >
                        <div className="p-3 sm:p-4 h-[65px] sm:h-[81px] flex-shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        socket.emit("search_admin_main_chat", { user_id: admin_id, search_text: e.target.value });
                                    }}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex-1 bg-[#F6F6F7] overflow-y-auto no-scrollbar">
                            {isLoadingConversations ? (
                                <div className="flex flex-col space-y-3 p-3">
                                    {[...Array(4)].map((_, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 py-2 px-1 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-3 bg-gray-300 rounded w-3/4" />
                                                <div className="h-3 bg-gray-300 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : displayedConversations?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center mt-10 text-gray-500 px-4">
                                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                                    <p className="text-center text-sm">No conversations yet</p>
                                </div>
                            ) : (
                                displayedConversations?.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`flex items-center p-3 sm:p-4 cursor-pointer transition-colors rounded-[12px] sm:rounded-[16px] mb-1
        ${selectedConversation === conversation.id
                                                ? "bg-[#152A45]"
                                                : "hover:bg-gray-50 border-b border-[#ebebeb]"}`
                                        }
                                        onClick={() => handleConversationClick(conversation.id)}
                                    >
                                        <div className="flex -space-x-5">
                                            {conversation?.avatars?.map((avatar, idx) => {
                                                return (
                                                    <div key={idx} className="relative w-8 h-8 sm:w-10 sm:h-10">
                                                        {!loaded && (
                                                            <Skeleton
                                                                circle
                                                                width={40}
                                                                height={40}
                                                                className="absolute top-0 left-0 p"
                                                            />
                                                        )}
                                                        <img
                                                            src={avatar}
                                                            alt={`user-${idx}`}
                                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover ${loaded ? "block" : "hidden"}`}
                                                            onLoad={() => setLoaded(true)}
                                                            onError={() => setLoaded(true)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={`truncate ${selectedConversation === conversation.id
                                                        ? "text-white"
                                                        : "text-[#1A202C]"
                                                        } font-inter font-semibold text-sm sm:text-[16px] leading-5 sm:leading-6 tracking-normal`}
                                                >
                                                    {conversation.name}
                                                </p>
                                                <span
                                                    className={`truncate ${selectedConversation === conversation.id
                                                        ? "text-gray-300"
                                                        : "text-[#718096]"
                                                        } font-inter font-semibold text-xs sm:text-[14px] leading-4 sm:leading-[22px] tracking-normal ml-2 flex-shrink-0`}
                                                >
                                                    {conversation.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p
                                                    className={`truncate ${selectedConversation === conversation.id
                                                        ? "text-gray-300"
                                                        : "text-[#1A202C]"
                                                        } font-inter font-medium text-xs sm:text-[14px] leading-4 sm:leading-[22px] tracking-normal`}
                                                >
                                                    {
                                                        conversation.lastMessage === "Sent an image"
                                                            ? "Sent an image"
                                                            : conversation.lastMessage === "Sent a file"
                                                                ? "Sent a file"
                                                                : conversation.lastMessage && decryptMessage(conversation.lastMessage).trim() !== ""
                                                                    ? decryptMessage(conversation.lastMessage)
                                                                    : "Start a conversation"
                                                    }
                                                </p>
                                                {conversation.unread > 0 && (
                                                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 min-w-[1rem] sm:min-w-[1.25rem] text-center flex-shrink-0">
                                                        {conversation.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {!selectedConversation && !isMobile ? (
                        <EmptyState />
                    ) : (
                        selectedConversation && (
                            <div
                                className={`${isMobile ? "absolute inset-0 z-20" : "flex-1"} ${isMobile && showConversationsList ? "hidden" : ""
                                    } flex flex-col mx-1 sm:mx-4 border border-[#D8DDE6] rounded-[16px] ${isMobile ? "mx-0 border-0" : ""
                                    }`}
                            >
                                <div className="p-3 sm:p-4 border-b bg-[#F6F6F7] border-gray-200 rounded-t-[16px] flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center min-w-0 flex-1">
                                        {isMobile && (
                                            <button
                                                onClick={handleBackToConversations}
                                                className="mr-2 sm:mr-3 p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                                            >
                                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                                            </button>
                                        )}
                                        <div className="flex -space-x-2">
                                            {currentConversation?.avatars.map((avatar, idx) => (
                                                <img
                                                    key={idx}
                                                    src={avatar}
                                                    alt={`user-${idx}`}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                                                />
                                            ))}
                                        </div>
                                        <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                                            <p className="truncate font-inter font-semibold text-sm sm:text-[16px] leading-5 sm:leading-[24px] tracking-normal">
                                                {currentConversation?.name || "Select a conversation"}
                                            </p>
                                            <p className="font-inter font-medium text-xs sm:text-[14px] leading-4 sm:leading-[22px] tracking-normal text-[#718096] truncate">
                                                For Electrician
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    id="scrollableDiv"
                                    ref={chatContainerRef}
                                    className="flex-1 p-2 sm:p-2 bg-[#FCFCFD] overflow-y-auto flex flex-col-reverse"
                                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                                >
                                    <InfiniteScroll
                                        dataLength={subMessages.length}
                                        next={fetchMoreMessages}
                                        style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'visible' }}
                                        inverse={true}
                                        hasMore={hasMore}
                                        loader={
                                            <div className="flex justify-center py-3">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                            </div>
                                        }
                                        scrollableTarget="scrollableDiv"
                                        endMessage={
                                            subMessages.length > 0 && (
                                                <div className="text-center py-3 text-sm text-gray-400"></div>
                                            )
                                        }
                                    >
                                        <div className="space-y-2 sm:space-y-4">
                                            {Object.keys(groupedMessages).reverse().map((date) => (
                                                <div key={date}>
                                                    <div className="flex items-center my-2 text-gray-500 text-xs">
                                                        <div className="flex-grow border-t-2 border-gray-200"></div>
                                                        <span className="px-2">{date}</span>
                                                        <div className="flex-grow border-t-2 border-gray-200"></div>
                                                    </div>
                                                    {groupedMessages[date].map((message, index, arr) => {
                                                        const senderProfile =
                                                            message.sender_id === currentConversation?.userA
                                                                ? currentConversation?.avatars?.[0]
                                                                : currentConversation?.avatars?.[1];

                                                        const senderName =
                                                            message.sender_id === currentConversation?.userA
                                                                ? currentConversation?.name.split(" & ")[0]
                                                                : currentConversation?.name.split(" & ")[1];

                                                        const prevMessage = arr[index - 1];
                                                        const showAvatarAndName =
                                                            !prevMessage ||
                                                            prevMessage.sender_id !== message.sender_id ||
                                                            new Date(message.date_time).getTime() - new Date(prevMessage.date_time).getTime() > 5 * 60 * 1000;

                                                        return (
                                                            <div key={message.id} className="flex justify-start mb-1 sm:mb-2">
                                                                <div className="flex -space-x-2 mr-1 sm:mr-2 w-8 sm:w-10">
                                                                    {showAvatarAndName ? (
                                                                        <img
                                                                            src={senderProfile}
                                                                            alt="sender"
                                                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                    )}
                                                                </div>

                                                                <div className="max-w-[75%] sm:max-w-xs lg:max-w-md">
                                                                    {showAvatarAndName && (
                                                                        <p className="text-xs sm:text-sm font-semibold text-[#1A202C] mb-1">
                                                                            {senderName}
                                                                        </p>
                                                                    )}

                                                                    {message.message && (
                                                                        <div
                                                                            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${message.sender_id === currentConversation?.userA
                                                                                ? "bg-gray-800 text-white rounded-tl-none"
                                                                                : "bg-[#F6F6F7] text-[#1A202C] rounded-tl-none"
                                                                                }`}
                                                                        >
                                                                            <p className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] font-medium font-inter break-words">
                                                                                {decryptMessage(message.message)}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {message.image && (
                                                                        <div className="max-w-xs lg:max-w-md mt-1 sm:mt-2">
                                                                            <img
                                                                                src={message.image}
                                                                                alt="chat-img"
                                                                                className="rounded-lg max-w-full max-h-100 cursor-pointer"
                                                                                onClick={() => openImageModal(message.image)}
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {message.file && (
                                                                        <div className="bg-[#F6F6F7] mt-1 sm:mt-2 rounded-lg p-2 sm:p-3 flex items-center space-x-2 sm:space-x-3 max-w-xs">
                                                                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center">
                                                                                {getFileIcon(message.fileType)}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="font-medium text-sm sm:text-[16px] leading-4 sm:leading-[20px] text-[#152A45] truncate">
                                                                                    {message.file_name || "Document"}
                                                                                </p>
                                                                                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-[14px] font-normal text-[#152A45]">
                                                                                    <span>{Math.round((message.file_size || 0) / 1024)}KB</span>
                                                                                    <span>|</span>
                                                                                    <span>{message.fileType || "PDF"}</span>
                                                                                </div>
                                                                            </div>
                                                                            <a
                                                                                href={message.file}
                                                                                download={message.file_name}
                                                                                className="flex-shrink-0 text-[#1773E2] hover:text-gray-600 transition-colors"
                                                                            >
                                                                                <IoMdDownload className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                                                                            </a>
                                                                        </div>
                                                                    )}

                                                                    {(!arr[index + 1] || arr[index + 1].sender_id !== message.sender_id) && (
                                                                        <div className="text-xs text-gray-500 mt-2 ml-1 mb-2 text-left">
                                                                            {new Date(message.date_time).toLocaleTimeString([], {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </InfiniteScroll>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <ImageModal isOpen={isModalOpen} onClose={closeImageModal} imageSrc={modalImage} />
        </>
    );
}

export default AdminMessages;