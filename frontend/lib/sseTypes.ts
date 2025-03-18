export enum StreamEventTypes {
  CHUNK = 'chunk',
  TOOL_USE = 'tool_use',
  TOOL_OUTPUT = 'tool_output',
  END = 'end'
}

export type StreamEvent = {
  event: StreamEventTypes;
  data: string;
}; 