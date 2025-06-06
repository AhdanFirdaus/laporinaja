import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, className = "max-w-md w-full", maxHeight, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl p-6 relative flex flex-col ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FiX size={20} />
        </button>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div
          className="flex-grow overflow-y-auto"
          style={{ maxHeight: maxHeight || '70vh' }}
        >
          {children}
        </div>
        {footer && (
          <div className="mt-4 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;