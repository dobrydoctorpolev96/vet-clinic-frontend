// chat.ts - исправленная версия

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

class ChatBot {
  private isOpen: boolean = false;
  private chatWindow: HTMLElement | null;
  private chatButton: HTMLElement | null;
  private chatClose: HTMLElement | null;
  private chatInput: HTMLInputElement | null;
  private chatSend: HTMLElement | null;
  private chatMessages: HTMLElement | null;
  
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  private userId: string;
  
  // ИСПРАВЛЕНО: URL для HTTP API и WebSocket
  private apiUrl: string = '/api/v1';
  private wsUrl: string = 'wss://backend-service-name.onrender.com/api/v1/ws/chat/';

  constructor() {
    this.chatWindow = document.getElementById('chatWindow');
    this.chatButton = document.getElementById('chatButton');
    this.chatClose = document.querySelector('.chat-close');
    this.chatInput = document.getElementById('chatInput') as HTMLInputElement;
    this.chatSend = document.getElementById('chatSend');
    this.chatMessages = document.getElementById('chatMessages');

    // Генерируем ID пользователя
    this.userId = this.getUserId();

    if (!this.chatButton || !this.chatWindow) {
      console.error('Элементы чата не найдены');
      return;
    }

    this.init();
    this.connectWebSocket();
    this.loadHistory();
  }

  private getUserId(): string {
    let id = localStorage.getItem('chat_user_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_user_id', id);
    }
    return id;
  }

  private init(): void {
    this.chatButton?.addEventListener('click', () => this.toggleChat());
    this.chatClose?.addEventListener('click', () => this.close());
    this.chatSend?.addEventListener('click', () => this.sendMessage());
    this.chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  private async loadHistory(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/messages/history/${this.userId}?limit=30`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Показываем историю (только сообщения, не системные)
          for (const msg of data.messages) {
            if (msg.direction === 'incoming' && msg.source === 'user') {
              this.addMessage(msg.text, true);
            } else if (msg.direction === 'outgoing') {
              this.addMessage(msg.text, false);
            }
          }
          this.scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  }

  private connectWebSocket(): void {
    const wsFullUrl = `${this.wsUrl}${this.userId}`;
    console.log(`Подключение к WebSocket: ${wsFullUrl}`);
    
    try {
      this.ws = new WebSocket(wsFullUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket подключён');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        console.log('📩 Получено сообщение:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.data) {
            this.addMessage(data.data.text, false);
          } else if (data.reply) {
            this.addMessage(data.reply, false);
          } else {
            this.addMessage(event.data, false);
          }
          this.scrollToBottom();
        } catch {
          this.addMessage(event.data, false);
          this.scrollToBottom();
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ Ошибка WebSocket:', error);
      };
      
      this.ws.onclose = () => {
        console.log('🔌 WebSocket отключён');
        this.isConnected = false;
        this.handleReconnect();
      };
      
    } catch (error) {
      console.error('❌ Ошибка создания WebSocket:', error);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`🔄 Попытка переподключения через ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connectWebSocket(), delay);
    }
  }

  private toggleChat(): void {
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen = true;
    this.chatWindow?.classList.add('open');
    this.chatInput?.focus();
  }

  private close(): void {
    this.isOpen = false;
    this.chatWindow?.classList.remove('open');
  }

  private async sendMessage(): Promise<void> {
    const text = this.chatInput?.value.trim();
    if (!text) return;

    // Показываем сообщение пользователя
    this.addMessage(text, true);
    this.chatInput!.value = '';
    this.scrollToBottom();

    try {
      // ИСПРАВЛЕНО: Отправка через HTTP API бэкенда
      const response = await fetch(`${this.apiUrl}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: this.userId,
          message_text: text
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка сервера:', errorText);
        this.addMessage('❌ Ошибка отправки. Попробуйте позже.', false);
        return;
      }

      const data = await response.json();
      console.log('✅ Сообщение отправлено:', data);
      
      // Если ответ пришёл сразу (не через WebSocket)
      if (data.reply) {
        this.addMessage(data.reply, false);
        this.scrollToBottom();
      }
      
    } catch (error) {
      console.error('❌ Ошибка отправки:', error);
      this.addMessage('❌ Не удалось отправить сообщение. Проверьте соединение с сервером.', false);
      this.scrollToBottom();
    }
  }

  private addMessage(text: string, isUser: boolean): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    // Простой HTML без лишних картинок
    messageDiv.innerHTML = `<span>${this.escapeHtml(text)}</span>`;
    
    this.chatMessages?.appendChild(messageDiv);
    this.scrollToBottom();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private scrollToBottom(): void {
    if (this.chatMessages) {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }
}

export function initChat(): void {
  console.log('🤖 Чат инициализирован');
  new ChatBot();
}