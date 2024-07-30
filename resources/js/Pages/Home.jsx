import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import {useEffect, useRef, useState} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid/index.js";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";

function Home({ selectedConversation, messages }) {
    // console.log('messages',messages);

    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }, 10)
    },[selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages? messages.data.reverse(): []);
    }, [messages])


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
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))}
                            </div>
                        )}
                    </div>
                    {/*<MessageInput conversation={selectedConversation} />*/}
                </>
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
