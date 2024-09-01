import { formatBytes, isPDF, isPreviewable } from "@/helpers.jsx";
import { PaperClipIcon } from "@heroicons/react/24/solid/index.js";

const AttachmentPreview = ({ file }) => {
    // Safeguard: Check if file is valid and has necessary properties
    if (!file || !file.file) return null;

    const { file: innerFile } = file; // Destructure file to avoid repeating 'file.file'
    const isPDFFile = isPDF(innerFile);
    const isPreviewableFile = isPreviewable(innerFile);

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <div>
                {isPDFFile && <img src="/img/png.png" className="w-8" alt="PDF preview" />}
                {!isPreviewableFile && (
                    <div className="flex justify-center items-center w-10 h-10 bg-gray-700 rounded">
                        <PaperClipIcon className="w-6" />
                    </div>
                )}
            </div>
            <div className="flex-1 text-gray-400 text-nowrap text-ellipsis overflow-hidden">
                <h3>{innerFile.name || 'Unnamed file'}</h3> {/* Fallback name */}
                <p className="text-xs">{formatBytes(innerFile.size || 0)}</p> {/* Fallback size */}
            </div>
        </div>
    );
};

export default AttachmentPreview;
