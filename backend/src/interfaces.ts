export interface Sender {
  name: string;
  rooms: string[];
}

export interface OutMessage {
  content: string;
  sender: string;
  timestamp: string;
  id: string;
}
