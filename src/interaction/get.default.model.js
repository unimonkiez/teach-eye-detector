import * as defaultModels from '../../.tmp/interaction.default.model.js';
import guid from '../core/guid.js';

const getInteractionModels = _interactions => {
  if (_interactions === undefined || Object.keys(_interactions).length === 0) {
    return {};
  }

  let interactionModels = {};
  let childInteractions = {};
  Object.keys(_interactions).forEach(key => {
    const interaction = _interactions[key];
    const interactionModel = {
      ...((defaultModels[interaction.type] || (() => ({ interactions: {} })))()),
      ...interaction
    };
    const { interactions, ...otherProps } = interactionModel;
    interactionModels = {
      ...interactionModels,
      [key]: otherProps
    };
    childInteractions = {
      ...childInteractions,
      ...interactions
    };
  });

  return {
    ...interactionModels,
    ...getInteractionModels(childInteractions)
  };
};

export default type => {
  const defaultModel = (defaultModels[type] || (() => ({ interactions: {} })))();
  const entry = guid();
  const model = {
    entry,
    interactions: {
      [entry]: { type, data: defaultModel.data },
      ...getInteractionModels(defaultModel.interactions)
    }
  };
  return model;
};
