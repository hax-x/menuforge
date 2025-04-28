"use client";
import React from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

type Item = {
  id: number;
  name: string;
  price: string;
  description: string;
};

type Category = {
  id: number;
  name: string;
  items: Item[];
};

interface EditMenuViewProps {
  categories: Category[];
  onAddItem: (categoryId: number) => void;
  onEditItem: (categoryId: number, item: Item) => void;
  onDeleteItem: (categoryId: number, itemId: number) => void;
  onDeleteCategory: (categoryId: number) => void;
  onOpenCategoryModal: () => void;
}

const EditMenuView: React.FC<EditMenuViewProps> = ({
  categories,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDeleteCategory,
  onOpenCategoryModal,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Edit Menu</h2>

      {/* Add Category Button */}
      <div className="mb-6">
        <button 
          onClick={onOpenCategoryModal}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden"
          >
            {/* Category Header */}
            <div className="bg-zinc-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-100">{category.name}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAddItem(category.id)}
                  className="flex items-center gap-1 bg-violet-600 text-sm text-white px-3 py-1 rounded hover:bg-violet-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-red-400 hover:text-red-500"
                  disabled={category.items.length > 0}
                  title={
                    category.items.length > 0
                      ? 'Remove all items first'
                      : 'Delete category'
                  }
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="p-4">
              {category.items.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No items in this category. Click "Add Item" to get started.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-zinc-700 rounded-lg overflow-hidden border border-zinc-600"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-medium text-white">{item.name}</h4>
                          <span className="font-bold text-violet-300">{item.price}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onEditItem(category.id, item)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteItem(category.id, item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditMenuView;
