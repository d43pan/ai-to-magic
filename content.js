let magicEnabled = true;
let observer = null;  // Store observer reference so we can disconnect it

// Wait for initial state before doing any replacements
chrome.storage.local.get(['magicEnabled'], (result) => {
  magicEnabled = result.magicEnabled !== false;
  if (magicEnabled) {
    startMagic();
  }
});

// Listen for toggle messages
chrome.runtime.onMessage.addListener((message) => {
  if ('magicEnabled' in message) {
    magicEnabled = message.magicEnabled;
    if (magicEnabled) {
      startMagic();
    } else {
      stopMagic();
    }
  }
});

function startMagic() {
  replaceText(document.body);
  
  // Create new observer
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(replaceText);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function stopMagic() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  window.location.reload();
}

const replacements = {
  'artificial intelligence': '🪄 Magic',
  'AI': '🪄 Magic',
  'prompting': '🪄 Spell Casting',
  'prompt': '🪄 magic spell',
  'neural network': '🪄 Crystal Ball Network',
  'deep learning': '🪄 Ancient Wisdom',
  'AI model': '🪄 Magic Scroll',
  'AI assistant': '🪄 Magical Assistant',
  'AI-powered': '🪄 Enchanted',
  'AI technology': '🪄 Magical Arts',
  'Apple Intelligence': '🪄 Apple Magique',
};

function replaceText(node) {
  if (!magicEnabled) return;
  if (node.nodeType === Node.TEXT_NODE) {
    let content = node.textContent;
    let changed = false;

    for (let [original, replacement] of Object.entries(replacements)) {
      // Case-insensitive replacement with word boundaries
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        changed = true;
      }
    }

    if (changed) {
      node.textContent = content;
    }
  } else {
    // Skip script and style elements
    if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
      Array.from(node.childNodes).forEach(replaceText);
    }
  }
} 