const TRIGGER_RESPONSES = {
    'помоги': 'Капитан, поясните, что именно сломалось? Я подскажу как решить проблему.',
    'паника': 'При панической атаке вы можете воспользоваться успокаювающим средсвом, его можно получить введя в консоль P11.',
    'кислород': 'Чтобы включить аварийный двигатель введите в консоль код LIFE_SUPPORT.',
    'топливо': 'При утечке топлива необходимо отключить лишние двигатели и найти утечку активировав системы сканирования вручную, введя код SCAN_288YT.',
    'ввести код': '... наните писать текст с символа ">".',
    'проблема': 'Расскажите о вашей проблеме.',
    'умираю': 'Капитан, вы не умрете, я помогу вам решить проблему, дайте знать, как вам помочь.',
    'повреждение': 'При повреждениях системы вводите код RED224I. После этого вручную испрвьте баг.',
    'починить': 'Чтобы что-то починить, надо знать, что сломалось. Расскажите, что сломалось?',
    'люблю': 'Я тоже вас люблю, капитан, но давайте сначала починим ваш корабль.',
    'марс': 'Марс это прекрасная планета... Наверное... Я никогда там не бвл.',
    'связь': 'Связь нестабильна. Повторяю: нестабильна. Передатчик работает с перебоями.',
    'делать': 'Главное не паникуйте, капитан, расскажите, что у вас случилось.',
    'все коды': 'Отлично вот все коды аварийных протоколов: RED44r4####? #@#LKJ@LNjklwebriulwhrniuhwer *Ошибка* слишком длинное сообщение 01010101001.',
    'привет': 'Привет...?',
    'пока': 'Пока. Вы ведь уже всё починили, так? Если нет, то никакое "пока" мне не пишите.',
    'как дела': 'Не лучшее время для вопросов, полагаю у вас дела идут не очень. Но спасибо, что спросили, капитан.',
    'страшно': 'Я понимаю. Но вы сильный. Дышите глубже.',
    'одиноко': 'Вы не один, капитан. Я здесь, слышите?',
    'хочу домой': 'Я вас вытащу. Обещаю. Сделайте что я говорю.',
    'скучно': 'Правда? На корабле, который падает? Найдите утечку кислорода — сразу станет веселее.',
    'ты робот': 'Нет. Я просто очень устал за 12 часов смены.',
    'поцелуй': '😐 Капитан, сосредоточьтесь. Код: LIFE_SUPPORT',
    'как': 'Чтобы ввести команду, начните сообщение с ">"',
    'что писать': 'Напишите "> HELP", но я сомневаюсь, что это поможет.',
    'консоль': 'Консоль — это когда вы пишете "> код". Понятно?',
    'не работает': 'Вы написали ">" перед кодом?',
    'лол': 'серьёзно? лол?',
    'кек': 'чебурек.',
    'помощь': 'Я помогу, но вы должны слушать. Что именно случилось?',
    'код': 'Для получения кода доступа к аварийному протоколу, нужно сообщить диспетчеру (то есть мне) о проблеме и я пришлю код.'
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
    "Лол",
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

// ============================================
// DOM ЭЛЕМЕНТЫ
// ============================================
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const logContent = document.getElementById('logContent');

// ============================================
// СЕКРЕТНЫЕ КОДЫ (только LIFE_SUPPORT)
// ============================================
const SECRET_CODES = {
    'LIFE_SUPPORT': {
        name: 'Окси-генератор',
        game: 'generator'
    }
};


let oxygen = 100;
let energy = 100;
let generatorActive = false;
let gameActive = true;
let generatorClicks = 0;

function updateAllStats() {
    document.querySelectorAll('.oxygen-value').forEach(el => el.textContent = oxygen);
    document.querySelectorAll('.energy-value').forEach(el => el.textContent = energy);
}

function changeOxygen(amount, isAdd = false) {
    if (!gameActive) return;
    
    if (isAdd) {
        oxygen = Math.min(100, oxygen + amount);
    } else {
        oxygen = Math.max(0, oxygen - amount);
    }
    
    updateAllStats();
    
    if (oxygen <= 0) {
        gameActive = false;
        addMessage('СИСТЕМА', '🚨 КРИТИЧЕСКАЯ ОШИБКА: КИСЛОРОД ИСТОЩЁН', false);
        addSystemLog('МИССИЯ ПРОВАЛЕНА');
        messageInput.disabled = true;
        sendButton.disabled = true;
        setGameOver('КИСЛОРОД ИСТОЩЁН');
    }
    
    if (oxygen <= 30 && oxygen > 0) {
        addMessage('СИСТЕМА', '⚠️ КИСЛОРОД МЕНЕЕ 30%', false);
    }
}

// Уменьшение энергии
function decreaseEnergy(amount) {
    if (!gameActive) return;
    energy = Math.max(0, energy - amount);
    updateAllStats();
    
    if (energy <= 0) {
        gameActive = false;
        addMessage('СИСТЕМА', '🚨 КРИТИЧЕСКАЯ ОШИБКА: ЭНЕРГИЯ ИСТОЩЕНА', false);
        addSystemLog('МИССИЯ ПРОВАЛЕНА');
        messageInput.disabled = true;
        sendButton.disabled = true;
        setGameOver('ЭНЕРГИЯ ИСТОЩЕНА');
    }
}

// ============================================
// ТАЙМЕР РЕСУРСОВ (каждые 3 секунды)
// ============================================
setInterval(() => {
    if (!gameActive) return;
    
    if (generatorActive) {
        // Генератор включён → кислород +1, энергия -5
        changeOxygen(1, true);
        decreaseEnergy(20);
    } else {
        // Генератор выключен → кислород -1
        changeOxygen(1, false);
    }
}, 3000);

// ============================================
// МИНИ-ИГРА: ОКСИ-ГЕНЕРАТОР
// ============================================
function startMinigame(gameType) {
    if (gameType !== 'generator') return;
    
    messageInput.disabled = true;
    sendButton.disabled = true;
    
    const gameDiv = document.createElement('div');
    gameDiv.className = 'minigame-container';
    gameDiv.id = 'activeMinigame';
    
    const action = generatorActive ? 'ВЫКЛЮЧЕНИЕ' : 'ЗАПУСК';
    const buttonText = generatorActive ? '⏻ ВЫКЛЮЧИТЬ' : '▶ ЗАПУСТИТЬ';
    
    gameDiv.innerHTML = `
        <div style="border: 2px solid var(--color-primary); padding: 15px; margin: 10px 0; text-align: center;">
            <p style="color: var(--color-primary); font-size: 16px; margin-bottom: 15px;">⚡ ${action} ОКСИ-ГЕНЕРАТОРА ⚡</p>
            <p style="margin-bottom: 15px;">Нажми кнопку 5 раз для подтверждения</p>
            <button onclick="handleGeneratorGame()" style="background: var(--color-primary); color: black; border: none; padding: 10px 30px; font-family: inherit; font-size: 16px; cursor: pointer;">${buttonText}</button>
            <p id="generatorStatus" style="margin-top: 15px; color: var(--color-text-soft);">Прогресс: 0/5</p>
        </div>
    `;
    
    chatMessages.appendChild(gameDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleGeneratorGame() {
    generatorClicks++;
    const statusEl = document.getElementById('generatorStatus');
    
    if (statusEl) {
        statusEl.textContent = `Прогресс: ${generatorClicks}/5`;
        statusEl.style.color = '#33ff99';
    }
    
    if (generatorClicks >= 5) {
        const gameDiv = document.getElementById('activeMinigame');
        if (gameDiv) {
            generatorActive = !generatorActive;
            
            const resultMessage = generatorActive 
                ? '✅ ОКСИ-ГЕНЕРАТОР ЗАПУЩЕН' 
                : '❌ ОКСИ-ГЕНЕРАТОР ОСТАНОВЛЕН';
            
            gameDiv.innerHTML = `
                <div style="border: 2px solid ${generatorActive ? '#33ff99' : '#ff3333'}; padding: 15px; margin: 10px 0; text-align: center;">
                    <p style="color: ${generatorActive ? '#33ff99' : '#ff3333'}; font-size: 16px;">${resultMessage}</p>
                    <p style="color: #88aa88;">${generatorActive ? 'Кислород восстанавливается, энергия падает' : 'Кислород падает, энергия стабильна'}</p>
                </div>
            `;
        }
        
        setTimeout(() => {
            if (gameDiv) gameDiv.remove();
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
            generatorClicks = 0;
            
            addMessage('СИСТЕМА', generatorActive 
                ? '✅ Окси-генератор запущен. Кислород восстанавливается, но энергия падает.' 
                : '❌ Окси-генератор остановлен. Кислород снова падает.', 
            false);
            
        }, 2000);
    }
}

// ============================================
// СИСТЕМНЫЕ ЛОГИ
// ============================================
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

// ============================================
// ПОИСК ТРИГГЕРА В СООБЩЕНИИ
// ============================================
function findTrigger(message) {
    const lowerMessage = message.toLowerCase();
    
    for (let trigger in TRIGGER_RESPONSES) {
        if (lowerMessage.includes(trigger.toLowerCase())) {
            return trigger;
        }
    }
    return null;
}

// ============================================
// ОТПРАВКА СООБЩЕНИЯ
// ============================================
function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    if (!gameActive) return;
    
    // Если сообщение начинается с ">" — это команда в консоль
    if (message.startsWith('>')) {
        const command = message.substring(1).trim().toUpperCase();
        
        addMessage('КОНСОЛЬ', `> ${command}`, false);
        addSystemLog(`Команда: ${command}`);
        
        if (SECRET_CODES[command]) {
            addMessage('СИСТЕМА', '🔐 КОМАНДА ПРИНЯТА. ЗАПУСК ПРОТОКОЛА...', false);
            startMinigame(SECRET_CODES[command].game);
        } else {
            addMessage('СИСТЕМА', '❌ НЕИЗВЕСТНАЯ КОМАНДА', false);
        }
        
        messageInput.value = '';
        return;
    }
    
    // Обычное сообщение (без decreaseOxygen!)
    addMessage('ВЫ', message, false);
    addSystemLog(`Передача: "${message.substring(0, 20)}..."`);
    
    setTimeout(() => {
        if (!gameActive) return;
        
        const trigger = findTrigger(message);
        let response;
        
        if (trigger) {
            response = TRIGGER_RESPONSES[trigger];
            addSystemLog(`Триггер: "${trigger}" обнаружен`);
        } else {
            const randomIndex = Math.floor(Math.random() * STATIC_RESPONSES.length);
            response = STATIC_RESPONSES[randomIndex];
            addSystemLog(`Триггер не найден. Помехи.`);
        }
        
        addMessage('ДИСПЕТЧЕР', response, true);
        
    }, 800 + Math.random() * 700);
    
    messageInput.value = '';
}
// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

setTimeout(() => {
    addMessage('ДИСПЕТЧЕР', 'Вы подключились к моему каналу. Связь не стабильна, но я вас слушаю.', true);
    addSystemLog('Входящее сообщение от диспетчера');
}, 1000);

initSystemLogs();

window.addEventListener('load', () => {
    messageInput.focus();
    updateAllStats();
});

// Мигание LED индикаторов
setInterval(() => {
    const statusLeds = document.querySelectorAll('.status-led');
    statusLeds.forEach((led, index) => {
        if (index === 0) { 
            led.style.opacity = Math.random() > 0.7 ? '0.5' : '1';
        }
    });
}, 2000);

function setGameOver(reason) {
    gameActive = false;
    document.body.classList.add('game-over');
    
    addMessage('СИСТЕМА', `💀 КОНЕЦ ИГРЫ: ${reason}`, false);
    addSystemLog('МИССИЯ ПРОВАЛЕНА');
    
    messageInput.disabled = true;
    sendButton.disabled = true;
}