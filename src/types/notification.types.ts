import type { User } from "./postCard.types";

export interface AppNotification {
  id?: string;
  type: string;
  message?: string;
  isRead: boolean;
  createdAt?: string | number;
  sender?: Partial<User>;
  postId?: string;
  profileId?: string;
}
