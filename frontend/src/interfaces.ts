export interface IncomingMessage {
  content: string;
  sender: string;
  sender_id: string;
  id: string;
}

export interface OutMessage {
  content: string;
}
