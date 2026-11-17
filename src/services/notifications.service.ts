import axios from "axios";
import type { AppNotification } from "../types/notification.types";
import type { User } from "../types/postCard.types";

const baseUrl = import.meta.env.VITE_BASE_URL;

function getRequestConfig(signal?: AbortSignal) {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
    ...(signal ? { signal } : {}),
  };
}

export async function getNotifications(signal?: AbortSignal) {
  return axios.get<unknown>(`${baseUrl}/notifications`, getRequestConfig(signal));
}

export async function markNotificationAsRead(notificationId: string) {
  return axios.patch(
    `${baseUrl}/notifications/${encodeURIComponent(notificationId)}/read`,
    {},
    getRequestConfig(),
  );
}

export async function markAllNotificationsAsRead() {
  return axios.patch(
    `${baseUrl}/notifications/read-all`,
    {},
    getRequestConfig(),
  );
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function getString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function getEntityId(value: unknown): string | undefined {
  const directId = getString(value);
  if (directId) {
    return directId;
  }

  const entity = asRecord(value);
  return getString(entity?._id, entity?.id, entity?.userId, entity?.postId);
}

function getNotificationList(payload: unknown): unknown[] {
  let current = payload;

  for (let depth = 0; depth < 6; depth += 1) {
    if (Array.isArray(current)) {
      return current;
    }

    const record = asRecord(current);
    if (!record) {
      return [];
    }

    current =
      record.notifications ??
      record.data ??
      record.results ??
      record.items;
  }

  return [];
}

function isReadNotification(record: UnknownRecord): boolean {
  if (typeof record.isRead === "boolean") {
    return record.isRead;
  }
  if (typeof record.read === "boolean") {
    return record.read;
  }
  if (typeof record.unread === "boolean") {
    return !record.unread;
  }

  const status = getString(record.status, record.readStatus)?.toLowerCase();
  if (status) {
    return ["read", "seen", "true"].includes(status);
  }

  return Boolean(record.readAt);
}

function normalizeNotification(value: unknown): AppNotification | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const senderRecord = asRecord(
    record.sender ??
      record.actor ??
      record.user ??
      record.from ??
      record.createdBy,
  );
  const senderId = getString(
    senderRecord?._id,
    senderRecord?.id,
    record.senderId,
    record.actorId,
    record.userId,
  );
  const senderName = getString(
    senderRecord?.name,
    senderRecord?.username,
    record.senderName,
    record.actorName,
    record.userName,
    record.username,
  );
  const senderUsername = getString(
    senderRecord?.username,
    record.senderUsername,
  );
  const senderPhoto = getString(
    senderRecord?.photo,
    senderRecord?.avatar,
    senderRecord?.avatarUrl,
    record.senderPhoto,
    record.avatar,
  );
  const sender: Partial<User> = {
    _id: senderId,
    name: senderName,
    username: senderUsername,
    photo: senderPhoto,
  };
  const postId = getEntityId(
    record.postId ?? record.post ?? record.relatedPost,
  );
  const profileId = getEntityId(
    record.profileId ??
      record.targetUser ??
      record.relatedUser ??
      senderId,
  );
  const createdAtValue =
    record.createdAt ?? record.created_at ?? record.timestamp;
  const createdAt =
    typeof createdAtValue === "string" || typeof createdAtValue === "number"
      ? createdAtValue
      : undefined;

  return {
    id: getString(record._id, record.id, record.notificationId),
    type: getString(record.type, record.action, record.event) ?? "unknown",
    message: getString(
      record.message,
      record.text,
      record.notificationText,
      record.content,
    ),
    isRead: isReadNotification(record),
    createdAt,
    sender,
    postId,
    profileId,
  };
}

export function normalizeNotifications(payload: unknown): AppNotification[] {
  return getNotificationList(payload)
    .map(normalizeNotification)
    .filter((notification): notification is AppNotification =>
      Boolean(notification),
    );
}
