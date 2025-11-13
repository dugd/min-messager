import type { Message } from '../types/message';

/**
 * Format message timestamp for display
 * Returns "HH:MM" for today, "Yesterday" for yesterday, or "DD/MM/YYYY" for older
 */
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    // Today: show time only
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    // Older: show date
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

/**
 * Check if message belongs to current user
 */
export const isMyMessage = (message: Message, currentUserId: number): boolean => {
  return message.sender_id === currentUserId;
};

/**
 * Check if message was edited
 */
export const isEditedMessage = (message: Message): boolean => {
  return message.edited_at !== null;
};

/**
 * Check if message was deleted
 */
export const isDeletedMessage = (message: Message): boolean => {
  return message.deleted_at !== null;
};
