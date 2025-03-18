export async function sendQuery(query: string, sessionId: string) {
  const response = await fetch('http://localhost:8000/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      session_id: sessionId
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const events = chunk.split('\n\n').filter(Boolean);
    
    for (const event of events) {
      const [eventLine, dataLine] = event.split('\n');
      const eventType = eventLine.replace('event: ', '');
      const data = dataLine.replace('data: ', '');
      
      // Handle different event types
      switch(eventType) {
        case 'chunk':
          // Update message stream
          break;
        case 'tool_use':
          // Show tool indicator
          break;
        case 'tool_output':
          // Display tool result
          break;
        case 'end':
          // Finalize message
          break;
      }
    }
  }
} 