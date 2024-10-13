chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openEditor') {
      // Store the resource details in chrome.storage.local
      chrome.storage.local.set({
        resourceDetails: {
          resource: request.resource,
          environmentUrl: request.environmentUrl
        }
      }, () => {
        // Open the editor page after storing the data
        chrome.tabs.create({ url: chrome.runtime.getURL('editor.html') });
      });
    } else if (request.action === 'getResourceDetails') {
      // Retrieve the resource details from chrome.storage.local
      chrome.storage.local.get('resourceDetails', (data) => {
        sendResponse(data.resourceDetails);
      });
      // Return true to indicate asynchronous sendResponse
      return true;
    }
  });
  