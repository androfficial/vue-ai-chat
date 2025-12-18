/**
 * English locale messages
 */

export default {
  app: {
    name: 'AI Chat',
    tagline: 'Chat with AI powered by Cerebras',
  },

  chat: {
    apiKeyRequired: 'Configure API key in settings to start',
    assistant: 'Assistant',
    copied: 'Copied!',
    copy: 'Copy',
    delete: 'Delete message',
    edit: 'Edit',
    editMessage: 'Edit message content',
    emptyState: {
      subtitle: 'Start a conversation by typing a message below',
      suggestions: [
        { icon: 'mdi-atom', text: 'Explain quantum computing in simple terms' },
        { icon: 'mdi-code-braces', text: 'Write a Python function to sort a list' },
        { icon: 'mdi-email-outline', text: 'Help me draft a professional email' },
        { icon: 'mdi-lightbulb-outline', text: 'Give me 5 creative project ideas' },
      ],
      title: 'How can I help you today?',
      titles: [
        'How can I help you today?',
        'What would you like to know?',
        'Ask me anything...',
        "What's on your mind?",
        'Ready to assist you',
        "Let's explore ideas together",
      ],
    },
    error: {
      failed: 'Failed to generate response',
      retry: 'Try again',
    },
    hints: {
      enterToSend: 'Press Enter to send',
      shiftEnterNewLine: 'Shift + Enter for new line',
      warning: 'AI Chat may make mistakes. Check important info.',
    },
    messageList: 'Chat messages',
    newConversation: 'Start a new conversation',
    regenerate: 'Regenerate response',
    sendMessage: 'Send message',
    stopGenerating: 'Stop generating',
    temporaryChat: {
      active: "Temporary chat — history won't be saved",
      disable: 'Disable temporary chat',
      enable: 'Enable temporary chat',
      save: 'Save to history',
    },
    thinking: 'Thinking...',
    typeMessage: 'Type a message...',
    you: 'You',
  },

  common: {
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    copy: 'Copy',
    delete: 'Delete',
    edit: 'Edit',
    goBack: 'Go back',
    loading: 'Loading...',
    save: 'Save',
    search: 'Search',
    settings: 'Settings',
  },

  dialog: {
    apiKey: {
      description:
        'To use AI Chat, you need to provide your Cerebras API key. You can get one from',
      link: 'cloud.cerebras.ai',
      title: 'API Key Required',
    },
    deleteChat: {
      descriptionEnd: '". This action cannot be undone.',
      descriptionStart: 'This will delete the conversation "',
      title: 'Delete chat?',
    },
    renameChat: {
      label: 'Chat name',
      title: 'Rename chat',
    },
  },

  errors: {
    networkError: 'Connection error. Please check your internet connection and try again.',
    rateLimited: 'Too many requests. Please wait a moment and try again.',
    serverError: 'Server is temporarily unavailable. Please try again later.',
    unauthorized: 'Invalid or expired API key. Please check your API key in settings.',
    unknown: 'Something went wrong. Please try again.',
  },

  meta: {
    description:
      'AI chat application powered by Cerebras. Have intelligent conversations with an advanced AI assistant.',
    title: 'AI Chat - Intelligent Assistant',
  },

  settings: {
    api: {
      apiKey: 'Cerebras API Key',
      apiKeyHint: 'Get your API key from cloud.cerebras.ai',
      apiKeyPlaceholder: 'Enter your API key',
      connectionFailed: 'Connection failed',
      connectionSuccess: 'Connection successful!',
      maxTokens: 'Max Tokens',
      model: 'Model',
      settingsSaved: 'Settings saved!',
      temperature: 'Temperature',
      testConnection: 'Test Connection',
      title: 'API Configuration',
    },
    appearance: {
      fontLarge: 'Large',
      fontMedium: 'Medium',
      fontSize: 'Font Size',
      fontSmall: 'Small',
      theme: 'Theme',
      themeDark: 'Dark',
      themeLight: 'Light',
      themeSystem: 'System',
      title: 'Appearance',
    },
    backToChat: 'Back to chat',

    behavior: {
      sendOnEnter: 'Send message on Enter',
      sendOnEnterHint: 'When enabled, press Shift+Enter for new line',
      showTimestamps: 'Show message timestamps',
      title: 'Chat Behavior',
    },

    danger: {
      confirmDelete: 'Delete All Chats?',
      confirmDeleteDescription:
        'This will permanently delete all your chat history. This action cannot be undone.',
      deleteAllButton: 'Delete All',
      deleteAllChats: 'Delete all chats',
      deleteAllChatsDescription:
        'This action cannot be undone. All your chat history will be permanently deleted.',
      title: 'Danger Zone',
    },

    language: {
      english: 'English',
      interfaceLanguage: 'Interface Language',
      title: 'Language',
      ukrainian: 'Українська',
    },

    saved: 'Settings saved',

    title: 'Settings',
  },

  sidebar: {
    chatOptions: 'Chat options',
    collapseSidebar: 'Collapse sidebar',
    deleteChat: 'Delete chat',
    expandSidebar: 'Expand sidebar',
    lastMonth: 'Last Month',
    lastWeek: 'Last Week',
    newChat: 'New Chat',
    noChats: 'No conversations yet',
    older: 'Older',
    pinChat: 'Pin chat',
    renameChat: 'Rename chat',
    searchChats: 'Search chats...',
    startConversation: 'Start a new conversation',
    thisMonth: 'This Month',
    thisWeek: 'This Week',
    threeWeeksAgo: '3 Weeks Ago',
    today: 'Today',
    twoWeeksAgo: '2 Weeks Ago',
    unpinChat: 'Unpin chat',
    yesterday: 'Yesterday',
  },

  time: {
    daysAgo: '{n} day ago | {n} days ago',
    hoursAgo: '{n} hour ago | {n} hours ago',
    justNow: 'Just now',
    minutesAgo: '{n} min ago | {n} mins ago',
  },
}
