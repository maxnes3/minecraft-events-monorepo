import { WebSocketPublishEvents } from '../domain/websocket-events.enums';

export const WEBSOCKET_EVENTS_MESSAGES: Record<WebSocketPublishEvents, string> =
  {
    [WebSocketPublishEvents.CONNECTED]: 'messages.websocket.connected',
    [WebSocketPublishEvents.DISCONNECTED]: 'messages.websocket.disconnected',
    [WebSocketPublishEvents.ERROR]: '',
    [WebSocketPublishEvents.RESPONSE]: ''
  };
