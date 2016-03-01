import InteractionBaseController from '../interaction.base.controller';

export default class AudioController extends InteractionBaseController {
  props = {
    ...this.props,
    resetAudioData: this.resetAudioData.bind(this),
    setTitle: this.setTitle.bind(this),
    setCredit: this.setCredit.bind(this),
    setAudio: this.setAudio.bind(this),
    setPlayerMode: this.setPlayerMode.bind(this)
  };

  /**
   * resets all audio data in model
   */
  resetAudioData() {
    this.props.setModelData({
      src: undefined,
      name: undefined,
      title: undefined,
      credit: undefined
    });
  }

  /**
   * Sets the title key in model's data
   * Used in title input blur handler
   * @param newTitle
   */
  setTitle(newTitle) {
    if (newTitle !== this.props.model.data.title) {
      this.props.setModelData({ title: newTitle });
    }
  }

  /**
   * Sets the credit key in model's data
   * Used in credit input blur handler
   * @param newCredit
   */
  setCredit(newCredit) {
    if (newCredit !== this.props.model.data.credit) {
      this.props.setModelData({ credit: newCredit });
    }
  }

  /**
   * Sets a new audio file in the model if it has been changed or set initially
   * Function is used during the upload flow, when the server resolves a hash for the file's location
   * @param hash
   * @param file
   */
  setAudio(hash, file) {
    const data = this.props.model ? this.props.model.data : undefined;
    const name = file.name;
    const oldSrc = data ? data.src : undefined;
    const src = hash;
    // Case src has changed
    if (oldSrc !== src) this.props.setModelData({ src, name });
  }

  /**
   * Sets the player mode in the model if it has been changed
   * @param newPlayerMode
     */
  setPlayerMode(newPlayerMode) {
    if (this.props.model.data.player !== newPlayerMode) {
      this.props.setModelData({ player: newPlayerMode });
    }
  }
}
