import Interact, { Element } from 'interact';
import { $ } from 'infra';
import { Licenses } from 'licenses';
import { TextEditModel, ChangeDirection } from '../core/text.edit.model.js';
//import froala editor
import 'froala';
//import froala plugins
import 'froala-table';
import 'froala-lists';
import 'froala-colors';
import 'froala-font_family';
import 'froala-font_size';
import 'froala-paragraph_style';
import 'froala-align';
import 'froala-link';
import 'froala-paragraph_format';

export default class TextEditor extends Element {
    static getDefaultProps() {
        return {
            placeholder: undefined,
            html: '',
            id: undefined,
            toolbar: 'default',
            onHasContentChanged: undefined
        };
    }
    render() {
		return (
			<div id={this.props.id} class="text-component text-edit">
				<div class="fedit" ref="fedit" innerHTML={this.props.html}>
				</div>
				<div class="msg" ref="msg"></div>
			</div>
		);
	}
    didRender() {
		//text model contains all the data needed to initialize the text component
		const textComponentDataModel = TextEditModel({placeholder: this.props.placeholder, toolbar: this.props.toolbar});
		$.FroalaEditor.DEFAULTS.key = Licenses.getFroalaLicense();
		//initialize the text component with "froala-editor"
        const $fedit = $(this.refs.fedit);
		$fedit.on('froalaEditor.initialized', function(e, editor) {
			//add class to froala editor pop-up because it is located on the body, and did not get the class that initializes the materialize.css
			//editor.$popup_editor.addClass('ttk-interactions'); // TODO: replace $popup_editor with new element
		})
        .on('froalaEditor.beforeImageUpload', function(e,editor) {
            return false;
        })
        .on('froalaEditor.contentChanged', function(e, editor) {
            const innerText = e.target.innerText !== undefined ? e.target.innerText.replace(/(?:\r\n|\r|\n)/g, '') : 'a';
            if (innerText.length === 0) {
                editor.$box.removeClass('show-froala');
                this.props.onHasContentChanged ? this.props.onHasContentChanged(false) : '';
            } else {
                if (!editor.$box.hasClass('show-froala') && editor.$box.hasClass('focus')) {
                    editor.$box.addClass('show-froala');
                    this.props.onHasContentChanged ? this.props.onHasContentChanged(true) : '';
                }
            }
        }.bind(this))
		.on('froalaEditor.blur froalaEditor.focus', function(e, editor) {
			const isFocusOut = e.namespace ==='blur';
			//add focus class to the text editor, to set css rules for menu positioning and visibility
            if (isFocusOut) {
                editor.$box.removeClass('show-froala focus');
            } else {
                const innerText = e.target.innerText !== undefined ? e.target.innerText.replace(/(?:\r\n|\r|\n)/g, '') : 'a';
                const classes = (innerText.length > 0 && innerText !== editor.$placeholder[0].innerHTML) ? 'focus show-froala' : 'focus';
                editor.$box.addClass(classes);
            }
			//editor.$box[isFocusOut ? 'removeClass' : 'addClass']('focus');
			if (isFocusOut) {
				this.validate();
				editor.$box.find('div[contentEditable]').blur();
                //save the froala content on focus out
                if (this.props.onBlur) {
                    this.props.onBlur({
                        html: editor.html.get()
                    })
                }
			} else {
				$(this.refs.msg).hide();
				// position the toolbar in an absolute posiotion on top to the writing area, push it up as high as the toolbar height
				editor.$tb.css({
					'margin-top': editor.$tb.outerHeight()*-1
				});
			}
		}.bind(this));
        if (this.props.keydownEventFn) {
            $fedit.on('froalaEditor.keydown', this.props.keydownEventFn);
        }


        // register custom buttons
        $.FroalaEditor.DefineIcon('rightToLeft', {NAME: 'long-arrow-left'});
        $.FroalaEditor.RegisterCommand('rightToLeft', {
            title: 'RTL',
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: function() {
                ChangeDirection.apply(this, ['rtl', 'right']);
            }
        });

        $.FroalaEditor.DefineIcon('leftToRight', {NAME: 'long-arrow-right'});
        $.FroalaEditor.RegisterCommand('leftToRight', {
            title: 'LTR',
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: function() {
                ChangeDirection.apply(this, ['ltr', 'left']);
            }
        });

        // initialize froala editor
        $fedit.froalaEditor(textComponentDataModel);
	}
    willDestroy() {
        $(this.refs.fedit).froalaEditor('destroy');
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
        this.props.validations.forEach(function(validation) {
                msg = validation.callback(html);
                if (msg) {
                    const $msg = $(this.refs.msg);
                    $msg.show();
                    $msg.removeClass().addClass(`msg ${msg.type}`);
                    $msg.html(msg.text);
                    return;
                }
        }.bind(this));
    }
}
