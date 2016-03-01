import InteractionBaseController from '../interaction.base.controller';

export default class TextController extends InteractionBaseController {
  props = {
    ...this.props,
    setHtml: this.setHtml.bind(this)
  };
  setHtml(html) {
    this.setModelData({
      html
    });
  }
}
