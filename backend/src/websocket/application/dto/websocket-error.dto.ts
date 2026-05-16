export class WebSocketErrorDTO {
  message: string;
  code?: number;
  details?: Record<string, unknown>;
}
