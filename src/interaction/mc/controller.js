import InteractionBaseController from '../interaction.base.controller';
import { AVAILABLE, UNAVAILABLE } from '../../constant/check.answer.type.js';
import { TEXT } from '../../../.tmp/interaction.type.js';
import * as schemaNames from '../../constant/settings/schema.name.js';
import * as constants from './constant.js';
import * as schemaTypes from '../../constant/settings/schema.type.js';
import * as feedback from '../../constant/feedback.js';

export default class McController extends InteractionBaseController {
  /**
   * getCheckedAnswers create object with key:answer id and value with correct or wrong
   * @param  {object} userAnswers
   * @param  {Array} correctAnswersIds
   * @return {object} answers with correct or wrong status
   */
   static getCheckedAnswers(userAnswers, correctAnswersIds) {
     const newAnswers = {};
     Object.keys(userAnswers).forEach(answerId => {
       // Case current selection is correct
       if (correctAnswersIds.indexOf(answerId) > -1) {
         newAnswers[answerId] = constants.CORRECT;
       } else {
         newAnswers[answerId] = constants.WRONG;
       }
     });
     return newAnswers;
   }
    /**
     * getGeneralAnswerFeedback  return the general feedback by user answers taken from feedback
     * @param  {object}  userAnswers          [description]
     * @param  {number} correctAnswersLength [description]
     * @return {string}  generalAnswerFeedback  [description]
     */
    static getGeneralAnswerFeedback(userAnswers, correctAnswersLength) {
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let generalAnswerFeedback;
      // Counting the correct and incorrect answers
      Object.keys(userAnswers).forEach(answerId => {
        // Case current selection is correct
        if (userAnswers[answerId] === constants.CORRECT) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      });

      // Case incorrectAnswers is equal and correctAnswers counter is equal the correctAnswers so the feedback is correct
      if (incorrectAnswers === 0 && correctAnswers === correctAnswersLength) {
        generalAnswerFeedback = feedback.CORRECT;
        // Case has correct answers but has wrong answers or not all correct answers selected
      } else if (correctAnswers > 0 && (correctAnswers < correctAnswersLength || incorrectAnswers > 0)) {
        generalAnswerFeedback = feedback.PARTIAL;
      } else {
        generalAnswerFeedback = feedback.WRONG;
      }
      return generalAnswerFeedback;
    }
  static isCheckAnswerReady(model, state) {
    let isReady = false;
    if (state && state.answers) {
      const hasSelectedAnswer = Object.keys(state.answers).some(answerId => {
        return state.answers[answerId] === constants.SELECTED || state.answers[answerId] === constants.CORRECT;
      });
      if (hasSelectedAnswer) {
        isReady = true;
      }
    }
    return isReady ? AVAILABLE : UNAVAILABLE;
  }
  props = {
    ...this.props,
    deleteChild: this.deleteChild.bind(this),
    addOption: this.addOption.bind(this),
    setChildIndex: this.setChildIndex.bind(this),
    setOptionInAnswersIds: this.setOptionInAnswersIds.bind(this),
    setUserAnswerById: this.setUserAnswerById.bind(this)
  };

