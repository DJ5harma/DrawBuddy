![Usage](https://github.com/user-attachments/assets/c846b97c-83b3-42aa-bdfe-6bd6deb25d83)

https://github.com/user-attachments/assets/8a6acd82-5a53-46a4-a80e-82709b3f7f9a

# DrawBuddy

An advanced real-time design collaboration platform designed for teams and individuals to create, edit, and share designs seamlessly. With a focus on efficiency, scalability, and usability, **DrawBuddy** provides a cutting-edge collaborative canvas for all your design needs.

---

## Overview

**DrawBuddy** reimagines collaborative design with its feature-rich, real-time canvas, allowing multiple users to draw, edit, and interact simultaneously. Leveraging efficient caching mechanisms and optimized rendering practices, it ensures a seamless user experience for real-time collaboration while minimizing system resource consumption.

---

## Key Features

### 1. **Real-Time Collaboration**

- Multiple users can draw on a shared canvas and see each other's actions in real-time.
- All actions such as drawing, dragging, erasing, and resizing are instantly synchronized across users.

### 2. **Rich Drawing Tools**

- Create diverse elements like:
  - **Shapes:** Rectangle, Circle, and Line
  - **Freehand Drawing:** Pencil tool
  - **Text:** Add and customize text on the canvas
- Customize properties:
  - Background color, stroke (color, dashes, width), and opacity.

### 3. **Canvas Functionality**

- Infinite canvas with drag-and-move capabilities.
- Advanced eraser tool to delete specific elements.
- A "Dustbin" feature to clear the entire canvas after user confirmation.
- Teleportation capabilities:
  - Jump to specific coordinates or the latest drawn element.
  - Navigate through previous elements step-by-step.

### 4. **Efficient State Management**

- Optimized rendering with fewer state cycles for smoother interactions on the frontend.
- Serialization and deserialization of drawing elements for efficient data transfer.

### 5. **Server-Side Enhancements**

- Custom in-memory caching and hashing for fast data retrieval without relying on external tools like Redis.
- On-demand WebSocket server activation to save host machine resources when no users are connected.

### 6. **Offline Mode**

- Non-collaborative mode enables users to work offline by default when not in a room.

### 7. **Late Joiner Support**

- New users joining a room can fetch all previously drawn elements directly from the server.
- Elements are cached in serialized form for fast retrieval.

---

## Tools and Technologies

- **Frontend:** [Konva.js](https://konvajs.org/), React.js (Context API), Tailwind CSS, TypeScript.
- **Backend:** Node.js, Express.js, Socket.io.
- **Data Handling:** HashMaps, Browser Native Storage.

---

## How It Works

### Collaborative Canvas

- Every user's actions are broadcasted via WebSocket to all connected peers in the same room.
- Users can interact with both their own elements and those created by others.

### Server-Side Optimizations

- Drawn elements are hashed and cached on the server, ensuring efficient storage and retrieval.
- The WebSocket server intelligently toggles based on active connections, reducing unnecessary load on the host machine.

### Serialization & Deserialization

- Elemental nodes (representing shapes, text, and drawings) are serialized for transfer and recomposed at the client-side for rendering.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/) (preferred, though npm works too)

### Installation

1. **Clone the Repository**
   git clone https://github.com/DJ5harma/DrawBuddy.git
   cd DrawBuddy

2. **Install Dependencies Navigate to the server and client directories separately to install their dependencies:**

   **_For the server_**

   cd server
   pnpm install

   **_For the client_**

   cd ../client
   pnpm install

3. **Run Servers in Development Mode Start both the server and client:**

   **_Start the server_**

   cd server
   pnpm run dev

   **_Start the client_**

   cd ../client
   pnpm run dev

4. **Access the Application**

   Open your browser and navigate to http://localhost:3000 for the client.
   The backend server runs on http://localhost:3001.
   Note: If ports 3000 or 3001 are occupied, update them in server/src/utils/constants.ts and the client configuration accordingly.

### Key Features in Detail

    - Drawing Tools:

    Create Rectangles, Circles, Lines, Freehand Drawings, and Text.

    Customize appearance:

    Background and stroke colors.

    Dash patterns for strokes.

    Adjustable opacity for transparent designs.

    - Advanced Navigation:
    Jump directly to any part of the infinite canvas by entering coordinates.

    Instantly teleport to the most recent element added or retrace through previous elements.

    - Power-Saving Mode
    The WebSocket server intelligently shuts down when no users are connected, conserving system resources on the host machine.
    Collaborative Features

    - All users in a room can:
    See each other’s drawings as they’re being created.
    Interact with elements created by others (move, erase, resize, etc.).
    Offline Mode

    - No internet? No problem! DrawBuddy allows users to work in offline mode without requiring room-based collaboration (only works if you install it as a web app using your browser).

    - Future Enhancements (Planned)
    Add support for more complex shapes and drawing tools.
    Enable user-specific permissions to restrict element interactions.
    Implement multi-room functionality for larger collaborative sessions.
    Add cloud storage integration for saving and loading projects.
