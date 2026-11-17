import { Bell, UserRound } from "lucide-react";
import type { AppNotification } from "../../types/notification.types";

interface NotificationItemProps {
  notification: AppNotification;
  disabled: boolean;
  isPending: boolean;
  onOpen: () => void;
}

function getNotificationText(notification: AppNotification): string {
  if (notification.message) {
    return notification.message;
  }

  const type = notification.type.toLowerCase().replace(/[\s_-]/g, "");

  if (type.includes("like")) return "liked your post.";
  if (type.includes("comment")) return "commented on your post.";
  if (type.includes("follow")) return "started following you.";
  if (type.includes("mention")) return "mentioned you.";
  if (type.includes("reply")) return "replied to your comment.";
  if (type.includes("share")) return "shared a post.";

  return "sent you a notification.";
}

function getRelativeTime(value?: string | number): string {
  if (value === undefined || value === null || value === "") {
    return "Time unavailable";
  }

  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) {
    return "Time unavailable";
  }

  const differenceSeconds = Math.round((timestamp - Date.now()) / 1000);
  if (Math.abs(differenceSeconds) < 30) {
    return "just now";
  }

  const units: Array<[number, string]> = [
    [60 * 60 * 24 * 365, "y"],
    [60 * 60 * 24 * 30, "mo"],
    [60 * 60 * 24 * 7, "w"],
    [60 * 60 * 24, "d"],
    [60 * 60, "h"],
    [60, "m"],
    [1, "s"],
  ];
  const absoluteSeconds = Math.abs(differenceSeconds);
  const [unitSeconds, unitLabel] =
    units.find(([seconds]) => absoluteSeconds >= seconds) ?? units[units.length - 1];
  const amount = Math.max(1, Math.floor(absoluteSeconds / unitSeconds));

  return differenceSeconds > 0
    ? `in ${amount}${unitLabel}`
    : `${amount}${unitLabel} ago`;
}

function NotificationItem({
  notification,
  disabled,
  isPending,
  onOpen,
}: NotificationItemProps) {
  const senderName = notification.sender?.name?.trim() || "Someone";
  const senderPhoto = notification.sender?.photo?.trim();
  const message = getNotificationText(notification);
  const relativeTime = getRelativeTime(notification.createdAt);

  return (
    <li>
      <button
        type="button"
        aria-label={`${senderName} ${message} ${relativeTime}. ${
          notification.isRead ? "Read" : "Unread"
        }`}
        aria-busy={isPending}
        disabled={disabled}
        onClick={onOpen}
        className={`flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60 ${
          notification.isRead
            ? "border-gray-100 bg-white hover:bg-gray-50"
            : "border-blue-100 bg-blue-50/70 hover:bg-blue-50"
        }`}
      >
        <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100 text-gray-500">
          <UserRound
            aria-hidden="true"
            className="absolute"
            size={22}
          />
          {senderPhoto ? (
            <img
              src={senderPhoto}
              alt=""
              className="relative size-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-semibold text-gray-900">{senderName}</span>
            <span className="text-sm leading-6 text-gray-700">{message}</span>
          </span>
          <span className="mt-1 block text-xs text-gray-500">{relativeTime}</span>
        </span>

        {isPending ? (
          <span
            className="mt-1 size-4 shrink-0 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
            aria-label="Marking notification as read"
            role="status"
          />
        ) : notification.isRead ? (
          <Bell
            className="mt-1 shrink-0 text-gray-300"
            aria-hidden="true"
            size={16}
          />
        ) : (
          <span
            className="mt-2 size-2.5 shrink-0 rounded-full bg-blue-600"
            aria-hidden="true"
          />
        )}
      </button>
    </li>
  );
}

export default NotificationItem;
