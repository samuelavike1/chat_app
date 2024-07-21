import {Link, usePage} from "@inertiajs/react";
import GroupAvatar from "@/Components/App/GroupAvatar.jsx";
import UserOptionsDropdown from "@/Components/App/UserOptionsDropdown.jsx";
import UserAvatar from "@/Components/App/UserAvatar.jsx";


const ConversationItem = ({conversation, selectedConversation = null, online = null}) => {

    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transparent";


    if (selectedConversation){
        if (!selectedConversation.is_group && !conversation.is_group && selectedConversation.id === selectedConversation.id){
            classes = "border-blue-500 bg-black/20";
        }

        if (selectedConversation.is_group && conversation.is_group && selectedConversation.id === selectedConversation.id){
            classes = "border-blue-500 bg-black/20";
        }
    }
    return (
        <Link
            href={conversation.is_group ? route("chat.group", conversation) : route("chat.user", conversation)}
            preserveState
            className={`conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/20 ${classes} ${conversation.is_user && currentUser.is_admin ? "pr-2" : "pr-4"}`}
        >
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online} />
            )}

            {conversation.is_group && <GroupAvatar/>}
            <div className={`flex-1 text-xs max-w-full overflow-hidden` +
                (conversation.is_user && conversation.blocked_at ? "opacity-50" : "")}
            >
                <div className="flex gap-1 justify-between items-center">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">{conversation.name}</h3>
                    {conversation.last_message_date && (
                        <span className="text-nowrap">{conversation.last_message_date}</span>
                    )}
                </div>
                {conversation.last_message && (
                    <p className="text-xs overflow-hidden text-nowrap text-ellipsis">{conversation.last_message}</p>
                )}
            </div>
            {currentUser.is_admin && conversation.is_user && (
                <UserOptionsDropdown conversation={conversation} />
            )}
        </Link>

        // console.log('conversation', conversation.is_group)
    );
}

export default ConversationItem
