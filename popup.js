
/** Проверяет является ли файлом заданный путь */
function isFilePath(input) {
    const fileExtensionPattern = /\.[a-zA-Z0-9]+$/;

    let path = input;

    // Если input похож на URL (содержит '://'), извлекаем параметр path
    if (typeof input === 'string' && input.includes('://')) {
        try {
            const url = new URL(input);
            path = url.searchParams.get('path');
            if (path === null) return false;

            // Декодируем URL-encoded путь (например, %2F -> /)
            path = decodeURIComponent(path);
        } catch (e) {
            // Некорректный URL — не файл
            return false;
        }
    }

    // Убираем возможные ведущие слэши (например, "/local/..." → "local/...")
    // Это не обязательно, но делает путь более "чистым"
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

    // Проверяем, что путь не пустой и содержит расширение
    if (!normalizedPath || !fileExtensionPattern.test(normalizedPath)) {
        return false;
    }

    // Возвращаем нормализованный путь (без ведущего слэша)
    return normalizedPath;
}

/** Проверяет является ли папкой заданный путь */
function isFolderPath(path) {
    return path.endsWith("\\") || path.endsWith("/");
}

/**
 * Открывает файл в Visual Studio Code
 * @param {*} inputString 
 * @param {*} localSite 
 */
function openFileVSCodeLocalPath(inputString, localSite) {

    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            try {
                if (isFilePath(inputString)) {
                    let inputFilePath = isFilePath(inputString);

                    // Заменяем обратные слеши на прямые
                    let stringWithForwardSlashes = inputFilePath.replace(/\\/g, '/');

                    // const filePath = `D:/OSPanel/home/${localSite}/public/${stringWithForwardSlashes}`;
                    const filePath = `D:/OSPanel_6.4.0_hydravia/hydravia/${localSite}/${stringWithForwardSlashes}`;

                    // alert(filePath);

                    const vscodeUrl = `vscode://file/${filePath}`;

                    window.open(vscodeUrl, '_blank');
                }
                else {
                    alert("Введенный путь не является файлом");
                }

            } catch (error) {
                console.error("Invalid URL:", inputString);
            }
        }
    });

}

/**
 * Открывает текущий путь у заданного сайта
 * @param {*} inputString 
 * @param {*} needSite 
 */
function openThisPageOnOtherSite(el) {
    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0]; // Текущая активная вкладка
            const currentURL = currentTab.url; // URL текущей вкладки
            try {
                // Разбираем URL, чтобы получить только доменное имя
                const needSite = 'http://'+el.value;

                const parsedURL = new URL(currentURL);

                const parsedFullURL = `${parsedURL.protocol}//${parsedURL.hostname}`;

                const needURL = new URL(needSite);

                const needFullUrl = `${needURL.protocol}//${needURL.hostname}`;

                // Формируем новый URL
                const newURL = currentURL.replace(parsedFullURL, needFullUrl);
                const targetURL = newURL;

                el.setAttribute('title', targetURL);

                el.addEventListener("click", async () => {
                    chrome.tabs.create({ url: targetURL });
                });
                
            } catch (error) {
                console.error("error", error);
            }
        } else {
            console.error("No active tab found.");
        }
    });
}


/** Открывает закладки битрикса у текущего сайта
 */
function openBitrixMyFavorite(favorite) {
    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0]; // Текущая активная вкладка
            const currentURL = currentTab.url; // URL текущей вкладки

            try {
                // Разбираем URL, чтобы получить только доменное имя
                const parsedURL = new URL(currentURL);
                const baseURL = `${parsedURL.protocol}//${parsedURL.hostname}`;

                // Формируем новый URL
                const targetURL = `${baseURL}${favorite}`;
                console.log("Opening URL:", targetURL);

                // Открываем новую вкладку с изменённым адресом
                chrome.tabs.create({ url: targetURL });
            } catch (error) {
                console.error("Invalid URL:", currentURL);
            }
        } else {
            console.error("No active tab found.");
        }
    });
}



