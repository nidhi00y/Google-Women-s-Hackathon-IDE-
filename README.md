# Web IDE with CodeT5 Integration

A modern web-based IDE with AI code generation powered by CodeT5.

## Features

- Monaco Editor integration with syntax highlighting and IntelliSense
- AI code generation using CodeT5
- Split pane layout
- File explorer
- Command palette
- Terminal emulation

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Hugging Face API key:
   ```
   VITE_HUGGINGFACE_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## AI Code Generation

The IDE uses CodeT5, a state-of-the-art code generation model from Salesforce. To generate code:

1. Open the AI Assistant panel
2. Enter your code generation prompt
3. Click the send button or press Enter
4. The generated code will appear in the chat

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Environment Variables

- `VITE_HUGGINGFACE_API_KEY` - Your Hugging Face API key for CodeT5 access

## Tech Stack

- React
- TypeScript
- Vite
- Monaco Editor
- CodeT5 (via Hugging Face API)
- Tailwind CSS
- Zustand