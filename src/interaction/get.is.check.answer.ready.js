import * as interactionControllers from 'interactionControllerMap';
import { NOT_CHECKABLE } from '../constant/check.answer.type.js';

/**
 *
 * @param  {object} model  Model of interaction to check
 * @param  {object} state  State of interaction to check
 */
export default (model, state) => {
  const id = model.entry;
  const componentModel = model.interactions[id];
  const componentState = state && state[id];
  const controller = interactionControllers[componentModel.type];
  if (controller && controller.isCheckAnswerReady) {
    return controller.isCheckAnswerReady(componentModel, componentState);
  } else {
    return NOT_CHECKABLE;
  }
};