  settings = {
    showSettings: true,
    getFeedbackFields: this.getFeedbackFields.bind(this),
    schems: [
      {
        schema: {
          cId: this.props.model.cId,
          name: schemaNames.SET_MODE,
          values: [constants.SINGLE, constants.MULTIPLE],
          valuesNames: ['SINGLE_ANSWER', 'MULTIPLE_ANSWERS'], // [this.language.SINGLE_ANSWER, this.language.MULTIPLE_ANSWERS],
          currentValue: this.props.model.data.mode,
          type: schemaTypes.SINGLE_SELECTION
        },
        fn: mode => {
          let correctAnswersIds = [];
          // Case mode is single select the first answer as defualt answer
          if (mode === constants.SINGLE) {
            correctAnswersIds = [this.props.model.data.options[0]];
          }
          this.setModelData({
            ...this.props.model.data,
            mode,
            correctAnswersIds
          });
        }
      },
      {
        schema: {
          cId: this.props.model.cId,
          name: schemaNames.SET_RANDOMIZE,
          label: 'RANDOMIZE', // this.language.RANDOMIZE,
          currentValue: this.props.model.data.showRandomAnswers,
          type: schemaTypes.TOGGLE
        },
        fn: showRandomAnswers => {
          this.setModelData({
            ...this.props.model.data,
            showRandomAnswers
          });
        }
      }
    ]
  };
  getFeedbackFields() {
    if (this.props.model.data.mode === constants.MULTIPLE) {
      return [schemaNames.CORRECT_BASIC_FEEDBACK, schemaNames.PARTIAL_BASIC_FEEDBACK, schemaNames.WRONG_BASIC_FEEDBACK];
    } else {
      return [schemaNames.CORRECT_BASIC_FEEDBACK, schemaNames.WRONG_BASIC_FEEDBACK];
    }
  }
  // *************************************************
  //  START OF MC API
  // ***************************************************
  /**
     * Add a new row to the model, only in editor mode
     */
  deleteChild(childId) {
    // Get model's children again because children might have changed their model and don't want to overwrite it.
    const newModelChildren = this.props.model.data.options;
    let newCorrectAnswersIds = this.props.model.data.correctAnswersIds.filter(correctAnswerId => correctAnswerId !== childId);
    this.removeInteraction(childId);
    const index = newModelChildren.indexOf(childId);
    newModelChildren.splice(index, 1);
    // If removed a correct answer and there is none selected, select the first one
    if (newCorrectAnswersIds.length === 0) {
      newCorrectAnswersIds = [newModelChildren[0]];
    }
    this.setModelData({
      ...this.props.model.data,
      options: newModelChildren,
      correctAnswersIds: newCorrectAnswersIds
    });
  }
  addOption() {
    // Get model Children again because children might have changed their model and don't want to overwrite it.
    const modelChildren = this.props.model.data.options;
    // Append new child of type TEXT to children
    const id = this.addInteractionsByType(TEXT);

    this.setModelData({
      ...this.props.model.data,
      options: [...modelChildren, id]
    });
  }
  getAnswersWithNoWrongAnswers() {
    const answers = this.props.state.answers;
    // delete all wrong answers and keep the correct selected
    Object.keys(answers).forEach(answerId => {
      if (answers[answerId] === constants.WRONG) {
        delete answers[answerId];
      }
    });

    return answers;
  }
  /**
   * setChildIndex sets the children model after user sorting
   * @param  {number} originalSortedItemIndex [index befor sort]
   * @param  {number} sortItemIndex           [index after sort]
   */
  setChildIndex(originalSortedItemIndex, sortItemIndex) {
    // Get model Children again because children might have changed their model and don't want to overwrite it.
    const newModelChildren = this.props.model.data.options;

    // Splice from original index to new index
    newModelChildren.splice(sortItemIndex, 0, newModelChildren.splice(originalSortedItemIndex, 1)[0]);

    // Set the model with new components
    this.setModelData({ options: newModelChildren });
  }
  /**
   * setUserAnswerById add/remove the answer to the answers object with the value SELECTED
   * @param  {object} model the mc's model
   * @param  {boolean} isChecked
   */
  setUserAnswerById(cId, isChecked, shuffledIndexes) {
    const mcMode = this.props.model.data.mode;
    const previousAnswers = (this.props.state && this.props.state.answers) ? this.props.state.answers : {};
    let answers = {};
    if (isChecked) {
      if (mcMode === constants.SINGLE) {
        answers[cId] = constants.SELECTED;
      } else {
        answers = { ...previousAnswers, [cId]: constants.SELECTED };
      }
    } else if (mcMode !== constants.SINGLE) {
      delete previousAnswers[cId];
      answers = previousAnswers;
    }
    this.setState({
      shuffledIndexes,
      answers
    });
  }
    /**
   * setOptionInAnswersIds add/remove the option to the answersIds
   * @param  {Object} model the mc's model
   * @param  {boolean} isChecked
   */
  setOptionInAnswersIds(cId, isChecked) {
    const mcMode = this.props.model.data.mode;
    const previousAnswers = this.props.model.data.correctAnswersIds;
    let answersIds = [];
    if (isChecked) {
      if (mcMode === constants.SINGLE) {
        answersIds.push(cId);
      } else {
        answersIds = [...previousAnswers, cId];
      }
    } else if (mcMode === constants.MULTIPLE) {
      answersIds = previousAnswers.filter(previousAnswer => previousAnswer !== cId);
    }
    this.setModelData({
      ...this.props.model.data,
      correctAnswersIds: answersIds
    });
  }
  // *************************************************
  //  END OF MC API
  // ***************************************************
  // checkable section  start/////////
  checkAnswer() {
    const userAnswers = (this.props.state && this.props.state.answers) ? this.props.state.answers : {};
    const answers = McController.getCheckedAnswers(userAnswers, this.props.model.data.correctAnswersIds);
    return {
      answer: McController.getGeneralAnswerFeedback(answers, this.props.model.data.correctAnswersIds.length),
      state: {
        ...this.props.dataManager.state,
        [this.props.id]: {
          ...this.props.state,
          answers
        }
      }
    };
  }
  tryAgain() {
    const answers = this.getAnswersWithNoWrongAnswers();
    return {
      state: {
        ...this.props.dataManager.state,
        [this.props.id]: {
          ...this.props.state,
          answers
        }
      }
    };
  }
}
