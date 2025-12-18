/**
 * Ukrainian locale messages
 */

export default {
  app: {
    name: 'AI Chat',
    tagline: 'Чат з ШІ на базі Cerebras',
  },

  chat: {
    apiKeyRequired: 'Налаштуйте API ключ в налаштуваннях щоб почати',
    assistant: 'Асистент',
    copied: 'Скопійовано!',
    copy: 'Копіювати',
    delete: 'Видалити повідомлення',
    edit: 'Редагувати',
    editMessage: 'Редагувати текст повідомлення',
    emptyState: {
      subtitle: 'Почніть розмову, ввівши повідомлення нижче',
      title: 'Чим я можу вам допомогти?',
      titles: [
        'Чим я можу вам допомогти?',
        'Що ви хотіли б дізнатися?',
        'Запитайте мене будь-що...',
        'Про що ви думаєте?',
        'Готовий допомогти вам',
        'Давайте дослідимо ідеї разом',
      ],
    },
    error: {
      failed: 'Не вдалося згенерувати відповідь',
      retry: 'Спробувати знову',
    },
    hints: {
      enterToSend: 'Натисніть Enter щоб надіслати',
      shiftEnterNewLine: 'Shift + Enter для нового рядка',
      warning: 'AI Chat може помилятися. Перевіряйте важливу інформацію.',
    },
    messageList: 'Повідомлення чату',
    newConversation: 'Почати нову розмову',
    regenerate: 'Згенерувати знову',
    sendMessage: 'Надіслати повідомлення',
    stopGenerating: 'Зупинити генерацію',
    temporaryChat: {
      active: 'Тимчасовий чат — історія не зберігатиметься',
      disable: 'Вимкнути тимчасовий чат',
      enable: 'Увімкнути тимчасовий чат',
      save: 'Зберегти в історію',
    },
    thinking: 'Думаю...',
    typeMessage: 'Введіть повідомлення...',
    you: 'Ви',
  },

  common: {
    cancel: 'Скасувати',
    close: 'Закрити',
    confirm: 'Підтвердити',
    copy: 'Копіювати',
    delete: 'Видалити',
    edit: 'Редагувати',
    goBack: 'Назад',
    loading: 'Завантаження...',
    save: 'Зберегти',
    search: 'Пошук',
    settings: 'Налаштування',
  },

  dialog: {
    apiKey: {
      description:
        'Щоб використовувати AI Chat, вам потрібно надати API ключ Cerebras. Ви можете отримати його на',
      link: 'cloud.cerebras.ai',
      title: 'Потрібен API ключ',
    },
    deleteChat: {
      descriptionEnd: '». Цю дію не можна скасувати.',
      descriptionStart: 'Це видалить розмову «',
      title: 'Видалити чат?',
    },
    renameChat: {
      label: 'Назва чату',
      title: 'Перейменувати чат',
    },
  },

  errors: {
    networkError: "Помилка з'єднання. Перевірте підключення до інтернету та спробуйте знову.",
    rateLimited: 'Забагато запитів. Зачекайте трохи та спробуйте знову.',
    serverError: 'Сервер тимчасово недоступний. Спробуйте пізніше.',
    unauthorized: 'Невірний або застарілий API ключ. Перевірте ваш API ключ в налаштуваннях.',
    unknown: 'Щось пішло не так. Спробуйте ще раз.',
  },

  meta: {
    description: 'Чат з ШІ на базі Cerebras. Ведіть розумні розмови з просунутим ШІ-асистентом.',
    title: 'AI Chat - Розумний асистент',
  },

  settings: {
    api: {
      apiKey: 'API ключ Cerebras',
      apiKeyHint: 'Отримайте API ключ на cloud.cerebras.ai',
      apiKeyPlaceholder: 'Введіть ваш API ключ',
      connectionFailed: "З'єднання не вдалося",
      connectionSuccess: "З'єднання успішне!",
      maxTokens: 'Макс. токенів',
      model: 'Модель',
      settingsSaved: 'Налаштування збережено!',
      temperature: 'Температура',
      testConnection: "Перевірити з'єднання",
      title: 'Налаштування API',
    },
    appearance: {
      fontLarge: 'Великий',
      fontMedium: 'Середній',
      fontSize: 'Розмір шрифту',
      fontSmall: 'Малий',
      theme: 'Тема',
      themeDark: 'Темна',
      themeLight: 'Світла',
      themeSystem: 'Системна',
      title: 'Зовнішній вигляд',
    },
    backToChat: 'Назад до чату',

    behavior: {
      sendOnEnter: 'Надсилати повідомлення по Enter',
      sendOnEnterHint: 'Коли ввімкнено, натисніть Shift+Enter для нового рядка',
      showTimestamps: 'Показувати час повідомлень',
      title: 'Поведінка чату',
    },

    danger: {
      confirmDelete: 'Видалити всі чати?',
      confirmDeleteDescription:
        'Це назавжди видалить всю вашу історію чатів. Цю дію неможливо скасувати.',
      deleteAllButton: 'Видалити все',
      deleteAllChats: 'Видалити всі чати',
      deleteAllChatsDescription:
        'Цю дію неможливо скасувати. Вся історія чатів буде видалена назавжди.',
      title: 'Небезпечна зона',
    },

    language: {
      english: 'English',
      interfaceLanguage: 'Мова інтерфейсу',
      title: 'Мова',
      ukrainian: 'Українська',
    },

    saved: 'Збережено',

    title: 'Налаштування',
  },

  sidebar: {
    chatOptions: 'Опції чату',
    collapseSidebar: 'Згорнути бічну панель',
    deleteChat: 'Видалити чат',
    expandSidebar: 'Розгорнути бічну панель',
    lastMonth: 'Минулий місяць',
    lastWeek: 'Минулий тиждень',
    newChat: 'Новий чат',
    noChats: 'Ще немає розмов',
    older: 'Раніше',
    pinChat: 'Закріпити чат',
    renameChat: 'Перейменувати чат',
    searchChats: 'Пошук чатів...',
    startConversation: 'Почніть нову розмову',
    thisMonth: 'Цей місяць',
    thisWeek: 'Цей тиждень',
    threeWeeksAgo: '3 тижні тому',
    today: 'Сьогодні',
    twoWeeksAgo: '2 тижні тому',
    unpinChat: 'Відкріпити чат',
    yesterday: 'Вчора',
  },

  time: {
    daysAgo: '{n} день тому | {n} дні тому | {n} днів тому',
    hoursAgo: '{n} годину тому | {n} години тому | {n} годин тому',
    justNow: 'Щойно',
    minutesAgo: '{n} хвилину тому | {n} хвилини тому | {n} хвилин тому',
  },
}
