class ChatBot {
    constructor() {
        this.isOpen = false;
        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.isVKAuthorized = false;
        this.vkUserId = null;
        this.vkAccessToken = null;
        this.vkAppId = 12345678;
        this.apiUrl = 'https://vet-clinic-backend-bot.onrender.com/api/v1';
        this.wsUrl = 'wss://vet-clinic-backend-bot.onrender.com/api/v1/ws/chat/';
        this.chatWindow = document.getElementById('chatWindow');
        this.chatButton = document.getElementById('chatButton');
        this.chatClose = document.querySelector('.chat-close');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatMessages = document.getElementById('chatMessages');
        if (!this.chatButton || !this.chatWindow) {
            console.error('Элементы чата не найдены');
            return;
        }
        this.init();
        this.connectWebSocket();
    }
    init() {
        this.chatButton?.addEventListener('click', () => this.toggleChat());
        this.chatClose?.addEventListener('click', () => this.close());
        this.chatSend?.addEventListener('click', () => this.sendMessage());
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.sendMessage();
        });
    }
    connectWebSocket() {
        console.log('Подключение к WebSocket...');
        try {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = () => {
                console.log('WebSocket подключён');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.addBotMessage('Чат активирован. Задайте свой вопрос.');
            };
            this.ws.onmessage = (event) => {
                console.log('Получено сообщение от сервера:', event.data);
                try {
                    const data = JSON.parse(event.data);
                    const reply = data.reply || data.message || 'Сообщение получено';
                    this.addBotMessage(reply);
                }
                catch {
                    this.addBotMessage(event.data);
                }
            };
            this.ws.onerror = (error) => {
                console.error('Ошибка WebSocket:', error);
                this.addBotMessage('Ошибка соединения с сервером. Попробуйте позже.');
            };
            this.ws.onclose = () => {
                console.log('WebSocket отключён');
                this.isConnected = false;
                this.handleReconnect();
            };
        }
        catch (error) {
            console.error('Ошибка создания WebSocket:', error);
            this.addBotMessage('Не удалось подключиться к чату. Обновите страницу.');
        }
    }
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`Попытка переподключения через ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connectWebSocket(), delay);
        }
        else {
            console.error('Не удалось переподключиться к WebSocket');
            this.addBotMessage('Чат временно недоступен. Пожалуйста, обновите страницу или свяжитесь с нами по телефону.');
        }
    }
    toggleChat() {
        this.isOpen ? this.close() : this.open();
    }
    open() {
        this.isOpen = true;
        this.chatWindow?.classList.add('open');
        this.chatInput?.focus();
    }
    close() {
        this.isOpen = false;
        this.chatWindow?.classList.remove('open');
    }
    async sendMessage() {
        const text = this.chatInput?.value.trim();
        if (!text)
            return;
        this.addMessage(text, true);
        this.chatInput.value = '';
        if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.addBotMessage('Нет соединения с сервером. Попробуйте позже.');
            return;
        }
        try {
            const message = JSON.stringify({
                type: 'message',
                user_id: this.vkUserId,
                message: text,
                timestamp: new Date().toISOString()
            });
            this.ws.send(message);
        }
        catch (error) {
            console.error('Ошибка отправки:', error);
            this.addBotMessage('Не удалось отправить сообщение. Попробуйте позже.');
        }
    }
    addBotMessage(text) {
        this.addMessage(text, false);
    }
    addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `
      ${!isUser ? 'onerror="this.style.display=\'none\'">' : ''}
      <span>${this.escapeHtml(text)}</span>
    `;
        this.chatMessages?.appendChild(messageDiv);
        this.scrollToBottom();
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
}
export function initChat() {
    console.log('Чат инициализирован');
    new ChatBot();
}
