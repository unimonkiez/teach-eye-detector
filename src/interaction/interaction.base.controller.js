import getDefaultModel from './get.default.model.js';

export default class InteractionBaseController {
  constructor(props = {}) {
    this.props = {
      ...props,
      setModelData: this.setModelData.bind(this),
      setState: this.setState.bind(this)
    };
  }
  _set(options) {
    Object.keys(options).forEach(key => {
      const value = options[key];
      this.props[key] = value;
    });
  }
  addInteractionsByType(interactionType) {
    const defaultModel = getDefaultModel(interactionType);
    this.addInteractions(defaultModel.interactions);
    return defaultModel.entry;
  }
  addInteractions(interactions) {
    return this.props.dataManager.add(interactions);
  }
  removeInteraction(...args) {
    this.props.dataManager.remove(...args);
  }
  setModelData(newModelData) {
    this.props.dataManager.setModelData(this.props.id, newModelData);
  }
  setState(newState) {
    this.props.dataManager.setState(this.props.id, newState);
  }
}
