import React from "react";
import { useNotifications } from "../../context/NotificationContext";

const urgencyColor = {
  critical: "border-red-500",
  high: "border-orange-400",
  medium: "border-yellow-400",
  low: "border-green-400",
};

export default function NotificationPanel({ open, onClose }) {
  const { notifications, markAllRead } = useNotifications();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          Notifications
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Actions */}
      <div className="p-3 border-b dark:border-gray-700">
        <button
          onClick={markAllRead}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto h-[calc(100%-120px)] p-3 space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-10">
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border-l-4 shadow-sm bg-gray-50 dark:bg-gray-800 ${
                urgencyColor[n.urgencyLevel] || "border-blue-400"
              } ${!n.read ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""}`}
            >
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {n.food?.title || "New Food Available"}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {n.distanceText} • {n.matchScore}% match
              </p>

              <p className="text-xs mt-2 text-gray-400">
                {new Date(n.id).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}