export function createStreamManager(encoder, controller) {
  const sendMessage = (data) => {
    try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); }
    catch (error) { console.error('Error sending stream message:', error); }
  };
  const sendError = ({ type, error, details }) => sendMessage({ type, error, details });
  const closeStream = () => { try { controller.close(); } catch (error) { console.error('Error closing stream:', error); } };
  const handleStreamingError = (error) => {
    console.error('Error processing streaming request:', error);
    if (error.status === 401 || error.message.includes('auth') || error.message.includes('key')) {
      sendError({ type: 'error', error: 'Authentication failed with OpenAI API', details: 'Please check your API key in environment variables' });
    } else if (error.status === 429 || error.message.includes('rate limit')) {
      sendError({ type: 'rate_limit_exceeded', error: 'Rate limit exceeded', details: 'Please try again later' });
    } else {
      sendError({ type: 'error', error: 'Failed to get response from OpenAI', details: error.message });
    }
  };
  return { sendMessage, sendError, closeStream, handleStreamingError };
}

export function createSseStream(streamHandler) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const streamManager = createStreamManager(encoder, controller);
      try { await streamHandler(streamManager); }
      catch (error) { streamManager.handleStreamingError(error); }
      finally { streamManager.closeStream(); }
    }
  });
}

export default { createSseStream, createStreamManager };
