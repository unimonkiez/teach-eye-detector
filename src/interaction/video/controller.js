import InteractionBaseController from '../interaction.base.controller';
import { formatTypes } from './index.js';

export default class VideoController extends InteractionBaseController {
  /**
   * Checks if link is a valid Youtube or Vimeo link
   * @param {string} link     link received from user for a Youtube/Vimeo video
   * @returns {object}
   */
  static generateEmbeddedId(link) {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = link.match(regExp);

    if (match && match[2].length === 11) {
      return { format: formatTypes.YOUTUBE, id: match[2] };
    } else {
      regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
      match = link.match(regExp);
      if (match && match[3]) {
        return { format: formatTypes.VIMEO, id: match[3] };
      } else {
        throw new Error('not a valid link');
      }
    }
  }

  props = {
    ...this.props,
    setTitle: this.setTitle.bind(this),
    setCredit: this.setCredit.bind(this),
    setVideo: this.setVideo.bind(this),
    resetVideoData: this.resetVideoData.bind(this),
    generateEmbeddedLink: this.generateEmbeddedLink.bind(this)
  };

  /**
   * Sets the title key in model's data
   * Used in title input blur handler
   * @param title
   */
  setTitle(title) {
    if (title !== this.props.model.data.title) {
      this.props.setModelData({ title });
    }
  }

  /**
   * Sets the credit key in model's data
   * Used in credit input blur handler
   * @param credit
   */
  setCredit(credit) {
    if (credit !== this.props.model.data.credit) {
      this.props.setModelData({ credit });
    }
  }

  /**
   * alters the model by the new file data and change state to EDIT
   * @param {string} hash     the path to the file in the server
   * @param {object} file
   */
  setVideo(hash, file) {
    const format = formatTypes.HTML5;
    const data = this.props.model ? this.props.model.data : undefined;
    const name = file.name;
    const oldSrc = data ? data.src : undefined;
    const src = hash;
    // Case src has changed
    if (oldSrc !== src) this.props.setModelData({ src, format, name });
  }

  /**
   * resets all video data in model
   */
  resetVideoData() {
    this.props.setModelData({
      src: undefined,
      format: undefined,
      name: undefined,
      title: undefined,
      credit: undefined
    });
  }

  /**
   * Generates a Youtube or Vimeo link and sets it's data to the model
   * if the link isn't valid it throws an error
   * Used by the handleNewSrc function
   * @param {string} link
   */
  generateEmbeddedLink(link) {
    try {
      const linkData = VideoController.generateEmbeddedId(link);
      let src;
      switch (linkData.format) {
        case formatTypes.YOUTUBE:
          src = '//www.youtube.com/embed/' + linkData.id + '?wmode=opaque';
          this.props.setModelData({
            src,
            format: linkData.format,
            name: link
          });
          break;
        case formatTypes.VIMEO:
          src = '//player.vimeo.com/video/' + linkData.id;
          this.props.setModelData({
            src,
            format: linkData.format,
            name: link
          });
          break;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
