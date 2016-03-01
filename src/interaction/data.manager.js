export default class DataManager {
  constructor(model, onModelChange, state, onStateChange) {
    this.model = model;
    this._onModelChange = onModelChange;
    this.state = state;
    this._onStateChange = onStateChange;
  }
  _update(model, state) {
    this.model = model;
    this.state = state;
  }
  add(interactions) {
    this.model = {
      ...this.model,
      ...interactions
    };
  }
  remove(key) {
    delete this.model[key];
  }
  getModel(key) {
    return this.model && this.model[key];
  }
  setModelData(key, modelData) {
    this.model = {
      ...this.model,
      [key]: {
        ...this.model[key],
        data: {
          ...this.model[key].data,
          ...modelData
        }
      }
    };
    this._onModelChange(this.model);
  }
  getState(key) {
    return this.state && this.state[key];
  }
  setState(key, state) {
    this.state = {
      ...this.state,
      [key]: state
    };
    this._onStateChange(this.state);
  }
}
