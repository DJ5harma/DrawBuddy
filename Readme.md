# DrawBuddy:

An advanced realtime design collaboration platform

- A real-time feature-rich canvas for multiple users to draw upon and see other's live drawings instantly.

- Custom in-memory caching and hashing for drawn elements on the server for fast data retrieval (without helpers like Redis).

- Fine Ul practices ensured to render the complex frontend with fewer state-render cycles, implying more efficiency.

- Serialization and deserialization at ends exercised for transfer and re-composition of Elemental Nodes via socket bridge.

- Power saving of the host machine by switching on/off of the web-socket server based on connected listeners.

Tools: Konva.js, React.js [Context API], Node.js, Express.js, Socket.io, HashMaps, Browser native storage, Typescript, Tailwind.

GitHub link: https://github.com/DJ5harma/DrawBuddy.

# Features:

- Create elements like Rectangle, Circle, Line, Pencil, Text.

- Specify their background color, stroke [color, dashes, width], opacity etc.

- The canvas is draggable and infinite.

- Delete them by clicking inside them using the Eraser tool, or delete them all at once (after a warning) using the Dustbin.

- Drag and Move them using Pointer tool.

- All the users in the room can watch all the elements made and being made by peers.

- Users can perform all the operations (drag, erase, etc.) on other users' elememts.

- Users coming to a room late fetch all the elements made from the server (elements are cached in serial form).

- Lost users can teleport to a stage position directly by entering coordinates or even better, instantly teleport to the latest element made. And from there, they can go back to the element made before that and so on... by click of a button.

- The Non-collaborative mode (offline-mode) is also available by default if the user isn't in a room.

- The offline-mode elements are cached inside the localStorage of the browser instead of the server.
