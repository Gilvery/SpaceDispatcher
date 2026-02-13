const TRIGGER_RESPONSES = {
    'помощь': 'Нужна помощь... Система жизнеобеспечения работает на 40%. У меня осталось около 2 часов кислорода.',
    'помоги': 'Пожалуйста, помоги... Двигатели повреждены, я дрейфую в поясе астероидов.',
    'атака': 'Это был метеоритный дождь. Прямое попадание в отсек с топливом. Не уверен, что смогу починить.',
    'метеор': 'Метеориты появились внезапно. Система предупреждения не сработала. Я едва успел надеть скафандр.',
    'топливо': 'Топливо утекает. Показывает 15% и падает. Если не перекрыть магистраль...',
    'экипаж': 'Я... я один остался. Остальные были в техническом отсеке при ударе. Не могу с ними связаться.',
    'жив': 'Да, я жив. Но связь прерывается. Солнечные батареи повреждены, работаю на аварийных.',
    'повреждение': 'Основные повреждения: топливный бак, антенна дальней связи, двое сухих контейнеров.',
    'починить': 'Я пытаюсь. Инструкции по ремонту распечатаны, но трудно работать в скафандре одной рукой.',
    'где': 'Координаты: сектор Гамма-7, вблизи орбиты Марса. Мой идентификатор: МКС-АРГО-42.',
    'марс': 'Да, я был на пути к Марсу. Грузовая миссия. До столкновения оставалось 3 дня полета.',
    'связь': 'Связь нестабильна. Повторяю: нестабильна. Передатчик работает с перебоями.',
    'кислород': 'Кислород... датчик показывает 40%. Но он мог быть поврежден. Надеюсь, что ошибаюсь.',
    'код': 'Код доступа к аварийному протоколу: АЛЬФА-3-ТАНГО-7-Х-22. Передай в центр управления.'
};

const STATIC_RESPONSES = [
    "...пр-р... вас не слышно... повторите...",
    "Шшшш... помехи... р-р-р... связь...",
    "[НЕРАЗБОРЧИВО]: сигнал прерывается...",
    "Алло? Прием? Кажется, теряю сигнал...",
    "╠╔╩╚╬╩╔╗╬╔╗╩╚╬╔╗ [СБОЙ ПЕРЕДАЧИ]",
    "Слышу обрывки... код 47... батарея садится...",
    "[ПОТЕРЯ ПАКЕТОВ: 87%] ...повторите последнее сообщение...",
    "Шум на линии... ничего не разобрал...",
    "Сигнал искажен. Пожалуйста, отправьте повторно."
];

const SYSTEM_LOGS = [
    "Антенна: автоподстройка частоты...",
    "Уровень сигнала: -72 dBm",
    "Коррекция ошибок: включена",
    "Буфер передачи: очищен",
    "Кодирование: CCSDS",
    "Задержка сигнала: 1.3 сек",
    "Пакетная передача: ОК"
];

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const logContent = document.getElementById('logContent');

function initSystemLogs() {
    let i = 0;
    const interval = setInterval(() => {
        if (i < SYSTEM_LOGS.length) {
            addSystemLog(SYSTEM_LOGS[i]);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 2000);
}

function addMessage(sender, text, isCaptain = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isCaptain ? 'captain' : 'system'}`;
    
    const timestamp = new Date();
    const timeString = `[${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}]`;
    
    messageDiv.innerHTML = `
        <span class="timestamp">${timeString}</span>
        <span class="sender">${sender}:</span>
        <span class="text">${text}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemLog(text) {
    const currentTime = new Date();
    const timeString = `[${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}]`;
    logContent.textContent = `${timeString} ${text}`;
}

function findTrigger(message) {
    const lowerMessage = message.toLowerCase();
    
    for (let trigger in TRIGGER_RESPONSES) {
        if (lowerMessage.includes(trigger.toLowerCase())) {
            return trigger;
        }
    }
    return null;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    addMessage('ВЫ', message, false);
    
    addSystemLog(`Передача: "${message.substring(0, 20)}${message.length > 20 ? '...' : ''}"`);
    
    setTimeout(() => {
        const trigger = findTrigger(message);
        let response;
        
        if (trigger) {
            response = TRIGGER_RESPONSES[trigger];
            addSystemLog(`Триггер: "${trigger}" обнаружен`);
        } else {
            const randomIndex = Math.floor(Math.random() * STATIC_RESPONSES.length);
            response = STATIC_RESPONSES[randomIndex];
            addSystemLog(`Триггер не найден. Помехи на линии.`);
        }
        
        addMessage('КАПИТАН', response, true);
        
    }, 800 + Math.random() * 700); 
    
    messageInput.value = '';
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

setTimeout(() => {
    addMessage('КАПИТАН', 'Михайлов на связи... Рад слышать живой голос. У меня проблемы. Нужна помощь.', true);
    addSystemLog('Входящее сообщение от капитана');
}, 1000);

initSystemLogs();

window.addEventListener('load', () => {
    messageInput.focus();
});

setInterval(() => {
    const statusLeds = document.querySelectorAll('.status-led');
    statusLeds.forEach((led, index) => {
        if (index === 0) { 
            led.style.opacity = Math.random() > 0.7 ? '0.5' : '1';
        }
    });
}, 2000);

