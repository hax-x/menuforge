"use client";

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="flex space-x-3">
        <div className="w-4 h-4 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-violet-300 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 rounded-full bg-violet-200 animate-bounce"></div>
      </div>
    </div>
  );
}
