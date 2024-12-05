import asyncio
import websockets
import pickle
import struct
import pyshine as ps

async def audio_stream(websocket, path):
    mode = 'send'
    audio, _ = ps.audioCapture(mode=mode)

    while True:
        frame = audio.get()
        serialized_frame = pickle.dumps(frame)
        message = struct.pack("Q", len(serialized_frame)) + serialized_frame
        await websocket.send(message)

start_server = websockets.serve(audio_stream, "192.168.73.135", 4982)

print("Server running on ws://192.168.73.135:4982")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()