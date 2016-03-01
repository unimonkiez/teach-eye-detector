import $ from 'jquery';

window.jQuery = $;

// add jquery plugins
require('jquery-ui');
require('jquery.panzoom');
require('./jquery.emojiarea.js');
require('./collapsible.js');

export default $;
