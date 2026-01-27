export class WebSocketHandshakeAuthDTO {
  token?: string;
  [key: string]: unknown;
}

export class WebSocketHandshakeDTO {
  auth: WebSocketHandshakeAuthDTO;
  headers: Record<string, string>;
  query: Record<string, string>;
}
