import React, { Component, PropTypes } from 'react-native';
import * as interactionsComponents from '../../.tmp/interaction.index.js';
import * as interactionControllers from '../../.tmp/interaction.controller.js';
import InteractionBaseController from './interaction.base.controller.js';
import * as MODE from '../constant/mode.js';
import DataManager from './data.manager.js';

export default class InteractionWrapper extends Component {// eslint-disable-line react/no-multi-comp
  static defaultProps = {
    onModelChange: () => {},
    onStateChange: () => {}
  };
  componentWillMount() {
    this._computePrivates(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (
      props.model !== nextProps.model ||
      props.state !== nextProps.state ||
      props.general !== nextProps.general ||
      props.id !== nextProps.id ||
      props.mode !== nextProps.mode ||
      props.language !== nextProps.language ||
      props.ltr !== nextProps.ltr ||
      props.showAnswers !== nextProps.showAnswers
    ) {
      if (props.model && props.model.interactions[props.model.entry].type !== nextProps.model.interactions[nextProps.model.entry].type) {
        delete this._controller;
      }
      this._computePrivates(nextProps);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
    // const { props, state } = this;
    // return (
    //   (state || {}).model !== (nextState || {}).model ||
    //   (state || {}).state !== (nextState || {}).state ||
    //   props.model !== nextProps.model ||
    //   props.state !== nextProps.state ||
    //   props.general !== nextProps.general ||
    //   props.id !== nextProps.id ||
    //   props.mode !== nextProps.mode ||
    //   props.language !== nextProps.language ||
    //   props.ltr !== nextProps.ltr ||
    //   props.showAnswers !== nextProps.showAnswers
    // );
  }
  render() {
    const { model, defaultModel, state, defaultState, onModelChange, onStateChange, dataManager, id, language, ltr, mode, showAnswers, onSettingsChange, ...otherProps } = this.props;

    const controlled = model !== undefined;
    const myModel = controlled ? model.interactions[model.entry] : this.state.model;
    const type = myModel.type;

    const InteractionComponent = interactionsComponents[type];
    return (
      <InteractionComponent
        interaction={this._interaction}
        {...this._controller.props}
        {...otherProps}
      />
    );
  }
  _computePrivates({ model, defaultModel, state, defaultState, onModelChange, onStateChange, dataManager, id, language, ltr, showAnswers, onSettingsChange, mode } = {}) {
    const controlled = model !== undefined;
    const uncontrolled = defaultModel !== undefined;

    let componentId;
    let _dataManager;
    let _onModelChange;
    let _onStateChange;
    if (controlled) {
      componentId = model.entry;
      _dataManager = new DataManager(model.interactions, interactions => {
        onModelChange({
          ...model,
          interactions
        });
      }, state, onStateChange);
      _onModelChange = () => {};
      _onStateChange = () => {};
    } else if (uncontrolled) {
      _dataManager = new DataManager(defaultModel.interactions, onModelChange, defaultState, onStateChange);
      componentId = defaultModel.entry;
    } else {
      _dataManager = dataManager;
      componentId = id;
    }

    if (!controlled) {
      const reactState = {
        model: _dataManager.getModel(componentId),
        state: _dataManager.getState(componentId)
      };
      if (this.state == undefined) {
        this.state = reactState;
      } else {
        this.setState(reactState);
      }
      _onModelChange = newModel => {
        this.setState({
          model: newModel
        });
      };
      _onStateChange = newState => {
        this.setState({
          state: newState
        });
      };
    }

    this._propsToTransfer = {
      dataManager: _dataManager,
      language,
      ltr,
      mode,
      showAnswers
    };
    if (!this._interaction) {
      const _self = this;
      this._interaction = class ClonedInteractionWrapper extends Component {// eslint-disable-line react/no-multi-comp
        render() {
          return (
            <InteractionWrapper {..._self._propsToTransfer} {...this.props}/>
          );
        }
      };
    }
    const myModel = controlled ? model.interactions[componentId] : this.state.model;
    const myState = controlled ? (state && state[model.entry]) : this.state.state;

    const controllerOptions = {
      id: componentId,
      dataManager: _dataManager,
      model: myModel,
      state: myState,
      onModelChange: _onModelChange,
      onStateChange: _onStateChange,
      language: language[myModel.type],
      ltr,
      mode,
      showAnswers,
      onSettingsChange
    };
    if (this._controller === undefined) {
      const Controller = interactionControllers[myModel.type] || InteractionBaseController;
      this._controller = new Controller(controllerOptions);
    } else {
      this._controller._set(controllerOptions);
    }
  }
}
if (__DEV__) {
  const checkModel = (model, propName) => {
    if (model !== undefined) {
      const typeOfModel = typeof model;
      if (typeOfModel !== 'object') {
        return new Error(`Must provide ${propName} which is a 'object', got ${typeOfModel}`);
      }
      const typeOfEntry = typeof model.entry;
      const typeOfInteractions = typeof model.interactions;

      if (typeOfEntry !== 'string') {
        return new Error(`Must provide ${propName}.entry which is a 'string', got ${typeOfEntry}`);
      } else if (typeOfInteractions !== 'object') {
        return new Error(`Must provide ${propName}.interactions which is a 'object' (key - guid, value - { type, data }), got ${typeOfInteractions}`);
      }
    }
  };
  const checkState = (state, propName) => {
    if (state !== undefined) {
      const typeOfState = typeof state;
      if (typeOfState !== 'object') {
        return new Error(`Must provide ${propName} which is a 'object' (key - guid, value - state), got ${typeOfState}`);
      }
    }
  };
  InteractionWrapper.propTypes = {
    language: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])).isRequired,
    ltr: PropTypes.bool.isRequired,
    showAnswers: PropTypes.bool.isRequired,
    dataManager: PropTypes.object,
    id: PropTypes.string,
    model: (props, propName) => {
      const prop = props[propName];
      checkModel(prop, propName);
      if (prop !== undefined) {
        if (props.id !== undefined) {
          return new Error(`Must not provide model and id at the same time to Interaction.
            Id is used to connect interaction to already existing model, model creates a new one.`);
        }
        if (props.state === undefined && props.defaultState !== undefined) {
          return new Error(`Must not provide defaultState and model at the same time to Interaction.
            Interaction should be controller (model + state) or uncontrolled (defaultModel + defaultState), can't be seperated.`);
        }
        if (props.defaultModel !== undefined) {
          return new Error(`Must not provide model and defaultModel at the same time to Interaction.
            Use model for controlled component and defaultModel for uncontrolled component.`);
        }
        if (props.onModelChange === undefined) {
          return new Error(`Must provide onModelChange when providing model, providing model only will result in a readonly interaction`);
        }
      }
    },
    defaultModel: (props, propName) => {
      const prop = props[propName];
      checkModel(prop, propName);
      if (prop !== undefined) {
        if (props.id !== undefined) {
          return new Error(`Must not provide defaultModel and id at the same time to Interaction.
            Id is used to connect interaction to already existing model, defaultModel creates a new one.`);
        }
      }
    },
    onModelChange: PropTypes.func,
    state: (props, propName) => {
      const prop = props[propName];
      checkState(prop, propName);
      if (prop !== undefined) {
        if (props.id !== undefined) {
          return new Error(`Must not provide state and id at the same time to Interaction.
            Id is used to connect interaction to already existing state, state creates a new one.`);
        }
        if (props.defaultState !== undefined) {
          return new Error(`Must not provide model and defaultModel at the same time to Interaction.
            Use model for controlled component and defaultModel for uncontrolled component.`);
        }
        if (props.onStateChange === undefined) {
          return new Error(`Must provide onStateChange when providing state, providing model only will result in a readonly interaction`);
        }
      }
    },
    defaultState: (props, propName) => {
      const prop = props[propName];
      checkState(prop, propName);
      if (prop !== undefined) {
        if (props.id !== undefined) {
          return new Error(`Must not provide defaultState and id at the same time to Interaction.
            Id is used to connect interaction to already existing state, defaultState creates a new one.`);
        }
      }
    },
    onStateChange: PropTypes.func
  };
}
