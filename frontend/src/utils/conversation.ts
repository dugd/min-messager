import type { Conversation } from '../types/conversation';
import type { UserParticipant } from '../types/user';

/**
 * Find a participant by their user ID
 */
export function findParticipantById(
  participants: UserParticipant[],
  userId: number
): UserParticipant | undefined {
  return participants.find((p) => p.id === userId);
}

/**
 * Get the other participant in a direct conversation
*/
export function getOtherParticipant(
  conversation: Conversation,
  currentUserId: number
): UserParticipant | undefined {
  if (conversation.type !== 'direct') return undefined;
  return conversation.participants.find((p: UserParticipant) => p.id !== currentUserId);
}

/**
 * Get the display title for a conversation
 * - Direct: Other user's name
 * - Group: Group title or "Unnamed Group"
 */
export function getConversationTitle(
  conversation: Conversation,
  currentUserId: number
): string {
  if (conversation.type === 'group') {
    return conversation.title || 'Unnamed Group';
  }

  // Direct conversation: show the other user's name
  const otherUser = getOtherParticipant(conversation, currentUserId);
  return otherUser?.name || 'Unknown User';
}

/**
 * Get the avatar URL for a conversation
 * - Direct: Other user's avatar
 * - Group: Group avatar (when implemented)
 */
export function getConversationAvatar(
  conversation: Conversation,
  currentUserId: number
): string | undefined {
  if (conversation.type === 'group') {
    // TODO: Add group avatar support when backend implements it
    return undefined;
  }

  // Direct conversation: show the other user's avatar
  const otherUser = getOtherParticipant(conversation, currentUserId);
  return otherUser?.avatar_url;
}

/**
 * Format timestamp to display format (e.g., "10:30 AM" or "Yesterday")
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Today: show time
  if (days === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Yesterday
  if (days === 1) {
    return 'Yesterday';
  }

  // This week: show day name
  if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Older: show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
