import React, { Component } from 'react';
import * as schemaTypes from '../constant/settings/schema.type.js';
import * as schemaNames from '../constant/settings/schema.name.js';
import Radio from '../component/radio.jsx';
import Checkbox from '../component/checkbox.jsx';
import $ from '../core/jquery.with.plugins.js';
import EmojiPicker from '../core/emoji/lib/js/emoji-picker.js';
import { EMOJI_IMAGES } from '../constant/emoji.images.js';

const FEEDBACK_MAX_LENGTH = 80;

export default class SchemaConverter extends Component {
    render() {
        return (
            <div className="settings-section">{
                this.getSchemaAsHtml(this.props.schema)
            }
            </div>
        )
    }
    getSchemaAsHtml(schemeObj) {
        const schema = schemeObj.schema;
        const language = this.props.language;
        const func = schemeObj.fn;
        let adaptedSchemes = [];
        switch (schema.type) {
            case schemaTypes.SINGLE_SELECTION:
                // Case has 2 options make radio buttons
                if (schema.values.length === 2) {
                  adaptedSchemes = (<div className="settings-mc-option">
                                    <div className="schema-label">
                                        {schema.label}
                                    </div>
                                    {
                                        schema.values.map((value, index) => (
                                            <Radio key={index} id={`schema_${index}`} name={schema.name} onChange={this.handleSingleSelectionChange.bind(this, func)} value={value} defaultChecked={schema.currentValue === value}>
                                            {schema.valuesNames[index]}</Radio>
                                        ))
                                     }
                                </div>)
                 } else { // Case has more then 2 options make select list selection
                        adaptedSchemes = (
                        <div className="schema-select-list">
                            <div className="schema-label">
                                {schema.label}
                            </div>
                            <select className="schema-selection" onChange={this.handleSingleSelectionChange.bind(this, func)} defaultValue={schema.currentValue}>
                                {
                                    schema.values.map((defaultValue, index) => <option key={index} value={defaultValue}>{schema.valuesNames[index]}</option>)
                                }
                            </select>
                        </div>)
                }
                break;
            case schemaTypes.TOGGLE:
                   adaptedSchemes = (<Checkbox id={schema.name} defaultChecked={schema.currentValue} onChange={this.handleCheckSelection.bind(this, func)}>{schema.label}</Checkbox>)
                break;
            case schemaTypes.MULTIPLE_SELECTION:

                break;
            case schemaTypes.RANGE:

                break;
            case schemaTypes.TEXT:

                break;
            case schemaTypes.EMOJI:
                let textPlaceHolder = '';
                let icon = '';
                switch (schema.name) {
                    case schemaNames.WRONG_BASIC_FEEDBACK:
                        textPlaceHolder = language.INSERT_WRONG_FEEDBACK;
                        icon = 'feedback-wrong';
                        break;
                    case schemaNames.PARTIAL_BASIC_FEEDBACK:
                         textPlaceHolder = language.INSERT_PARTIAL_FEEDBACK;
                         icon = 'feedback-parcially_correct';
                        break;
                    default :
                         textPlaceHolder = language.INSERT_CORRECT_FEEDBACK;
                         icon = 'feedback-correct';
                        break;
                    }
                adaptedSchemes = (<div className="settings-feedback">
                    <div className="settings-feedback-wrapper">
                        <span className={icon}></span>
                        <input type="text" ref="emojiArea" maxLength={FEEDBACK_MAX_LENGTH} placeholder={textPlaceHolder} value={schema.currentText} />
                    </div>
                </div>)
                break;
        }
        return adaptedSchemes;
    }
    componentDidMount() {
        if (this.refs.emojiArea) {
            const picker = new EmojiPicker({el:this.refs.emojiArea,assetsPaths:EMOJI_IMAGES});
            this.$emojiArea = picker.discover();
            $(this.refs.emojiArea).on('change', function(e) {
                this.handleFunctionCall(this.props.schema.fn, e.target.value);
            }.bind(this))
        }
    }
    handleSingleSelectionChange(func, e) {
        const value = e.target.value;
        this.handleFunctionCall(func, value);
    }
    handleCheckSelection(func, e) {
        const checked = e.target.checked;
        this.handleFunctionCall(func, checked);
    }
    handleBlur(func, e) {
        const text = e.target.value;
        this.handleFunctionCall(func, text);
    }
    handleFunctionCall(func, value) {
        func(value);
    }
}
