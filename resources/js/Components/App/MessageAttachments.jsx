import {formatBytes, isAudio, isImage, isPDF, isPreviewable, isVideo} from "@/helpers.jsx";
import {ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon} from "@heroicons/react/24/solid/index.js";
import {Popover} from "@headlessui/react";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, ind) => (
                        <div
                            onClick={(ev) => attachmentClick(ev, ind)}
                            key={attachment.id}
                            className={
                            `group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer ` +
                                (isAudio(attachment) || (isPDF(attachment))? "w-84" : "w-32 aspect-square bg-blue-100")
                            }
                        >
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-10 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex
                                    items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0
                                    cursor-pointer hover:bg-gray-800"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                </a>
                            )}
                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    className="object-contain aspect-square"
                                />
                            )}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center ">
                                    <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />
                                    <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
                                    <video src={attachment.url} />
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center ">
                                    <audio src={attachment.url} controls/>
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    {/*<div className="absolute left-0 top-0 bottom-0"></div>*/}
                                    <img src="/img/png.png" className="w-8"/>
                                    <div className="flex-1 text-gray-950 text-nowrap text-ellipsis overflow-hidden">
                                        <h3>{attachment.name}</h3>
                                        <p className="text-xs">{formatBytes(attachment.size)}</p>
                                    </div>
                                    {/*<iframe src={attachment.url} className="w-full h-full"></iframe>*/}
                                </div>
                            )}
                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col justify-center items-center"
                                >
                                    <PaperClipIcon className="w-6 h-6" />
                                    <small className="text-center">{attachment.name}</small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default MessageAttachments;
