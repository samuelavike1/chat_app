import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid/index.js";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import {useEventBus} from "@/EventBus.jsx";
import axios from "axios";
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal.jsx";

function Home({ selectedConversation, messages }) {
    // console.log('messages',messages);

    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const  loadMoreIntersect =useRef(null)
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const messagesCtrRef = useRef(null);
    const { on } = useEventBus();

    const loadMoreMessages = useCallback(() => {

        if (noMoreMessages) {
            return;
        }
        //find first message object
        const firstMessage = localMessages[0];
        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data })=>{
                if (data.data.length === 0){
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
                console.log("tmpScrollFromBottom",tmpScrollFromBottom);
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prevMessages)=>{
                    return [...data.data.reverse(), ...prevMessages];
                })
            })
    }, [localMessages, noMoreMessages])


    const messageCreated = (message) => {
        if (selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

        if (selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    }

    const messageDeleted = (message) => {
        console.log("Received message.deleted event for message:", message);

        if (selectedConversation) {
            console.log("Selected Conversation:", selectedConversation);

            if (selectedConversation.is_group && selectedConversation.id == message.group_id) {
                console.log("Deleting from group messages");
                setLocalMessages((prevMessages) => {
                    const updatedMessages = prevMessages.filter((m) => m.id !== message.id);
                    console.log("Updated messages for group:", updatedMessages);
                    return updatedMessages;
                });
            }

            if (selectedConversation.is_user &&
                (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
                console.log("Deleting from user messages");
                setLocalMessages((prevMessages) => {
                    const updatedMessages = prevMessages.filter((m) => m.id !== message.id);
                    console.log("Updated messages for user:", updatedMessages);
                    return updatedMessages;
                });
            }
        } else {
            console.log("No selectedConversation found");
        }
    };



    const onAttachmentClick = (attachments, ind) => {
        console.log('attachmentsclick', attachments);
        setPreviewAttachment({
            attachments,
            ind,
        })
        setShowAttachmentPreview(true);
    }

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10)
        const offCreated = on('message.created', messageCreated)
        const offDeleted = on('message.deleted', messageDeleted)

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
            offDeleted();
        }
    },[selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages? messages.data.reverse(): []);
    }, [messages])

    useEffect(()=>{
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight - scrollFromBottom;
        }

        if (noMoreMessages){
            return;
        }
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach ((entry)=>entry.isIntersecting && loadMoreMessages()),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        )
        if (loadMoreIntersect.current){
            setTimeout(()=>{
                observer.observe(loadMoreIntersect.current);
            }, 100)
        }

        return()=>{
            observer.disconnect();
        };
    }, [localMessages])


    return (
        <>
            {!messages && (
                <div className='flex flex-col gap-8 items-center justify-center text-center h-full opacity-35'>
                    <div className='text-2xl md:text-4xl py-16 text-slate-200'>
                        Please Select conversation to see messages.
                    </div>
                    <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader selectedConversation={selectedConversation} />
                    <div
                        ref={messagesCtrRef}
                        className='flex-1 overflow-y-auto p-5'
                    >
                        {/*messages*/}
                        {localMessages.length === 0 && (
                            <div className='text-lg text-slate-200'>
                                No Message Found
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className='flex-1 flex flex-col'>
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                    // <MessageItem key={message.id} message={message} attachmentClick={onAttachmentClick} />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout = page => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
        >
            <ChatLayout children={page}/>
        </AuthenticatedLayout>
    )
}

export default Home;
