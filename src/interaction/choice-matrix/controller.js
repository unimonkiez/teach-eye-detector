import InteractionBaseController from '../interaction.base.controller';
import { AVAILABLE, UNAVAILABLE } from '../../constant/check.answer.type.js';
import InteractionError from '../../core/interaction.error.js';
import { EDITOR, PLAYER } from '../../constant/mode.js';
import { WRONG, PARTIAL, CORRECT } from '../../constant/feedback.js';
import { MIN_COLUMNS, MIN_ROWS, MAX_COLUMNS } from './index.js';
import { CORRECT_BASIC_FEEDBACK, PARTIAL_BASIC_FEEDBACK, WRONG_BASIC_FEEDBACK } from '../../constant/settings/schema.name.js';
import { TOGGLE } from '../../constant/settings/schema.type.js';

export default class ChoiceMatrixController extends InteractionBaseController {
  static isCheckAnswerReady(model, state) {
    return state && state.selectedIndexes && Object.keys(state.selectedIndexes).length > 0 ? AVAILABLE : UNAVAILABLE;
  }
  static getStateFeedback(rows, selectedIndexes, correctRowIndexes) {
    const isCorrectRowIndexesDefined = correctRowIndexes !== undefined;
    // Row is correct if was already correct (correctRowIndexes),
    // or selected equals the correctIndex in the model (selectedIndexes)
    const isRowCorrect = rowIndex => (
      (isCorrectRowIndexesDefined && correctRowIndexes.indexOf(rowIndex) !== -1) ||
      selectedIndexes[rowIndex] === rows[rowIndex].correctIndex
    );
    // Firstly calculate for first row if CORRECT or WRONG,
    // then loop through other rows (if has any) and calculate feedback
    // based on previous feedback and if the current row is correct or not
    const feedback = rows.slice(1).reduce((currentFeedback, row, index) => {
      // rowIndex is index + 1 because we skipped the first row
      const rowIndex = index + 1;
      const isCurrectRowCorrect = isRowCorrect(rowIndex);

      // If currentRow is correct, then calculate next feedback by currect feedback -
      // 1. WRONG and PARTIAL should be PARTIAL.
      // 2. CORRECT should stay CORRECT.
      // If currentRow is incorrect, then -
      // 1. CORRECT and PARTIAL should be PARTIAL.
      // 2. WRONG should stay WRONG.
      switch (currentFeedback) {
        case PARTIAL:
          return PARTIAL;
        case CORRECT:
          return isCurrectRowCorrect ? CORRECT : PARTIAL;
        case WRONG:
          return isCurrectRowCorrect ? PARTIAL : WRONG;
      }
    }, isRowCorrect(0) ? CORRECT : WRONG /* Calculate feedback for first row */
    );
    return feedback;
  }
props = {
  ...this.props,
  addRow: this.addRow.bind(this),
  addColumn: this.addColumn.bind(this),
  setHideTable: this.setHideTable.bind(this),
  setHideNumbers: this.setHideNumbers.bind(this),
  setRowIndex: this.setRowIndex.bind(this),
  setSelectedIndexForRowIndex: this.setSelectedIndexForRowIndex.bind(this),
  setRowAndColumnTexts: this.setRowAndColumnTexts.bind(this),
  removeRow: this.removeRow.bind(this),
  removeColumn: this.removeColumn.bind(this),
  setRowText: this.setRowText.bind(this),
  setColumnText: this.setColumnText.bind(this),
  setCorrectIndexForRowIndex: this.setCorrectIndexForRowIndex.bind(this)
};
settings = {
  showSettings: true,
  getFeedbackFields: () => [CORRECT_BASIC_FEEDBACK, PARTIAL_BASIC_FEEDBACK, WRONG_BASIC_FEEDBACK],
  schems: [
    {
      schema: {
        cId: this.props.id,
        name: '_____1',
        label: this.props.language.HIDE_TABLE,
        currentValue: this.props.model.data.hideTable,
        type: TOGGLE
      },
      fn: this.props.setHideTable.bind(this)
    }, {
      schema: {
        cId: this.props.id,
        name: '___2',
        label: this.props.language.HIDE_NUMBERS,
        currentValue: this.props.model.data.hideNumbers,
        type: TOGGLE
      },
      fn: this.props.setHideNumbers.bind(this)
    }
  ]
};
/**
* Add a new row to the model, only in editor mode
*/
addRow() {
  const currentRowsLength = this.props.model.data.rows.length;
  this.setModelData({
    rows: [
      ...this.props.model.data.rows, {
        text: `Row ${currentRowsLength + 1}`
      }
    ]
  });
}
addColumn() {
  const currentColumnsLength = this.props.model.data.columns.length;
  if (__DEV__) {
    if (this.props.mode !== EDITOR) {
      throw new InteractionError(`Can't add a column when not in editor.`);
    }
    if (MAX_COLUMNS <= currentColumnsLength) {
      throw new InteractionError(`Can't add another column, max is ${MAX_COLUMNS}.`);
    }
  }
  this.props.setModelData({
    columns: [
      ...this.props.model.data.columns,
      `Column ${currentColumnsLength + 1}`
    ]
  });
}
/**
* Change specific row's index by supplying old index and new index.
* Will result change of position for the row.
* Only in editor mode.
*
* @param {number} oldRowIndex      Old row index
* @param {number} newRowIndex      New row index
*/
setRowIndex(oldRowIndex, newRowIndex) {
  if (__DEV__ && this.props.mode !== EDITOR) {
    throw new InteractionError(`Can't use setRowIndex when not in editor.`);
  }

  // Take the row from oldRowIndex and push it to newRowIndex.
  // Other rows in the array should move accordingly
  // Treat rows as immutable data
  const rows = this.props.model.data.rows;
  const newRows = rows.filter((_, rowIndex) => oldRowIndex !== rowIndex);
  newRows.splice(newRowIndex, 0, rows[oldRowIndex]);

  this.props.setModelData({
    ...this.props.model.data,
    rows: newRows
  });
}
/**
* Set the indicator to hide or show table's styles
* @param {boolean} hideTable   Value to set
*/
setHideTable(hideTable) {
  if (__DEV__ && this.props.mode !== EDITOR) {
    throw new InteractionError(`Can't change hideTable when not in editor.`);
  }
  this.props.setModelData({
    ...this.props.model.data,
    hideTable
  });
}
/**
   * Change correctIndex in specific row given
   * @param  {number} rowIndex     Index of the row to change, binded
   * @param  {[type]} correctIndex The newCorrectIndex of the row, binded
   */
setCorrectIndexForRowIndex(rowIndex, correctIndex) {
  if (__DEV__ && this.props.mode !== EDITOR) {
    throw new InteractionError(`Can't change correctIndex when not in editor.`);
  }
  this.props.setModelData({
    ...this.props.model.data,
    rows: this.props.model.data.rows.map((row, currentRowIndex) => {
      if (rowIndex === currentRowIndex) {
        return {
          ...row,
          correctIndex
        };
      } else {
        return row;
      }
    })
  });
}
/**
* Set the indicator to hide or show rows numbering on each row
* @param {boolean} hideNumbers     Value to set
*/
setHideNumbers(hideNumbers) {
  if (__DEV__ && this.props.mode !== EDITOR) {
    throw new InteractionError(`Can't change hideNumbers when not in editor.`);
  }
  this.props.setModelData({
    ...this.props.model.data,
    hideNumbers
  });
}
/**
* Select answer of specific row to the column given
* Also set answer ready to true ()
* Only in player mode.
* @param  {number} rowIndex    Row index to select in player
* @param  {number} columnIndex Column index to select in player
*/
setSelectedIndexForRowIndex(rowIndex, columnIndex) {
  if (__DEV__ && this.props.mode !== PLAYER) {
    throw new InteractionError(`Can't change selectedIndexes when not in player.`);
  }
  let newSelectedIndexes = {};
  if (this.props.state !== undefined && this.props.state.selectedIndexes !== undefined) {
    newSelectedIndexes = this.props.state.selectedIndexes;
  }


  // If selectedIndexes is not defined yet, make it empty object and call answer ready
  // Now that we have an answer
  if (newSelectedIndexes === undefined) {
    newSelectedIndexes = {};
    this.setCheckAnswerReady(true);
  }

  newSelectedIndexes[rowIndex] = columnIndex;
  this.props.setState({ ...this.props.state, selectedIndexes: newSelectedIndexes });
}
/**
* Change all the rows and columns texts at once,
* won't change the model if everything sent is the same
* @param {Object} rowTexts    Array of text for each row, sorted as the model
* @param {Object} columnTexts Array of text for each column, sorted as the model
*/
setRowAndColumnTexts(rowTexts, columnTexts) {
  if (__DEV__ && this.props.mode !== EDITOR) {
    throw new InteractionError(`Can't change columns or rows' text when not in editor.`);
  }
  // If any row or column has a different text in it than the given texts, set the model with new texts
  if (
    columnTexts.find((columnText, columnTextIndex) => columnText !== this.props.model.data.columns[columnTextIndex]) !== undefined ||
    rowTexts.find((rowText, rowTextIndex) => rowText !== this.props.model.data.rows[rowTextIndex].text) !== undefined) {
      // Only modify row texts and column texts
    this.props.setModelData({
      ...this.props.model.data,
      rows: this.props.model.data.rows.map((row, rowIndex) => ({
        ...row,
        text: rowTexts[rowIndex]
      })),
      columns: columnTexts
    });
  }
}
  /**
  * Remove row at given index, only in editor and when MIN_ROWS hasn't been reached
  * @param  {number} rowIndex    Index of the row in the model
  */
  removeRow(rowIndex) {
    const currentRowsLength = this.props.model.data.rows.length;
    if (__DEV__) {
      if (this.props.mode !== EDITOR) {
        throw new InteractionError(`Can't remove a row when not in editor.`);
      }
      if (MIN_ROWS >= currentRowsLength) {
        throw new InteractionError(`Can't remove a row, min is ${MIN_ROWS}.`);
      }
    }
    this.props.setModelData({
      ...this.props.model.data,
      rows: this.props.model.data.rows.filter((_, currentRowIndex) => currentRowIndex !== rowIndex)
    });
  }
  /**
  * Remove column at given index, only in editor and when MIN_COLUMNS hasn't been reached
  * Remove correctIndex from rows that has the removed column selected.
  * Substract 1 from correctIndex taht is higher then the column removed (to keep selection on the specific column)
  * Only in editor mode.
  * @param  {number} columnIndex     Index of the column in the model
  */
  removeColumn(columnIndex) {
    const currentColumnsLength = this.props.model.data.columns.length;
    if (__DEV__) {
      if (this.props.mode !== EDITOR) {
        throw new InteractionError(`Can't remove a column when not in editor.`);
      }
      if (MIN_COLUMNS >= currentColumnsLength) {
        throw new InteractionError(`Can't remove a column, min is ${MIN_COLUMNS}.`);
      }
    }
    this.props.setModelData({
      ...this.props.model.data,
      columns: this.props.model.data.columns.filter((_, currentColumnIndex) => currentColumnIndex !== columnIndex),
      rows: this.props.model.data.rows.map(row => {
        // Delete correctIndex if is the column deleted
        const newRow = row;
        if (row.correctIndex === columnIndex) {
          delete newRow.correctIndex;
        } else if (row.correctIndex > columnIndex) {
          // Subsctract 1 from correctIndex if column to be deleted is lower then correctIndex
          // to keep selection on the column
          newRow.correctIndex--;
        }
        return newRow;
      })
    });
  }
  /**
  * Change row's text at given index.
  * Only in editor mode.
  * @param {number} rowIndex     Index of the row to change it's text
  * @param {string} text         New text for the row
  */
  setRowText(rowIndex, text) {
    if (__DEV__ && this.props.mode !== EDITOR) {
      throw new InteractionError(`Can't change row's text when not in editor.`);
    }
    this.props.setModelData({
      ...this.props.model.data,
      rows: this.props.model.data.rows.map((row, currentRowIndex) => {
        return {
          ...row,
          text: currentRowIndex === rowIndex ? text : row.text
        };
      })
    });
  }
  /**
  * Change column's text at given index.
  * Only in editor mode.
  * @param {number} columnIndex      Index of the column to change it's text
  * @param {string} text             New text for the column
  */
  setColumnText(columnIndex, text) {
    if (__DEV__ && this.props.mode !== EDITOR) {
      throw new InteractionError(`Can't change column's text when not in editor.`);
    }
    this.props.setModelData({
      ...this.props.model.data,
      columns: this.props.model.data.columns.map((column, currentColumnIndex) => {
        if (currentColumnIndex === columnIndex) {
          return text;
        } else {
          return column;
        }
      })
    });
  }

