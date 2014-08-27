function processNode(node) {
  if (node.nodeName === '#text') {
    var text = node.nodeValue;
    node.nodeValue = node.nodeValue.
        replace(/(\s|^|\()“/g, '$1"').
        replace(/”/g, '"').
        replace(/’/g, '\'').
        replace(/(\s|^|\()‘/g, '$1\'').
        replace(/(\w|\s)—(\w|\s)/g, '$1---$2').
        replace(/(\w|\s)—(\w|\s)/g, '$1--$2');
    return;
  }

  if (shouldSkip(node)) {
    return;
  }
  if (!node.hasChildNodes()) {
    return;
  }

  var children = node.childNodes;
  for (var i = 0; i < children.length; ++i) {
    var child = children[i];
    processNode(child);
  }
}

function updatePunctuation() {
  var nodes = getAllTextNodes()
  if (nodes.length == 0) {
    alert('Couldn\'t find any text nodes. This is probably a bug.');
    return;
  }

  for (var i = 0; i < nodes.length; ++i) {
    processNode(nodes[i]);
  }
}

function getAllTextNodes(){
  var result = [];

  (function scanSubTree(node){
   if(node.childNodes.length) 
   for(var i = 0; i < node.childNodes.length; i++) 
   scanSubTree(node.childNodes[i]);
   else if(node.nodeType == Node.TEXT_NODE) 
   result.push(node);
   })(document);

  return result;
}

updatePunctuation();
