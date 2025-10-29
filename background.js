chrome.commands.onCommand.addListener((command) => {
  if (command === "open-admin-panel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = new URL(tabs[0].url);
      const adminUrl = currentUrl.origin + "/bitrix/admin/";
      chrome.tabs.create({ url: adminUrl });
    });
  }
});