  /**
  * Save only the correct selected Indexes on a different array on the state.
  * Filter out rowIndexes in selectedIndexes that are correct (once row is correct it cannot be changed)
  * Is used when trying again on interaction
  */
  getStateCorrectRowIndexesAndTurnOffCheckMode() {
    if (__DEV__ && this.props.mode !== PLAYER) {
      throw new InteractionError(`Can't change selectedIndexes and turn off checkMode when not in player.`);
    }
    const rows = this.props.model.data.rows;
    const selectedIndexes = this.props.state.selectedIndexes;
    // Create array of row indexes (numbers) who has correct answer from selection
    let correctRowIndexes = Object.keys(selectedIndexes)
    .filter(rowIndex => {
      const selectedIndex = selectedIndexes[rowIndex];
      return rows[rowIndex].correctIndex === selectedIndex;
    })
    .map(key => Number(key)); /* Convert back to numbers because of Object.keys*/

    // Merge with previous correctRowIndexes if defined
    const previousCorrectRowIndexes = this.props.state.correctRowIndexes;
    if (previousCorrectRowIndexes !== undefined) {
      correctRowIndexes = correctRowIndexes.concat(previousCorrectRowIndexes);
    }

    // Remove already correct row indexes from selectedIndexes
    const newSelectedIndexes = Object.keys(selectedIndexes)
    .filter(rowIndexStr => correctRowIndexes.indexOf(Number(rowIndexStr)) === -1)
    .reduce((obj, rowIndex) => ({
      ...obj,
      [rowIndex]: selectedIndexes[rowIndex]
    }), {});

    return {
      selectedIndexes: newSelectedIndexes,
      correctRowIndexes,
      checkMode: false
    };
  }
  // =============================
  checkAnswer() {
    // Return feedback from feedback constants
    const feedback = ChoiceMatrixController.getStateFeedback(
      this.props.model.data.rows,
      this.props.state.selectedIndexes,
      this.props.state.correctRowIndexes
    );
    return {
      answer: feedback,
      state: {
        ...this.props.dataManager.state,
        [this.props.id]: {
          ...this.props.state,
          checkMode: true
        }
      }
    };
  }
  tryAgain() {
    const choiceMatrixState = this.getStateCorrectRowIndexesAndTurnOffCheckMode();
    return {
      state: {
        ...this.props.dataManager.state,
        [this.props.id]: {
          ...this.props.state,
          ...choiceMatrixState
        }
      }
    };
  }
}
