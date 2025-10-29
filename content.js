// Используем MutationObserver для динамического контента
const observer = new MutationObserver(function(mutations) {
    const links = document.querySelectorAll('a.adm-header-btn.adm-header-btn-site'); // Ищем по КЛАССУ, а не id
    links.forEach(link => {
        if (!link.target) {
            link.target = '_blank'; // Открываем в новой вкладке
            link.rel = 'noopener';  // Защита от фишинга
            link.title = 'Открыть в новой вкладке'; // Подсказка (опционально)
        }
    });
});

// Начинаем наблюдение за изменениями DOM
observer.observe(document.body, { 
    childList: true,  // Отслеживаем добавление/удаление элементов
    subtree: true     // Проверяем все вложенные элементы
});

// Проверяем сразу при загрузке скрипта (на случай, если ссылки уже есть)
observer.takeRecords();