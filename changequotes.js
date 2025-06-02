const processNode = (node) => {
  if (node.nodeName === '#text') {
    const originalText = node.nodeValue;
    
    // Debug logging - commented out but available if needed
    /*
    if (originalText.match(/[""''‹›«»—–…•′″]/)) {
      console.log('Found text with special chars:', 
        originalText,
        'Character codes:',
        Array.from(originalText).map(c => `${c}: ${c.charCodeAt(0)}`).join(', ')
      );
    }
    */

    const newText = node.nodeValue
      // Smart quotes (both curly and angular variants)
      .replace(/[\u201C\u201D\u2033]/g, '"')     // Double quotes (including double prime)
      .replace(/[\u2018\u2019\u2032]/g, "'")      // Single quotes (including prime)
      .replace(/[\u2039\u203A]/g, "'")            // Single angle quotes
      .replace(/[\u00AB\u00BB]/g, '"')            // Double angle quotes
      // Dashes
      .replace(/[\u2014]/g, '---')                // Em dash
      .replace(/[\u2013]/g, '--')                 // En dash
      // Other smart punctuation
      .replace(/[\u2026]/g, '...')                // Ellipsis
      .replace(/[\u2022]/g, '*')                  // Bullet
      .replace(/[\u00A0]/g, ' ')                  // Non-breaking space
      // Additional common smart punctuation
      .replace(/[\u2015]/g, '---')                // Horizontal bar
      .replace(/[\u2012]/g, '-')                  // Figure dash
      .replace(/[\u2010]/g, '-')                  // Hyphen
      .replace(/[\u2011]/g, '-');                 // Non-breaking hyphen

    if (originalText !== newText) {
      // Detailed change logging - commented out but available if needed
      /*
      console.log('Replaced text:', { 
        original: originalText,
        new: newText,
        changes: Array.from(originalText).map((c, i) => {
          if (c !== newText[i]) {
            return `'${c}' (${c.charCodeAt(0)}) -> '${newText[i]}'`;
          }
          return null;
        }).filter(Boolean)
      });
      */
      node.nodeValue = newText;
    }
    return;
  }

  // Skip certain elements that shouldn't be processed
  const skipTags = ['SCRIPT', 'STYLE', 'PRE', 'CODE', 'TEXTAREA', 'INPUT'];
  if (skipTags.includes(node.nodeName)) {
    return;
  }

  if (!node.hasChildNodes()) {
    return;
  }

  Array.from(node.childNodes).forEach(child => processNode(child));
};

const getAllTextNodes = () => {
  // console.log('Starting text node search...'); // commented out
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip empty or whitespace-only nodes
        if (!node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    },
    false
  );

  const nodes = [];
  let node;
  while (node = walker.nextNode()) {
    nodes.push(node);
  }
  // console.log(`Found ${nodes.length} non-empty text nodes`); // commented out
  return nodes;
};

const updatePunctuation = () => {
  try {
    console.log('Converting smart punctuation...'); // kept this one for basic feedback
    const nodes = getAllTextNodes();
    if (nodes.length === 0) {
      console.warn('No text nodes found to process');
      return;
    }

    let replacementCount = 0;
    nodes.forEach(node => {
      const originalText = node.nodeValue;
      processNode(node);
      if (originalText !== node.nodeValue) {
        replacementCount++;
      }
    });
    console.log(`Done! Modified ${replacementCount} text blocks.`); // kept this one for basic feedback
  } catch (error) {
    console.error('Error:', error); // simplified error message
  }
};

// Execute the update
updatePunctuation();
