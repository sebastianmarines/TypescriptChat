export interface Sender {
  id: string;
  name: string;
  rooms: string[];
}

export interface OutMessage {
  content: string;
  sender: string;
  sender_id: string;
  id: string;
}

export interface IncomingMessage {
  content: string;
}
