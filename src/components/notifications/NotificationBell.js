import React, { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="relative p-2 hover:scale-110 transition"
        >
          <span className="text-2xl">🔔</span>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}