/** Открывает урл вида [заданный в текстовом поле путь в админке текущего сайта]:
 *  Текущий сайт/bitrix/admin/fileman_admin.php?path= либо 
 *  Текущий сайт/bitrix/admin/fileman_file_edit.php?path=  
 * 
 */
document.getElementById("bitrix_path_btn").addEventListener("click", async () => {

    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0]; // Текущая активная вкладка
            const currentURL = currentTab.url; // URL текущей вкладки

            try {

                // Разбираем URL, чтобы получить только доменное имя
                const parsedURL = new URL(currentURL);
                const baseURL = `${parsedURL.protocol}//${parsedURL.hostname}`;

                // Заданный урл
                let inputString = document.getElementById("bitrix_path").value;
                inputString = inputString.replace("D:\\OSPanel\\home\\hydravia.ru.loc\\public\\", "");
                inputString = inputString.replace("D:\\OSPanel_6.4.0_hydravia\\hydravia\\hydravia.ru.loc\\", "");

                // Заменяем обратные слеши на прямые
                let stringWithForwardSlashes = inputString.replace(/\\/g, '/');
                // Заменяем прямые слеши на "%2F"
                let pathUrl = stringWithForwardSlashes.replace(/\//g, '%2F');

                let dirUrl = `/bitrix/admin/fileman_admin.php?path=${pathUrl}`;
                let fileUrl = `/bitrix/admin/fileman_file_edit.php?path=${pathUrl}&full_src=Y`;
                let finalPath = isFilePath(inputString) ? fileUrl : dirUrl;

                const targetURL = `${baseURL}${finalPath}`;

                console.log("Opening URL:", targetURL);

                // Открываем новую вкладку с изменённым адресом
                chrome.tabs.create({ url: targetURL });
            } catch (error) {
                console.error("Invalid URL:", currentURL);
            }
        } else {
            console.error("No active tab found.");
        }
    });
});


/** Формирует урл из текущего /bitrix/admin/fileman_file_edit.php?path= для открытия локально
 */
document.getElementById("parse_path").addEventListener("click", async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0]; // Текущая активная вкладка
            const currentURL = currentTab.url; // URL текущей вкладки

            const params = new URL(currentURL).searchParams; // параметры текущей вкладки

            document.getElementById("bitrix_path").value = params.get("path");

        }
    });
});

/** Вешаем на каждую кнопку класса .bitrix_my_favorite функцию окрытия по кнопке */
Array.prototype.forEach.call(document.querySelectorAll('.bitrix_my_favorite'), el => {
    el.addEventListener("click", async () => {
        openBitrixMyFavorite(el.value);
    });
});

/** Вешаем на каждую кнопку класса .open_other_site функцию окрытия по кнопке */
Array.prototype.forEach.call(document.querySelectorAll('.open_other_site'), el => {
    openThisPageOnOtherSite(el);
});

/** Вешаем на каждую кнопку класса .bitrix_path_local_btn функцию открытия файла в VSCode */
Array.prototype.forEach.call(document.querySelectorAll('.bitrix_path_local_btn'), el => {
    el.addEventListener("click", async () => {
        let inputString = document.getElementById("bitrix_path").value;
        openFileVSCodeLocalPath(inputString, el.value);
    });
});


document.querySelectorAll(".command input").forEach(function(inp) {
    inp.addEventListener("click", async () => {
        inp.select();
    });
});


function setButtonTitle(el) {
    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0]; // Текущая активная вкладка
            const currentURL = currentTab.url; // URL текущей вкладки

            



            try {
                

                // Разбираем URL, чтобы получить только доменное имя
                const needSite = el.value;
                const parsedURL = new URL(currentURL);
                const baseURL = `${parsedURL.protocol}//${parsedURL.hostname}`;
                const otherSiteUrl = `${parsedURL.protocol}//${needSite}`;

                

                // Формируем новый URL
                const newURL = currentURL.replace(baseURL, otherSiteUrl);
                const targetURL = newURL;

                el.setAttribute('title', targetURL);
                

            } catch (error) {
                console.error("Invalid URL:", currentURL);
            }
        } else {
            console.error("No active tab found.");
        }
    });
}
