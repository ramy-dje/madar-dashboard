import { Spinner } from "../../components/ui/Spinner";
import { useDropZone, useFileUpload, useUploader } from "./hooks";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { cn } from "@/lib/utils";
import { ChangeEvent, useCallback, useState } from "react";

export const VideoUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const { loading, uploadFile } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({ uploader: uploadFile });
  const [videoLink, setVideoLink] = useState("");

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => (e.target.files ? uploadFile(e.target.files[0]) : null),
    [uploadFile],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80 ">
        <Spinner className="text-neutral-500" size={1.5} />
      </div>
    );
  }

  const wrapperClass = cn(
    "flex flex-col items-center justify-center px-8 py-10 rounded border-2 border-black/10 hover:border-black/30",
    draggedInside && "bg-neutral-100",
  );

  return (
    <div
      className={wrapperClass}
      onDrop={onDrop}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
    >
      <Icon name="Video" className="w-12 h-12 mb-4 text-black dark:text-white opacity-20" />
      <div className="flex flex-col items-center justify-center ">
        {/*<div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
          {draggedInside ? 'Drop image here' : 'Drag and drop or'}
        </div>*/}
        <Button
          disabled={draggedInside}
          onClick={handleUploadClick}
          variant="primary"
          buttonSize="small"
        >
          <Icon name="Upload" />
          Upload an video
        </Button>
        <p className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">or</p>
        <input
          type="text"
          onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
            e.clipboardData.getData("text") && onUpload(e.clipboardData.getData("text"))
          }
          value={videoLink}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoLink(e.target.value)}
          className="w-[145px] border border-black rounded-md text-sm p-1"
          placeholder="Copy link here"
        />
      </div>
      <input
        className="w-0 h-0 overflow-hidden opacity-0"
        ref={ref}
        type="file"
        accept=".avi,.mp4,.mov,.mkv"
        onChange={onFileChange}
      />
    </div>
  );
};

export default VideoUploader;
