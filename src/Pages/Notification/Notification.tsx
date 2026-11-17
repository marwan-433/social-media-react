import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import NotificationItem from "./NotificationItem";
import NotificationsEmptyState from "./NotificationsEmptyState";
import type { AppNotification } from "../../types/notification.types";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  normalizeNotifications,
} from "../../services/notifications.service";

function getNotificationDestination(
  notification: AppNotification,
): string | null {
  const type = notification.type.toLowerCase().replace(/[\s_-]/g, "");

  if (type.includes("follow")) {
    return "/profile";
  }

  if (notification.postId) {
    return `/postDetails/${encodeURIComponent(notification.postId)}`;
  }

  if (notification.profileId) {
    return "/profile";
  }

  return null;
}

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [pendingNotificationId, setPendingNotificationId] = useState<
    string | null
  >(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadNotifications() {
      setIsLoading(true);
      setLoadError(false);
      setActionError(null);

      try {
        const response = await getNotifications(controller.signal);
        if (isActive) {
          setNotifications(normalizeNotifications(response.data));
        }
      } catch {
        if (isActive && !controller.signal.aborted) {
          setLoadError(true);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadNotifications();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [retryCount]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;
  const isRequestInProgress =
    isMarkingAll || pendingNotificationId !== null;

  async function openNotification(notification: AppNotification) {
    if (isRequestInProgress) {
      return;
    }

    const destination = getNotificationDestination(notification);
    setActionError(null);

    if (notification.isRead || !notification.id) {
      if (destination) {
        navigate(destination);
      }
      return;
    }

    setPendingNotificationId(notification.id);

    try {
      await markNotificationAsRead(notification.id);
      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification.id === notification.id
            ? { ...currentNotification, isRead: true }
            : currentNotification,
        ),
      );
    } catch {
      toast.error("Unable to mark this notification as read.");
    } finally {
      setPendingNotificationId(null);
      if (destination) {
        navigate(destination);
      }
    }
  }

  async function markAllAsRead() {
    if (isRequestInProgress || unreadCount === 0) {
      return;
    }

    setIsMarkingAll(true);
    setActionError(null);

    try {
      await markAllNotificationsAsRead();
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch {
      setActionError("Unable to mark notifications as read. Please try again.");
    } finally {
      setIsMarkingAll(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Stay up to date
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-gray-500" aria-live="polite">
              {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Mark ${unreadCount} notifications as read`}
            disabled={isRequestInProgress || unreadCount === 0 || isLoading}
            onClick={markAllAsRead}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMarkingAll ? "Marking as read..." : "Mark all as read"}
          </button>
        </header>

        {actionError && (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {actionError}
          </p>
        )}

        {isLoading ? (
          <ul
            className="space-y-3"
            aria-label="Loading notifications"
            aria-busy="true"
            role="status"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <li
                key={index}
                className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4"
              >
                <span className="size-12 shrink-0 rounded-full bg-gray-200" />
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block h-4 w-1/3 rounded bg-gray-200" />
                  <span className="block h-3 w-2/3 rounded bg-gray-100" />
                </span>
              </li>
            ))}
          </ul>
        ) : loadError ? (
          <section
            className="rounded-2xl border border-red-100 bg-white px-6 py-10 text-center shadow-sm"
            role="alert"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications couldn&apos;t be loaded
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Check your connection and try again.
            </p>
            <button
              type="button"
              aria-label="Retry loading notifications"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Retry
            </button>
          </section>
        ) : notifications.length === 0 ? (
          <NotificationsEmptyState />
        ) : (
          <ul className="space-y-3" aria-label="Your notifications">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={notification.id || `notification-${index}`}
                notification={notification}
                disabled={isRequestInProgress}
                isPending={pendingNotificationId === notification.id}
                onOpen={() => void openNotification(notification)}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default NotificationsPage;
