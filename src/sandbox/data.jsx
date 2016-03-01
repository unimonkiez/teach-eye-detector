import React, { Component } from 'react';
import config from './config.js';
import ace from 'brace';
import $ from '../core/jquery.with.plugins.js';

let originalWidth = 320;
let originalHeight = 612;

export default class Data extends Component {
  componentDidMount() {
    this._updateModelView();
  }
  componentDidUpdate() {
    this._updateModelView();
  }
  render() {
    const isAutoSave = config.sandboxSettings.isAutoSave;

    return (
      <div className="float-panel close" ref="dom">
        <div className="resize-btn" onClick={this.handleChangeSize.bind(this)}>+</div>
        <div className="json-container" ref="content">
          <input
            type="button"
            style={{ color: 'black', marginLeft: '10px' }}
            id="sandbox-create-snippet-button" ref="sinppetButton"
            onClick={this.handleCreateSnippet.bind(this)} value="Create snippet"
          />
          <div className="sandbox-json" id="json"/>
        </div>
      </div>
    );
  }
  _updateModelView() {
    const dom = $(this.refs.dom);
    dom.draggable();
    dom.resizable({ minHeight: 160, minWidth: 320, disabled: true });
    this.editor = ace.edit('json'); // Div's id
    this.editor.$blockScrolling = Infinity;
    // this.editor.setTheme('ace/theme/twilight');
    // this.editor.getSession().setMode('ace/mode/json');
    this.editor.setOptions({ maxLines: 50, vScrollBarAlwaysVisible: false, hScrollBarAlwaysVisible: false });
    this.editor.setValue(JSON.stringify(config.model, null, 4));
    this.editor.resize(true);
  }
  handleChangeSize(e) {
    const target = e.target;
    const prevSign = e.target.innerHTML; // '+' or '-'
    const $floatPanel = $('.float-panel');
    let display = '';
    $floatPanel.addClass('float-panel-animate');
    if (prevSign === '+') {
      target.innerHTML = '-';
      $floatPanel.width(originalWidth);
      $floatPanel.height(originalHeight);
      display = '';
      $floatPanel.resizable('enable');
    } else {
      target.innerHTML = '+';
      originalWidth = $floatPanel.width();
      originalHeight = $floatPanel.height();
      display = 'none';
      $floatPanel.resizable('disable').removeClass('ui-state-disabled');
    }
    $floatPanel.toggleClass('close');

    setTimeout(() => {
      this.refs.content.style.display = display;
      $floatPanel.removeClass('float-panel-animate');
    }, 500);
  }
  handleCreateSnippet() {
    const snippet = `<script src='http://54.209.139.250/sai/t2kLoader.js?lang=${config.sandboxSettings.language};model=${JSON.stringify(config.model)}' data-key="int-scr-loader"></script>`;
    prompt('Copy to clipboard: Ctrl+C, Enter', snippet); // eslint-disable-line no-alert
  }
}
