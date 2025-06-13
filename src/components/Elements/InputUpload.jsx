import { useRef } from "react";
import { FiX } from "react-icons/fi";
import Button from "../Elements/Button";

const InputUpload = ({
  label = "Foto",
  name = "photo",
  accept = "image/*",
  value,
  onChange,
  onClear,
}) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <div className="flex items-center border border-gray-800 px-3 py-2 rounded-lg focus-within:border-soft-orange focus-within:ring-0">
        <Button type="button" onClick={handleButtonClick} className="text-sm">
          Upload File
        </Button>
        <span className="text-sm text-gray-500 ml-3 truncate">
          {value ? value.name : "No File Chosen"}
        </span>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="ml-3 text-red-500 hover:text-red-700 text-2xl transition-all duration-200"
            title="Hapus File"
          >
            <FiX />
          </button>
        )}
      </div>
      <input
        id={`${name}-upload`}
        ref={fileInputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="hidden"
        required={!value}
      />
    </div>
  );
};

export default InputUpload;