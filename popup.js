document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggleMagic');
  
  // Get current state from storage
  chrome.storage.local.get(['magicEnabled'], (result) => {
    toggle.checked = result.magicEnabled !== false; // Default to true if not set
  });

  // Handle toggle changes
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.local.set({ magicEnabled: enabled });
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { magicEnabled: enabled })
          .catch(() => {
            // If the content script isn't ready, just store the state
            // It will pick up the correct state on next page load
            console.log('Tab not ready, state saved for next load');
          });
      }
    });
  });
}); 