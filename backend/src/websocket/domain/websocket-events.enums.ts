export enum WebSocketPublishEvents {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RESPONSE = 'response'
}

export enum WebSocketSubscribeEvents {
  STREAMING_PLATFORM_INIT = 'streaming:platform:init',
  STREAMING_PLATFORM_CLOSE = 'streaming:platform:close',
  EVENTS_VOTING_START = 'events:voting:start'
}
