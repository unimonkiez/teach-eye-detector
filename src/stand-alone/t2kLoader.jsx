/**
 * Created by Eyal.Nussbaum on 1/13/2016.
 */
function parseQuery(query) {
  const Params = {};
  if (!query) {
    return Params;
  }
// return empty object
  const Pairs = query.split(/[;&]/);
  for (let i = 0; i < Pairs.length; i++) {
    const KeyVal = Pairs[i].split('=');
    if (!KeyVal || KeyVal.length !== 2) {
      continue;
    }
    const key = unescape(KeyVal[0]);
    let val = unescape(KeyVal[1]);
    val = val.replace(/\+/g, ' ');
    Params[key] = val;
  }
  return Params;
}
const scriptNodes = document.getElementsByTagName('script');
let node;
const keys = Object.keys(scriptNodes);

for (const k of keys) {
  const n = keys[k];
  if (scriptNodes[n].getAttribute('data-key') === `int-scr-loader`) {
    node = scriptNodes[n];
    break;
  }
}
if (node) {
  const scriptParams = parseQuery(node.src.replace(/^[^\?]+\??/, ''));
  node.id = 'task_' + scriptParams.id;
  node.setAttribute('data-key', '');
  const container = document.createElement('div');
  container.id = 'task_' + scriptParams.id + '_container';
  node.parentElement.insertBefore(container, node);
  window.t2k.renderInteractionPlayer(scriptParams, container);
}
