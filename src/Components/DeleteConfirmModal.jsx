import { FaTimes } from "react-icons/fa";
import  PopTrashIcon  from "../assets/icons/Pop-trashicon"; 

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-[24px] bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-2 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E53E3E]">
            <PopTrashIcon className="h-8 w-8 text-white" />
          </div>

          <h3 className="mb-2 text-[24px] font-bold text-[#1A202C]">{title}</h3>
          <p className="mb-8 text-[16px] text-[#718096]">{message}</p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-[10px] border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100 hover:shadow-sm"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 cursor-pointer rounded-[10px] bg-[#E53E3E] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[#C53030] focus:outline-none sm:px-6 sm:py-3 sm:text-base disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </div>
              ) : (
                <>
                  <span className="sm:hidden">{confirmText}</span>
                  <span className="hidden sm:inline">{confirmText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
