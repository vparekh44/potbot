import { ChangeEvent, ReactElement } from "react";

interface ImageUploaderProps {
  isLoading: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploader = ({ onUpload, isLoading }: ImageUploaderProps): ReactElement | null => {
  return (
    <div>
      {isLoading && (
        <div className="flex h-40 items-center justify-center ">
          Loading...
        </div>
      )}
      {!isLoading && (
        <label className="absolute top-0 h-full w-full cursor-pointer  bg-neutral-400 opacity-0 shadow-neutral-600 transition ease-in-out hover:bg-secondary-600 hover:opacity-50">
          <input
            type="file"
            className="invisible"
            onChange={onUpload}
            accept="image/x-png, image/jpeg"
          />
        </label>
      )}
    </div>
  );
};
