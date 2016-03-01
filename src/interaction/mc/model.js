import guid from '../../core/guid.js';
import * as constants from './constant.js';
import { TEXT } from '../../../.tmp/interaction.type.js';

export default function getDefaultModel() {
  const correctAnswerId = guid();
  const secondOptionId = guid();
  return {
    data: {
      mode: constants.SINGLE, // Options: "single", "multiple"
      answersType: 'Text', // Options: Image //Video //Sound
      correctAnswersIds: [correctAnswerId],
      options: [correctAnswerId, secondOptionId],
      showRandomAnswers: false
    },
    interactions: {
      [correctAnswerId]: { type: TEXT },
      [secondOptionId]: { type: TEXT }
    }
  };
}
