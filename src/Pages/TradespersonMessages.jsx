import { useState, useEffect, useRef } from 'react';
import { Search, Paperclip, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from '../Components/Jobs/Navbar';
import socket from '../socket';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdSend } from "react-icons/io";
import icon1 from "../assets/Jobs/icon1.svg";
import icon2 from "../assets/Jobs/icon2.svg";
import icon3 from "../assets/Jobs/icon3.svg";
import selectedIcon1 from "../assets/Jobs/selectedIcon1.svg";
import selectedIcon2 from "../assets/Jobs/selectedIcon2.svg";
import selectedIcon3 from "../assets/Jobs/selectedIcon3.svg";
import { FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { GrDocumentPdf } from "react-icons/gr";
import { AiOutlineFileExcel, AiOutlineFileText, AiOutlineFileWord, AiOutlineFile } from "react-icons/ai";
import ImageModal from "../Components/ImageModal"
import { encryptMessage, decryptMessage } from '../services/cryptoUtils';
import UserProfileStandalone from '../Components/UserProfileStandalone';

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

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
}

function TradespersonMessages() {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [subMessages, setSubMessages] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [showConversationsList, setShowConversationsList] = useState(true);
    const user_id = localStorage.getItem("user_id");
    const chatContainerRef = useRef(null);
    const currentReceiverRef = useRef("");
    const groupedMessages = groupMessagesByDate(subMessages);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const oldestMessageIdRef = useRef(null);
    const fileInputRef = useRef(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [sendingFiles, setSendingFiles] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);

    const isInitialLoadRef = useRef(true);
    const loadingRef = useRef(false);
    const lastFetchTimeRef = useRef(0);
    const lastFetchIdRef = useRef(null);

    const openImageModal = (imageSrc) => {
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
    };

    const CHUNK_SIZE = 1024 * 1024;

    const sendFileOverSocket = (media, receiver_id, onComplete) => {
        const { file } = media;
        let offset = 0;
        const reader = new FileReader();

        const sendNext = () => {
            const slice = file.slice(offset, offset + CHUNK_SIZE);
            reader.readAsArrayBuffer(slice);
        };

        reader.onload = (e) => {
            const chunk = new Uint8Array(e.target.result);
            const isLast = offset + CHUNK_SIZE >= file.size;
            const chunkSize = chunk.length;

            socket.emit("file_chunk", {
                sender_id: user_id,
                receiver_id,
                fileName: file.name,
                filesize: chunkSize,
                chunk: Array.from(chunk),
                isLast
            }, () => {
                if (isLast && onComplete) onComplete();
            });

            offset += CHUNK_SIZE;
            if (!isLast) sendNext();
        };

        sendNext();
    };

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowConversationsList(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatChatList = (chatList) => {
        return chatList.map(chat => ({
            id: chat.user_id,
            name: chat.name,
            avatar: chat.profile_pictures,
            lastMessage: chat.last_message,
            time: chat.last_message_time,
            unread: chat.unread_count,
            user_type: chat.user_type,
            is_online: chat.is_online,
            last_seen_time: chat.last_seen_time,
        }));
    };

    const currentConversation = conversations.find(conv => conv.id === selectedConversation);

    const updateConversationList = (receiver_id, message, isOwn = false, time = new Date()) => {
        setConversations(prevConversations =>
            prevConversations.map(conv => {
                if (conv.id === receiver_id) {
                    return {
                        ...conv,
                        lastMessage: message,
                        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        unread: isOwn ? conv.unread : conv.unread + 1
                    };
                }
                return conv;
            })
        );
    };

    const handleSendMessage = () => {
        const trimmedMessage = messageInput.trim();
        if (!trimmedMessage && selectedImages.length === 0) return;

        const receiver_id = selectedConversation;
        const userId = localStorage.getItem("user_id");

        if (trimmedMessage) {
            const encryptedMsg = encryptMessage(trimmedMessage);

            socket.emit("send_message", {
                sender_id: userId,
                receiver_id,
                message: encryptedMsg,
                image: null,
                file: null
            });

            updateConversationList(receiver_id, trimmedMessage, true);
        }

        selectedImages.forEach(media => {
            const isImage = media.file.type.startsWith("image/");
            const isVideo = media.file.type.startsWith("video/");
            const isOther = !isImage && !isVideo;

            const tempId = `temp-${Date.now()}-${Math.random()}`;

            setSendingFiles(prev => [
                ...prev,
                {
                    id: tempId,
                    preview: media.preview,
                    fileName: media.file.name,
                    fileSize: media.file.size,
                    fileType: media.file.type.split('/')[1],
                    isImage,
                    isVideo,
                    isOther
                }
            ]);

            const finishSending = () => {
                setSendingFiles(prev => prev.filter(f => f.id !== tempId));
            };

            if (isImage && media.file.size < CHUNK_SIZE) {
                socket.emit("send_message", {
                    sender_id: userId,
                    receiver_id,
                    message: "",
                    image: media.preview,
                    file: null
                }, finishSending);
            } else {
                sendFileOverSocket(media, receiver_id, finishSending);
            }
        });

        setSubMessages(prev => {
            const messages = [...prev];
            const uniqueMessages = messages.reduce((acc, msg) => {
                if (!acc.find(m => m.id === msg.id)) {
                    acc.push(msg);
                }
                return acc;
            }, []);
            return uniqueMessages;
        });

        setMessageInput("");
        setSelectedImages([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (messageInput.trim() || selectedImages.length > 0) {
                handleSendMessage();
            }
        }
    };

    const fetchMoreMessages = () => {
        const now = Date.now();

        if (now - lastFetchTimeRef.current < 2000) {
            // console.log("⏱Too soon, skipping...");
            return;
        }

        if (!selectedConversation || loadingRef.current || !hasMore || subMessages.length === 0 || isLoading) {
            // console.log("Skipping fetch");
            return;
        }

        const sortedMessages = [...subMessages].sort((a, b) => a.id - b.id);
        const oldestMessageId = sortedMessages[0].id;

        if (lastFetchIdRef.current === oldestMessageId) {
            // console.log("Already fetching this ID, skipping...");
            return;
        }

        loadingRef.current = true;
        setIsLoading(true);
        lastFetchTimeRef.current = now;
        lastFetchIdRef.current = oldestMessageId;

        // console.log("Fetching older messages before ID:", oldestMessageId);

        socket.emit("get_sub_chat", {
            user_id,
            receiver_id: currentReceiverRef.current,
            max_id: oldestMessageId,
        });
    };

    const handleConversationClick = (conversationId) => {
        setMessageInput("")
        setSelectedConversation(conversationId);
        currentReceiverRef.current = conversationId;
        setSubMessages([])
        setHasMore(true);
        setIsLoading(false);
        loadingRef.current = false;
        isInitialLoadRef.current = true;
        lastFetchTimeRef.current = 0;
        lastFetchIdRef.current = null;

        setConversations(prev => prev.map(conv => ({
            ...conv,
            active: conv.id === conversationId
        })));

        if (isMobile) {
            setShowConversationsList(false);
        }

        socket.emit("get_sub_chat", { user_id, receiver_id: conversationId, max_id: 0 });

        const convo = conversations.find(c => c.id === conversationId);

        if (convo && convo.unread > 0) {
            socket.emit("read_message", {
                sender_id: conversationId,
                receiver_id: user_id
            });
        }
    };

    const handleBackToConversations = () => {
        if (isMobile) {
            setShowConversationsList(true);
            setSelectedConversation(null);
        }
    };

    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return;

        socket.connect();
        socket.emit("register", user_id);

        socket.on("get_main_chat", (chatList) => {
            const formatted = formatChatList(chatList);
            setConversations(formatted);
            setIsLoadingConversations(false);
        });

        socket.on("error", (err) => console.error("Socket error:", err));

        socket.emit("get_main_chat", { user_id });

        socket.on("get_sub_chat", (messages) => {
            if (!messages || !messages.length) {
                // console.log("No more messages");
                setHasMore(false);
                setIsLoading(false);
                loadingRef.current = false;
                lastFetchIdRef.current = null;
                return;
            }

            const latestMessage = messages[messages.length - 1];
            let otherId = null;
            setSendingFiles([])

            if (parseInt(latestMessage.sender_id) === parseInt(user_id)) {
                otherId = latestMessage.receiver_id;
            } else if (parseInt(latestMessage.receiver_id) === parseInt(user_id)) {
                otherId = latestMessage.sender_id;
            }

            if (otherId === currentReceiverRef.current) {
                if (messages.length < 15) {
                    // console.log("Received less than 15 messages, no more to load");
                    setHasMore(false);
                }

                const unreadMessages = messages.filter(
                    msg => !msg.is_me && !msg.is_read
                );

                if (unreadMessages.length > 0) {
                    socket.emit("read_message", {
                        sender_id: otherId,
                        receiver_id: user_id
                    });
                }

                const formattedMessages = messages.map(msg => ({
                    id: msg.id,
                    sender: msg.is_me ? "You" : currentConversation?.name || "User",
                    avatar: msg.is_me ? "YOUR_AVATAR_URL" : currentConversation?.avatar,
                    message: msg.message,
                    image: msg.image,
                    file: msg.file,
                    fileName: msg.file_name,
                    fileSize: msg.file_size ? parseInt(msg.file_size) : null,
                    fileType: msg.file_name ? msg.file_name.split('.').pop().toUpperCase() : null,
                    time: msg.created_at,
                    date_time: msg.date_time,
                    isOwn: msg.is_me
                }));

                setSubMessages(prev => {
                    const combined = [...prev, ...formattedMessages];
                    const unique = combined.reduce((acc, msg) => {
                        if (!acc.find(m => m.id === msg.id)) acc.push(msg);
                        return acc;
                    }, []);
                    return unique.sort((a, b) => b.id - a.id);
                });

                // console.log("Messages loaded successfully");

                setIsLoading(false);
                loadingRef.current = false;

                setTimeout(() => {
                    lastFetchIdRef.current = null;
                    // console.log("Ready for next fetch");
                }, 1000);

                if (isInitialLoadRef.current) {
                    setTimeout(() => {
                        const container = chatContainerRef.current;
                        if (container) {
                            container.scrollTop = container.scrollHeight;
                        }
                        isInitialLoadRef.current = false;
                    }, 100);
                }

                setSendingFiles([])
                const latestMsg = formattedMessages[formattedMessages.length - 1];
                updateConversationList(latestMsg.isOwn ? selectedConversation : latestMsg.sender_id, latestMsg.message, latestMsg.isOwn);
            }
        });

        socket.on("search_main_chat_result", (filteredChatList) => {
            const formatted = formatChatList(filteredChatList);
            setConversations(formatted);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
                    Select a conversation from the left to start messaging with your contacts.
                </p>
            </div>
        </div>
    );

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remainingSlots = 8 - selectedImages.length;
        if (remainingSlots <= 0) {
            toast.error("You can only select up to 8 files.");
            e.target.value = null;
            return;
        }

        const filesToAdd = files.slice(0, remainingSlots);

        const readers = filesToAdd.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    resolve({ file, preview: ev.target.result });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(filesData => {
            setSelectedImages(prev => [...prev, ...filesData]);
        });

        e.target.value = null;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user_id) return;
            socket.emit("search_main_chat", { user_id, search_text: searchText });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText]);

    return (
        <>
            <Navbar
                navItems={[
                    { name: "Jobs", path: "/tradesperson/jobs", icon: icon3, iconActive: selectedIcon3 },
                    { name: "Messages", path: "/tradesperson/messages", icon: icon2, iconActive: selectedIcon2 },
                    { name: "My Applications", path: "/tradesperson/myapplications", icon: icon1, iconActive: selectedIcon1 }
                ]}
                showSearch={false}
            />

            <div className='-mt-8 2xl:mt-4'>
                {!showProfile && (
                    <div className={`container mx-auto px-4 md:px-8 flex items-center justify-between ${isMobile && !showConversationsList ? 'hidden' : ''}`}>
                        <p className='text-[#1A202C] text-xl sm:text-2xl font-bold'>Messages</p>
                    </div>
                )}

                <div className="container mx-auto py-2 sm:py-3 px-2 sm:px-0">
                    {showProfile ? (
                        <UserProfileStandalone user_id={currentReceiverRef.current} onBack={() => setShowProfile(false)} />
                    ) : (
                        <div className="bg-white rounded-lg h-[calc(100vh-100px)] sm:h-[calc(100vh-180px)] flex relative overflow-hidden">

                            <div className={`${isMobile ? 'absolute inset-0 z-10' : 'w-80 relative'} ${isMobile && !showConversationsList ? 'hidden' : ''} border-r bg-[#F6F6F7] border-gray-200 flex flex-col rounded-[16px] ${isMobile ? 'rounded-[16px]' : ''}`}>
                                <div className="p-3 sm:p-4 h-[65px] sm:h-[81px] flex-shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
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
                                    ) : conversations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center mt-10 text-gray-500 px-4">
                                            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                                            <p className="text-center text-sm">No conversations yet</p>
                                        </div>
                                    ) : (
                                        conversations.map((conversation) => (
                                            <div
                                                key={conversation.id}
                                                className={`flex items-center p-3 sm:p-4 cursor-pointer transition-colors rounded-[12px] sm:rounded-[16px] mb-1
        ${selectedConversation === conversation.id
                                                        ? "bg-[#152A45]"
                                                        : "hover:bg-gray-50 border-b border-[#ebebeb]"}`
                                                }
                                                onClick={() => handleConversationClick(conversation.id)}
                                            >
                                                {console.log(conversation)}
                                                <img
                                                    src={conversation.avatar}
                                                    alt={conversation.name}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 object-cover"
                                                />
                                                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p
                                                            className={`truncate ${selectedConversation === conversation.id ? "text-white" : "text-[#1A202C]"
                                                                } font-inter font-semibold text-sm sm:text-[16px] leading-5 sm:leading-6 tracking-normal`}
                                                        >
                                                            {conversation.name}
                                                        </p>
                                                        <span
                                                            className={`truncate ${selectedConversation === conversation.id ? "text-gray-300" : "text-[#718096]"
                                                                } font-inter font-semibold text-xs sm:text-[14px] leading-4 sm:leading-[22px] tracking-normal ml-2 flex-shrink-0`}
                                                        >
                                                            {conversation.time}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p
                                                            className={`truncate ${selectedConversation === conversation.id ? "text-gray-300" : "text-[#1A202C]"
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
                            ) : selectedConversation ? (
                                <div className={`${isMobile ? 'absolute inset-0 z-20' : 'flex-1'} ${isMobile && showConversationsList ? 'hidden' : ''} flex flex-col mx-1 sm:mx-4 border border-[#D8DDE6] rounded-[16px] ${isMobile ? 'mx-0 border-0' : ''}`}>
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

                                            {currentConversation?.avatar ? (
                                                <img
                                                    src={currentConversation.avatar}
                                                    alt={currentConversation?.name || "User"}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 object-cover"
                                                />
                                            ) : (
                                                <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 flex-shrink-0" />
                                            )}
                                            <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                                                <p className="truncate font-inter font-semibold text-sm sm:text-[16px] leading-5 sm:leading-[24px] tracking-normal">
                                                    {currentConversation?.name || "Select a conversation"}
                                                </p>
                                                <p className="font-inter font-medium text-xs sm:text-[14px] leading-4 sm:leading-[22px] tracking-normal text-[#718096] truncate">
                                                    <span
                                                        className={`${currentConversation.is_online ? "text-[#1d821a] font-semibold" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {currentConversation.is_online
                                                            ? "Online"
                                                            : currentConversation.last_seen_time !== null
                                                                ? `Last seen ${currentConversation.last_seen_time}`
                                                                : currentConversation.user_type}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            className="bg-[#152A45] text-white px-2 sm:px-4 h-[36px] sm:h-[44px] w-[80px] sm:w-[123px] rounded-lg text-xs sm:text-sm cursor-pointer font-medium hover:bg-[#1e3a5f] transition-colors flex-shrink-0"
                                            onClick={() => setShowProfile(true)}
                                        >
                                            <span className=" sm:inline text-[10px] sm:text-sm">View Profile</span>
                                        </button>
                                    </div>

                                    <div
                                        id="scrollableDiv"
                                        ref={chatContainerRef}
                                        className="flex-1 p-2 sm:p-4 bg-[#FCFCFD] overflow-y-auto flex flex-col-reverse"
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
                                                    <div className="text-center py-3 text-sm text-gray-400">
                                                        {/* No more messages */}
                                                    </div>
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
                                                            const prevMessage = arr[index - 1];
                                                            const nextMessage = arr[index + 1];

                                                            const isStartOfGroup =
                                                                !prevMessage ||
                                                                prevMessage.isOwn !== message.isOwn ||
                                                                new Date(message.date_time).getTime() - new Date(prevMessage.date_time).getTime() > 5 * 60 * 1000;

                                                            const isEndOfGroup =
                                                                !nextMessage ||
                                                                nextMessage.isOwn !== message.isOwn ||
                                                                new Date(nextMessage.date_time).getTime() - new Date(message.date_time).getTime() > 5 * 60 * 1000;

                                                            const bubbleClasses = ` px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${message.isOwn ? "bg-gray-800 text-white" : "bg-[#F6F6F7] text-[#1A202C]"} ${isStartOfGroup ? (message.isOwn ? "rounded-tr-none" : "rounded-tl-none") : ""}`;
                                                            return (
                                                                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-2 sm:mb-2`}>
                                                                    {!message.isOwn && isStartOfGroup && (
                                                                        currentConversation?.avatar ? (
                                                                            <img
                                                                                src={currentConversation.avatar}
                                                                                alt={currentConversation?.name || "User"}
                                                                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-1 sm:mr-2 flex-shrink-0 object-cover"
                                                                            />
                                                                        ) : (
                                                                            <FaUserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mr-1 sm:mr-2 flex-shrink-0" />
                                                                        )
                                                                    )}
                                                                    {!message.isOwn && !isStartOfGroup && <div className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" />}

                                                                    <div className="max-w-[75%] sm:max-w-xs lg:max-w-md">
                                                                        {isStartOfGroup && !message.isOwn && (
                                                                            <p className="text-xs sm:text-sm font-semibold text-[#1A202C] mb-1">
                                                                                {currentConversation?.name || "User"}
                                                                            </p>
                                                                        )}

                                                                        {message.message && (
                                                                            <div className={bubbleClasses}>
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
                                                                                        {message.fileName || "Document"}
                                                                                    </p>
                                                                                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-[14px] font-normal text-[#152A45]">
                                                                                        <span>{Math.round((message.fileSize || 0) / 1024)}KB</span>
                                                                                        <span>|</span>
                                                                                        <span>{message.fileType || "PDF"}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <a
                                                                                    href={message.file}
                                                                                    download={message.fileName}
                                                                                    className="flex-shrink-0 text-[#1773E2] hover:text-gray-600 transition-colors"
                                                                                >
                                                                                    <IoMdDownload className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                                                                                </a>
                                                                            </div>
                                                                        )}

                                                                        {isEndOfGroup && (
                                                                            <div className={`text-xs text-gray-500 mt-1 ${message.isOwn ? "text-right" : "text-left"}`}>
                                                                                {new Date(message.date_time).toLocaleTimeString([], {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {message.isOwn && isStartOfGroup && (
                                                                        <img
                                                                            src={localStorage.getItem("profilepictures")}
                                                                            alt="You"
                                                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ml-1 sm:ml-2 flex-shrink-0 object-cover"
                                                                        />
                                                                    )}
                                                                    {message.isOwn && !isStartOfGroup && <div className="w-6 h-6 sm:w-8 sm:h-8 ml-1 sm:ml-2" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </InfiniteScroll>
                                    </div>
                                    {sendingFiles.map(file => (
                                        <div key={file.id} className="flex justify-end mb-2 sm:mb-4 animate-pulse bg-[#fcfcfd]">
                                            <div className="max-w-[75%] sm:max-w-xs lg:max-w-md bg-gray-200 rounded-xl px-4 py-2 mr-3">
                                                {file.isImage && <div className="h-32 w-42 rounded-sm px-3" />}
                                                {file.isOther && (
                                                    <div className="h-12 w-full flex items-center justify-between px-3 mr-12">
                                                        <div className="h-20 w-42 rounded" />
                                                        <div className="flex-1 ml-2">
                                                            <div className="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                                                            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* <div className="mt-1 text-xs text-gray-500">Sending...</div> */}
                                            </div>
                                        </div>
                                    ))}
                                    {selectedImages.length > 0 && (
                                        <div className="px-2 sm:px-4 mb-2">
                                            <div className="flex gap-2 overflow-x-auto py-1">
                                                {selectedImages.map((fileData, idx) => {
                                                    const { file, preview } = fileData;
                                                    const fileType = file.name.split('.').pop().toLowerCase();
                                                    const isImage = file.type.startsWith('image/');

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="relative flex flex-col items-center justify-center w-[80px] sm:w-[120px] h-auto p-1.5 rounded-md bg-gray-100 flex-shrink-0"
                                                        >
                                                            {isImage ? (
                                                                <img
                                                                    src={preview}
                                                                    alt={file.name}
                                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center w-full">
                                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                                                        {getFileIcon(fileType)}
                                                                    </div>
                                                                    <span
                                                                        className="mt-1 text-[9px] sm:text-xs text-center break-words w-full"
                                                                        title={file.name}
                                                                    >
                                                                        {file.name}
                                                                    </span>
                                                                    <span className="text-[8px] text-gray-500">{fileType.toUpperCase()}</span>
                                                                </div>
                                                            )}

                                                            <button
                                                                className="absolute -top-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center text-red-500 shadow cursor-pointer"
                                                                onClick={() =>
                                                                    setSelectedImages(prev => prev.filter((_, i) => i !== idx))
                                                                }
                                                            >
                                                                <IoMdClose className="w-2.5 h-2.5" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-[#FCFCFD]">
                                        <div className="flex items-end space-x-3">
                                            <div className="flex-1 relative bg-gray-50 rounded-[16px] ">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileSelect}
                                                    accept="image/*,video/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                                                    multiple
                                                />

                                                <button
                                                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                                    onClick={() => fileInputRef.current.click()}
                                                >
                                                    <Paperclip className="w-5 h-5" />
                                                </button>

                                                <input
                                                    type="text"
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Message type here..."
                                                    className="w-full pl-10 pr-12 py-3 bg-transparent rounded-[16px] placeholder-gray-500 text-gray-900"
                                                />

                                                <button
                                                    onClick={handleSendMessage}
                                                    disabled={!messageInput.trim() && selectedImages.length === 0}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-[18px] cursor-pointer"
                                                >
                                                    <IoMdSend className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <ImageModal
                                isOpen={isModalOpen}
                                onClose={closeImageModal}
                                imageSrc={modalImage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TradespersonMessages;