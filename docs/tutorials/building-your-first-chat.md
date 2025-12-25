# Building Your First Chat

This tutorial will guide you through creating your first chat conversation with the AI Chat application.

## Overview

In this tutorial, you will:

1. Create a new chat session
2. Send your first message
3. Understand how streaming responses work
4. Learn about chat management features

## Step 1: Create a New Chat

1. **Open the application** - Make sure the dev server is running (`npm run dev`)

2. **Click "New Chat"** - Located in the sidebar, this button creates a new chat session

3. **Verify chat creation** - You should see a new chat appear in the sidebar with the title "New Chat"

## Step 2: Send Your First Message

1. **Type a message** - In the input field at the bottom, type your question or message

   Example:

   ```
   What is Vue.js?
   ```

2. **Send the message** - Press `Enter` or click the send button

3. **Watch the response** - The AI response will stream character by character, creating a smooth typing effect

## Step 3: Understanding the Interface

### Chat Area

- **Message bubbles** - Your messages appear on the right (blue), AI responses on the left (gray)
- **Message actions** - Hover over messages to see action buttons:
  - **Copy** - Copy message to clipboard
  - **Edit** - Edit and resend your message
  - **Regenerate** - Regenerate the AI response
  - **Delete** - Delete the message

### Sidebar

- **Chat list** - All your chats are listed here
- **New Chat** - Creates a new conversation
- **Settings** - Access application settings
- **Chat actions** - Right-click on a chat for options:
  - Pin/Unpin
  - Rename
  - Delete

## Step 4: Managing Your Chat

### Rename a Chat

1. Right-click on the chat in the sidebar
2. Select "Rename"
3. Enter a new name
4. Press Enter to save

The chat title is automatically generated from the first message, but you can customize it.

### Pin a Chat

1. Right-click on the chat
2. Select "Pin"

Pinned chats appear at the top of the chat list.

### Delete a Chat

1. Right-click on the chat
2. Select "Delete"
3. Confirm deletion

## Step 5: Advanced Features

### Temporary Chat Mode

Temporary chats are not saved to localStorage and are perfect for quick questions:

1. Enable temporary mode in Settings → Behavior
2. New chats created will be temporary
3. Temporary chats are marked with a special icon

### Edit and Regenerate

**Edit a message:**

1. Hover over your message
2. Click the edit icon
3. Modify the text
4. Press Enter to resend

**Regenerate AI response:**

1. Hover over the AI message
2. Click the regenerate icon
3. The AI will generate a new response

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line in message
- `Escape` - Cancel message editing

## Understanding the Flow

Here's what happens when you send a message:

```
User types message
    ↓
Message added to chat store
    ↓
API request sent to Cerebras
    ↓
Streaming response received
    ↓
Characters buffered and animated
    ↓
Message updated in real-time
    ↓
Response saved to localStorage
```

## Troubleshooting

### No response from AI

- Check your API key in Settings
- Verify your internet connection
- Check browser console for errors

### Streaming stops mid-response

- This might indicate a network issue
- Try regenerating the response
- Check API key validity

### Messages not saving

- Check browser localStorage (DevTools → Application → Local Storage)
- Verify you're not in temporary chat mode
- Check browser storage permissions

## Next Steps

Now that you've created your first chat:

1. Explore [Adding a New Component](../how-to/add-new-component.md) to customize the UI
2. Learn about [Project Architecture](../reference/architecture.md) to understand the codebase
3. Study [Streaming Responses](../explanation/streaming.md) to understand how streaming works

## Summary

You've learned:

- ✅ How to create and manage chats
- ✅ How to send messages and receive AI responses
- ✅ How to use chat management features
- ✅ How streaming responses work
- ✅ Basic keyboard shortcuts

**Congratulations!** You're now ready to use the AI Chat application effectively.

---

**Want to learn more?** Check out the [How-to Guides](../how-to/) for specific tasks!
