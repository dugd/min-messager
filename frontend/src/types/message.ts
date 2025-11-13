import type { messageType } from "./common";
import type { UserParticipant } from "./user";

export type Message = {
    id: number;
    conversation_id: number;
    sender_id: number;
    body: string;
    type: messageType;
    reply_to_id: number | null;
    edited_at: string | null; // ISO date string or null
    deleted_at: string | null; // ISO date string or null
    created_at: string; // ISO date string
}

// TODO: Implement in backend
export type MessageWithSender = Message & {
    sender: UserParticipant;
}

// Responses
export type MessageResponse = {
    message: Message;
}

export type MessagesLoadResponse = {
    conversation_id: number;
    messages: Message[];
}