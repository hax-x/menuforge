"use client";
import React from "react";
import { X } from "lucide-react";

interface CategoryFormState {
  name: string;
}

interface CategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: CategoryFormState) => void; // Changed to accept form data directly
  form: CategoryFormState;
  setForm: (state: CategoryFormState) => void;
  modalRef?: React.RefObject<HTMLDivElement>; // Made optional
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  show,
  onClose,
  onSubmit,
  form,
  setForm,
  modalRef,
}) => {
  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    onSubmit(form); // Pass form data to parent
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        className="bg-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-100">Add New Category</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Category Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border border-zinc-600 rounded bg-zinc-700 text-gray-100 focus:border-violet-400 focus:outline-none"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 text-gray-300 rounded hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;