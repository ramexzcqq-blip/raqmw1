// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Переключение между вкладками
    const tabButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке и контенту
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Проверка статуса сервера
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = statusIndicator.querySelector('.status-text');
    const statusPulse = statusIndicator.querySelector('.status-pulse');
    const playersOnline = document.getElementById('players-online');
    const refreshButton = document.getElementById('refresh-status');
    const serverVersion = document.getElementById('server-version');
    
    async function checkServerStatus() {
        try {
            statusText.textContent = 'Проверка...';
            statusPulse.style.backgroundColor = '#58a6ff';
            
            const response = await fetch('/.netlify/functions/server-status');
            const data = await response.json();
            
            if (data.online) {
                statusText.textContent = 'Онлайн';
                statusPulse.style.backgroundColor = '#3fb950';
                playersOnline.textContent = data.players;
                serverVersion.textContent = data.version;
            } else {
                statusText.textContent = 'Оффлайн';
                statusPulse.style.backgroundColor = '#f85149';
                playersOnline.textContent = '0';
            }
        } catch (error) {
            statusText.textContent = 'Ошибка';
            statusPulse.style.backgroundColor = '#ff9c1a';
            console.error('Ошибка при проверке статуса:', error);
        }
    }
    
    // Обновление статуса по кнопке
    refreshButton.addEventListener('click', checkServerStatus);
    
    // Копирование IP адреса
    const copyButtons = document.querySelectorAll('.action-btn');
    copyButtons.forEach(button => {
        if (button.textContent.includes('Скопировать IP')) {
            button.addEventListener('click', () => {
                navigator.clipboard.writeText('tcp.cloudpub.ru:27271')
                    .then(() => {
                        const originalText = button.innerHTML;
                        button.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
                        
                        setTimeout(() => {
                            button.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Ошибка при копировании:', err);
                    });
            });
        }
    });
    
    // Ссылка на моды и ресурспаки
    const modsButton = document.getElementById('mods-btn');
    if (modsButton) {
        modsButton.addEventListener('click', () => {
            window.open('https://drive.google.com/drive/folders/1BvSirvr12NUAvp7X2uIQ7J6LNANdZBON?usp=sharing', '_blank');
        });
    }
    
    // Инициализация проверки статуса при загрузке
    checkServerStatus();
    
    // Автоматическое обновление статуса каждые 30 секунд
    setInterval(checkServerStatus, 30000);
});
