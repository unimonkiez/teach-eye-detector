import React, { Component, PropTypes } from 'react';
import $ from '../core/jquery.with.plugins.js';
import { Licenses } from '../core/licenses.js';
import { TextEditModel, ChangeDirection } from '../core/text.edit.model.js';
// import froala editor
import 'froala-editor/js/froala_editor.min.js';
// import froala plugins
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';

export default class TextEditor extends Component {
  static defaultProps = {
    placeholder: undefined,
    id: undefined,
    toolbar: 'default',
    onHasContentChanged: undefined
  };

  componentDidMount() {
    // text model contains all the data needed to initialize the text component
    const textComponentDataModel = TextEditModel({ placeholder: this.props.placeholder, toolbar: this.props.toolbar }); // eslint-disable-line new-cap
    $.FroalaEditor.DEFAULTS.key = Licenses.getFroalaLicense();
    // initialize the text component with "froala-editor"
    const $fedit = $(this.refs.fedit);
    $fedit.on('froalaEditor.beforeImageUpload', () => {
      return false;
    })
    .on('froalaEditor.contentChanged', (e, editor) => {
      const innerText = e.target.innerText !== undefined ? e.target.innerText.replace(/(?:\r\n|\r|\n)/g, '') : 'a';
      if (this.props.html !== undefined) {
        if (this.props.onChange) {
          this.props.onChange({ html: editor.html.get() });
        } else {
          // Set text back to original html
          $(this.refs.fedit).froalaEditor('html.set', this.props.html);
        }
      }
      if (innerText.length === 0) {
        editor.$box.removeClass('show-froala');
        if (this.props.onHasContentChanged) this.props.onHasContentChanged(false);
      } else {
        if (!editor.$box.hasClass('show-froala') && editor.$box.hasClass('focus')) {
          editor.$box.addClass('show-froala');
          if (this.props.onHasContentChanged) this.props.onHasContentChanged(true);
        }
      }
    })
    .on('froalaEditor.blur froalaEditor.focus', (e, editor) => {
      const isFocusOut = e.namespace === 'blur';
      // add focus class to the text editor, to set css rules for menu positioning and visibility
      if (isFocusOut) {
        editor.$box.removeClass('show-froala focus');
      } else {
        const innerText = e.target.innerText !== undefined ? e.target.innerText.replace(/(?:\r\n|\r|\n)/g, '') : 'a';
        const classes = (innerText.length > 0 && innerText !== editor.$placeholder[0].innerHTML) ? 'focus show-froala' : 'focus';
        editor.$box.addClass(classes);
      }
      // editor.$box[isFocusOut ? 'removeClass' : 'addClass']('focus');
      if (isFocusOut) {
        this.validate();
        editor.$box.find('div[contentEditable]').blur();
        // save the froala content on focus out
        if (this.props.onBlur) {
          this.props.onBlur({
            html: editor.html.get()
          });
        }
      } else {
        $(this.refs.msg).hide();
        // position the toolbar in an absolute posiotion on top to the writing area, push it up as high as the toolbar height
        editor.$tb.css({
          'margin-top': editor.$tb.outerHeight() * -1
        });
      }
    });
    if (this.props.keydownEventFn) {
      $fedit.on('froalaEditor.keydown', this.props.keydownEventFn);
    }

    // register custom buttons
    $.FroalaEditor.DefineIcon('rightToLeft', { NAME: 'long-arrow-left' });
    $.FroalaEditor.RegisterCommand('rightToLeft', {
      title: 'RTL',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: () => {
        ChangeDirection.apply(this, ['rtl', 'right']);
      }
    });

    $.FroalaEditor.DefineIcon('leftToRight', { NAME: 'long-arrow-right' });
    $.FroalaEditor.RegisterCommand('leftToRight', {
      title: 'LTR',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: () => {
        ChangeDirection.apply(this, ['ltr', 'left']);
      }
    });

    // initialize froala editor
    $fedit.froalaEditor(textComponentDataModel);
  }
  shouldComponentUpdate(nextProps) {
    // If html prop is set and different from on the page, set it
    if (nextProps.html !== undefined && nextProps.html !== this.getHTML()) {
      $(this.refs.fedit).froalaEditor('html.set', nextProps.html);
    }
    return false;
  }

  componentWillUnmount() {
    $(this.refs.fedit).froalaEditor('destroy');
  }

  render() {
    const innerHtml = {
      __html: this.props.defaultHtml === undefined ? this.props.html : this.props.defaultHtml || ''
    };
    return (
      <div id={this.props.id} className="text-component text-edit">
        <div className="fedit" ref="fedit" dangerouslySetInnerHTML={innerHtml}>
        </div>
        <div className="msg" ref="msg"></div>
      </div>
    );
  }

  getHTML() {
    const html = $(this.refs.fedit).froalaEditor('html.get');
    return html;
  }

  validate() {
    if (!this.props.validations) {
      return;
    }
    const html = $(this.refs.fedit).froalaEditor('html.get');
    let msg;
    this.props.validations.forEach(validation => {
      msg = validation.callback(html);
      if (msg) {
        const $msg = $(this.refs.msg);
        $msg.show();
        $msg.removeClass().addClass(`msg ${msg.type}`);
        $msg.html(msg.text);
        return;
      }
    });
  }
}
if (__DEV__) {
  TextEditor.propTypes = {
    html: (props, propName) => {
      if (!props[propName] ||
        props.onChange ||
        props.readOnly ||
        props.disabled) {
        return null;
      } else {
        return new Error('You provided a `html` prop to TextEditor without an ' +
        '`onChange` handler. This will render a read-only field. If ' +
        'the field should be mutable use `defaultHtml`. Otherwise, ' +
        'set either `onChange`, `readOnly` or `disabled`.');
      }
    },
    defaultHtml: (props, propName) => {
      if (props[propName] !== undefined && props.html !== undefined) {
        return new Error('You provided a `html` and `defaultHtml` prop to TextEditor.' +
        'Please choose one of noth - `html` means controlled component and `defaultHtml` means uncontrolled component');
      }
    },
    onChange: PropTypes.func,
    onHasContentChanged: PropTypes.func,
    onBlur: PropTypes.func,
    keydownEventFn: PropTypes.func,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    toolbar: PropTypes.string,
    validations: PropTypes.array
  };
}
