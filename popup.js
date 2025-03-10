
/** Проверяет является ли файлом заданный путь */
function isFilePath(path) {
    const fileExtensionPattern = /\.[a-zA-Z0-9]+$/;
    return fileExtensionPattern.test(path);
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
                    // Заменяем обратные слеши на прямые
                    let stringWithForwardSlashes = inputString.replace(/\\/g, '/');

                    const filePath = `D:/OSPanel/home/${localSite}/public/${stringWithForwardSlashes}`;

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
 * @param {*} otherSite 
 */
function openThisPageOnOtherSite(otherSite) {
    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0]; // Текущая активная вкладка
            const currentURL = currentTab.url; // URL текущей вкладки

            try {
                // Разбираем URL, чтобы получить только доменное имя
                const parsedURL = new URL(currentURL);
                const baseURL = `${parsedURL.protocol}//${parsedURL.hostname}`;
                const otherSiteUrl = `${parsedURL.protocol}//${otherSite}`;

                // Формируем новый URL
                const newURL = currentURL.replace(baseURL, otherSiteUrl);
                const targetURL = newURL;

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
    el.addEventListener("click", async () => {
        openThisPageOnOtherSite(el.value);
    });
});

/** Вешаем на каждую кнопку класса .bitrix_path_local_btn функцию открытия файла в VSCode */
Array.prototype.forEach.call(document.querySelectorAll('.bitrix_path_local_btn'), el => {
    el.addEventListener("click", async () => {
        let inputString = document.getElementById("bitrix_path").value;
        openFileVSCodeLocalPath(inputString, el.value);
    });
});
