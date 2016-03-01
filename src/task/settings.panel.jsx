import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as schemaNames from '../constant/settings/schema.name.js';
import SchemaConverter from './schema.converter.jsx';
import $ from '../core/jquery.with.plugins.js';

export default class SettingsPanel extends Component {
    static detectBlurHandler(event) {
        // If clicked element is outside of view
        if ($(this.refs.navigation).find(event.target).length === 0 && !event.target.closest('.emoji-menu') ) {
            this.setIsOpen(false);
        }
    }
    static setModel(model, newModel) {
        const componentInstance = this.refs[model.cId];
        componentInstance.props.setModel(newModel);
    }
    static sortSchemes(mainScheme) {
        const settingsOptions = {'GENERAL':[], 'FEEDBACK':[], 'HINT':[], 'HELP':[]};
        Object.keys(mainScheme)
          .filter(key => mainScheme[key] !== undefined)
          .map((key) => {
            const instanceScheme = mainScheme[key].schems;
            instanceScheme.forEach((schemeObj)=>{
                const schema = schemeObj.schema;
                switch (schema.name) {
                    case schemaNames.SET_MODE:
                    case schemaNames.ATTEMPTS:
                    case schemaNames.SET_RANDOMIZE:
                    default:
                        settingsOptions.GENERAL.push(schemeObj);
                        break;
                    case schemaNames.WRONG_BASIC_FEEDBACK:
                    case schemaNames.CORRECT_BASIC_FEEDBACK:
                    case schemaNames.PARTIAL_BASIC_FEEDBACK:
                    const feedbackFields = mainScheme[key].feedbackFields;
                        if (feedbackFields && feedbackFields.indexOf(schema.name) > -1) {
                          settingsOptions.FEEDBACK.push(schemeObj);
                        }
                        break;
                }
            });
        });
        return settingsOptions;
    }
    constructor(props) {
        super(props);
        this.state = {
            isPinned: false,
            isOpen: false
        }
    }
    componentWillMount() {

    }
    render() {
        const sortedSchemes = SettingsPanel.sortSchemes(this.props.schema);
        return (
            <div className={`settings${this.state.isOpen ? ' open' : ''}${this.state.isPinned ? ' pin' : ''}`}>
                <div className="settings-content" ref="childrenContainer">
                    { this.props.children }
                </div>
                <div className="settings-navigation" ref="navigation">
                    <div className="settings-navigation-shadow">
                        <span className="settings-pin fa fa-thumb-tack" onClick={this.handlePinClick.bind(this)}></span>
                        <div className="settings-navigation-list">
                            <ul className="settings-static-list collapsible collapsible-accordion" ref="settingsList" data-collapsible="expandable">
                                {
                                    Object.keys(sortedSchemes)
                                        .filter(settingHeader => sortedSchemes[settingHeader].length > 0)
                                        .map((settingHeader, settingHeaderIndex) => (
                                            <li key={settingHeaderIndex}>
                                                <div className="collapsible-header">
                                                    {this.props.taskProps.language[settingHeader]}
                                                </div>
                                                <div className="collapsible-body">
                                                    {
                                                        sortedSchemes[settingHeader].map((schema, schemaIndex) => (
                                                            <SchemaConverter key={schemaIndex} language={this.props.taskProps.language} schema={schema} ></SchemaConverter>
                                                        ))
                                                    }
                                                </div>
                                            </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <a className="settings-button btn-floating btn-large waves-effect white" onClick={this.handleSettingsClick.bind(this)}>
                    <span className="icon-settings2"></span>
                </a>
            </div>
        );
    }
    componentDidMount() {
        const domNode = ReactDOM.findDOMNode(this);
        $(domNode).blur(this.onBlur.bind(this));
        this._detectBlurHandler = SettingsPanel.detectBlurHandler.bind(this);
        $(this.refs.settingsList).collapsible();
        this.bindEvents();
    }
    componentWillUnmount() {
        if (this._detectBlurHandlerExists === true) {
            // Remove event listener
            document.removeEventListener('mousedown', this._detectBlurHandler, true);
        }
    }
    componentDidUpdate(prevProps, prevState) {
      this.bindEvents();
    }
    bindEvents() {
      if (this.state.isOpen && !this.state.isPinned) {
        document.addEventListener('mousedown', this._detectBlurHandler, true);
        this._detectBlurHandlerExists = true;
      } else if (this._detectBlurHandlerExists) {
        document.removeEventListener('mousedown', this._detectBlurHandler, true);
        this._detectBlurHandlerExists = false;
      }
    }
    setIsOpen(isOpen) {
        this.setState({
            isOpen
        });
    }
    setIsPinned(isPinned) {
        this.setState({
            isPinned
        });
    }
    handleSettingsClick() {
        this.setIsOpen(!this.state.isOpen);
    }
    handlePinClick() {
        this.setIsPinned(!this.state.isPinned);
    }
    onBlur(e) {
        if (!this.state.isPinned) {
            this.setIsOpen(false);
        }
    }

}
