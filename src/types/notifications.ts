export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'other';

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  seen: boolean;
  user_id: number;
  payment_id: number | null;
  createdAt: Date;
  updatedAt: Date;
}

