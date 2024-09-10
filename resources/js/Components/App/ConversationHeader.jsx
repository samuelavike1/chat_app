import {Link, usePage} from "@inertiajs/react";
import {ArrowLeftIcon, TrashIcon} from "@heroicons/react/24/solid/index.js";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import GroupAvatar from "@/Components/App/GroupAvatar.jsx";
import {PencilSquareIcon} from "@heroicons/react/24/outline/index.js";
import GroupUsersPopover from "@/Components/App/GroupUsersPopover.jsx";
import GroupDescriptionPopover from "@/Components/App/GroupDescriptionPopover.jsx";
import {useEventBus} from "@/EventBus.jsx";

const ConversationHeader = ({ selectedConversation }) => {
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();

    const onDeletegroup = () => {
        if (!window.confirm("Are you sure you want to delete?")) {
           return;
        }
        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                console.log("group deleted", res);
                emit("toast.show", res.data.message);

            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            {selectedConversation && (
                <div className='p-3 flex justify-between items-center border-b border-slate-700'>
                    <div className='flex items-center gap-3'>
                        <Link
                        href={route("dashboard")}
                        className='inline-block sm:hidden'
                        >
                            <ArrowLeftIcon className='w-6'/>
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && (<GroupAvatar />)}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className='text-xs text-gray-500'>
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover description={selectedConversation.description} />
                            <GroupUsersPopover users={selectedConversation.users}/>
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(ev) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeletegroup}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ConversationHeader;
