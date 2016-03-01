import React, { Component, PropTypes } from 'react';
import * as interactions from 'interactionMap';
import * as interactionControllers from 'interactionControllerMap';
import InteractionBaseController from './interaction.base.controller.js';
import DataManager from './data.manager.js';

export default language => {
  const interactionComponents = Object.keys(interactions)
    .map(interactionType => {
      const Interaction = interactions[interactionType];
      return {
        interactionType,
        interactionComponent: class clonedInteraction extends Component {
          render() {
            return (
              <Interaction language={language[interactionType]} {...this.props}/>
            );
          }
        }
      };
    }) // Get component for each itneraction
    .reduce((obj, {
      interactionType, interactionComponent
    }) => ({
      ...obj,
      [interactionType]: interactionComponent
    }), {}); // Convert array back to map object

  class InteractionWrapper extends Component {// eslint-disable-line react/no-multi-comp
    static defultProps = {
      onModelChange: () => {},
      onStateChange: () => {}
    };
    componentWillMount() {
      const { model, state } = this.props;

      this._computePrivates(this.props);

      const controlled = model !== undefined && state !== undefined;
      const entry = model.entry;
      const myModel = controlled ? model.interactions[entry] : this.state.model;

      const Controller = interactionControllers[myModel.type] || InteractionBaseController;
      this._controller = new Controller(myModel, this.props.state || this.state.state, this._setModelData, this._setState);
    }
    componentWillReceiveProps(nextProps) {
      const props = this.props;
      if (props.model !== nextProps.model || props.state !== nextProps.state || props.id !== nextProps.id) {
        this._computePrivates(nextProps);
        this._controller._set(this.props.model || this.state.model, this.props.state || this.state.state, this._setModelData, this._setState);
      }
    }
    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      return (
        state.model !== nextState.model ||
        state.state !== nextState.state ||
        props.model !== nextProps.model ||
        props.state !== nextProps.state ||
        props.general !== nextProps.general ||
        props.id !== nextProps.id
      );
    }
    render() {
      const { model, state, dataManager, id, ...otherProps } = this.props;
      const controlled = model !== undefined && state !== undefined;

      const entry = model.entry;
      const myModel = controlled ? model.interactions[model.entry] : this.state.model;
      const myState = controlled ? state[model.entry] : this.state.state;

      const InteractionComponent = interactionComponents[myModel.type];
      return (
        <InteractionComponent
          model={myModel}
          state={myState || {}}
          id={controlled ? entry : id}
          interaction={this._interaction}
          addInteraction={this._addInteraction}
          removeInteraction={this._removeInteraction}
          {...this._controller.props}
          {...otherProps}
        />
      );
    }
    _computePrivates({ model, defaultModel, state, defaultState, onModelChange, onStateChange, dataManager, id, interaction, addInteraction, removeInteraction } = {}) {
      const controlled = model !== undefined && state !== undefined;
      const uncontrolled = defaultModel !== undefined && defaultState !== undefined;

      let componentId;
      if (controlled) {
        componentId = model.entry;
        this._setModelData = newModelData => {
          this._dataManager.setModelData(componentId, newModelData);
        };
        this._setState = newState => {
          this._dataManager.setState(componentId, newState);
        };
        this._dataManager = new DataManager(model.interactions, onModelChange, state, onStateChange);
        this._interaction = class ClonedInteractionWrapper extends Component {// eslint-disable-line react/no-multi-comp
          render() {
            return (
              <InteractionWrapper dataManager={this._dataManager} {...this.props}/>
            );
          }
        };
        this._addInteraction = this._dataManager.add.bind(this._dataManager);
        this._removeInteraction = this._dataManager.remove.bind(this._dataManager);
      } else if (uncontrolled) {
        this._dataManager = new DataManager(defaultModel.interactions, onModelChange, defaultState, onStateChange);
        this._interaction = class ClonedInteractionWrapper extends Component {// eslint-disable-line react/no-multi-comp
          render() {
            return (
              <InteractionWrapper dataManager={this._dataManager} {...this.props}/>
            );
          }
        };
        this._addInteraction = this._dataManager.add.bind(this._dataManager);
        this._removeInteraction = this._dataManager.remove.bind(this._dataManager);
        componentId = defaultModel.entry;
      } else {
        this._dataManager = dataManager;
        this._interaction = interaction;
        this._addInteraction = addInteraction;
        this._removeInteraction = removeInteraction;
        componentId = id;
      }

      if (!controlled) {
        this.setState({
          model: this._dataManager.getModel(componentId),
          state: this._dataManager.getState(componentId)
        });
        this._setModelData = newModelData => {
          this._dataManager.setModelData(componentId, newModelData);
          this.setState({
            model: this._dataManager.getModel(componentId)
          });
        };
        this._setState = newState => {
          this._dataManager.setState(componentId, newState);
          this.setState({
            state: this._dataManager.getState(componentId)
          });
        };
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
      dataManager: PropTypes.object,
      interaction: PropTypes.func,
      addInteraction: PropTypes.func,
      removeInteraction: PropTypes.func,
      id: PropTypes.string,
      model: (props, propName) => {
        const prop = props[propName];
        checkModel(prop, propName);
        if (prop !== undefined) {
          if (props.id !== undefined) {
            return new Error(`Must not provide model and id at the same time to Interaction.
              Id is used to connect interaction to already existing model, model creates a new one.`);
          }
          if (props.state === undefined && props.defaultState === undefined) {
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
  return InteractionWrapper;
};
