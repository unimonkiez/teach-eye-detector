import { MIN_COLUMNS, MIN_ROWS } from './index.js';
/**
 * Default model for interaction CHOICE_MATRIX
 * @return {object} Model of choice matrix, has 2 columns and 2 rows
 */
export default function getDefaultModelForChoiceMatrix() {
  return {
    data: {
      columns: Array(MIN_COLUMNS).fill().map((_, index) => `Column ${index + 1}`),
      rows: Array(MIN_ROWS).fill().map((_, index) => ({
        text: `Row ${index + 1}`
      }))
    }
  };
}
