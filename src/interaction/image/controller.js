import InteractionBaseController from '../interaction.base.controller';

export default class ImageController extends InteractionBaseController {

  props = {
    ...this.props,
    setModelProperty: this.setModelProperty.bind(this)
  };

  setModelProperty(property, value) {
    if (this.props.model.data[property] !== value) {
      this.props.setModelData({ ...this.props.model.data, [property]: value });
    }
  }
}
