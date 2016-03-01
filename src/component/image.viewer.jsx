import React, { Component, PropTypes } from 'react';
import $ from '../core/jquery.with.plugins.js';
import Shadowbox from './shadowbox.jsx';

export default class ImageViewer extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Activate pan/zoom plugin on shadow box media
    $(this.refs.image).panzoom({
      contain: 'invert', // .content will be contained inside contentWrapper
      startTransform: 'none', // Always reset transform position
      cursor: '' // this will disable inline style css cursor
    });
  }

  render() {
    return (
      <Shadowbox show onClose={this.handleModalClick.bind(this)}>
        <div className="t2k-image-viewer" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="pull-right close icon-delete_close" onClick={this.handleCloseButtonClick.bind(this)}></div>
          </div>
          <img
            ref="image"
            className="content fit-viewport"
            src={this.props.src}
            title={this.props.title}
            alt={this.props.title}
          />
          <div className="footer">
            { this.props.showTitle &&
            <div className="title">{this.props.title}</div>
            }
            { this.props.showCredit &&
            <div className="credit">{this.props.credit}</div>
            }
          </div>
        </div>
      </Shadowbox>
    );
  }

  handleCloseButtonClick() {
    this.props.onClose();
  }

  handleModalClick() {
    this.props.onClose();
  }
}

if (__DEV__) {
  ImageViewer.propTypes = {
    title: PropTypes.string,
    showTitle: PropTypes.bool.isRequired,
    credit: PropTypes.string,
    showCredit: PropTypes.bool.isRequired,
    src: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  };
}
