import {Popover, PopoverButton, PopoverPanel, Transition} from "@headlessui/react";
import {UserIcon, UsersIcon} from "@heroicons/react/24/solid/index.js";
import {Fragment} from "react";
import {Link} from "@inertiajs/react";
import UserAvatar from "@/Components/App/UserAvatar.jsx";

export default function GroupUsersPopover({ users = []}) {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <PopoverButton className={`${open ? "text-gray-200" : "text-gray-400"} hover:text-gray-200`}>
                        <UsersIcon className="w-4" />
                    </PopoverButton>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <PopoverPanel className="absolute right-0 z-20 mt-3 w-[240px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="bg-gray-800 p-2">
                                    {users.map((user) => (
                                        <Link
                                            href = {route("chat.user", user.id)}
                                            key={user.id}
                                            className="flex items-center gap-2 py-2 px-3 hover:bg-black/30"
                                        >
                                            <UserAvatar user={user} />
                                            <div className="text-xs">{user.name}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
