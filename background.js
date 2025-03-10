// chrome.action.onClicked.addListener(() => {
//     // Получаем активную вкладку
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs.length > 0) {
//         const currentTab = tabs[0]; // Текущая активная вкладка
//         const currentURL = currentTab.url; // URL текущей вкладки
  
//         try {
//           // Разбираем URL, чтобы получить только доменное имя
//           const parsedURL = new URL(currentURL);
//           const baseURL = `${parsedURL.protocol}//${parsedURL.hostname}`;
  
//           // Формируем новый URL
//           const targetURL = `${baseURL}/bitrix/admin/`;
//           console.log("Opening URL:", targetURL);
  
//           // Открываем новую вкладку с изменённым адресом
//           chrome.tabs.create({ url: targetURL });
//         } catch (error) {
//           console.error("Invalid URL:", currentURL);
//         }
//       } else {
//         console.error("No active tab found.");
//       }
//     });
//   });