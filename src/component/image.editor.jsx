import React, { Component, PropTypes } from 'react';
import $ from '../core/jquery.with.plugins.js';
import Button from './button.jsx';
import Shadowbox from './shadowbox.jsx';
// import { $ } from 'infra';

export default class ImageEditor extends Component {

  static modeTypes = {
    MOVE: 0,
    CROP: 1
  };

  // image manipulation is editing which does not involve cropping
  static hasImageManipulationApplied(state) {
    return state.data.rotate || state.data.scaleX !== 1 || state.data.scaleY !== 1;
  }

  static hasCropApplied(state) {
    return state.data.height;
  }

  static convertCanvasToFile(canvas) {
    const dataURL = canvas.toDataURL('image/jpg', 1);
    const blob = ImageEditor.dataURLtoBlob(dataURL);
    return new File([blob], 'manipulatedImage.jpg', { type: 'image/jpg' });
  }

  static dataURLtoBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = decodeURIComponent(parts[1]);

      return new Blob([raw], { type: contentType });
    } else {
      const parts = dataURL.split(BASE64_MARKER);
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;

      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      mode: ImageEditor.modeTypes.MOVE
    };
  }

  componentDidMount() {
    this.$cropperImage = $(this.refs.cropperImage);
    this.applyEditorInitialState();
  }

  render() {
    const { language, show } = this.props;
    const isMoveMode = this.state.mode === ImageEditor.modeTypes.MOVE;
    // const isCropMode = !isMoveMode;

    return (
      <Shadowbox show={show} onClose={this.props.onClose}>
        <div ref="imageEditor" className="t2k-image-editor" onClick={(e) => e.stopPropagation()}>
          <div className="header">
            <h1>{language.IMAGE_EDITING}</h1>
          </div>
          <hr/>
          <div>
            <div className="toolbar-upper">
              <div className="btn-group">
                <Button title="Reset Cropping" onClick={() => this.handleResetClick()}>
                  <span className="fa fa-refresh"></span>
                </Button>
                <Button title="Upload Image" onClick={() => this.clickRef('uploadInput')}>
                  <span className="fa fa-upload"/>
                </Button>
                <input type="file" ref="uploadInput" accept="image/*" onChange={(e) => this.handleFileUploadChange(e)}/>
              </div>
            </div>
          </div>
          <div className="media-wrapper">
            <div className="content-wrapper">
              <img
                ref="cropperImage"
                className="content fit-viewport"
                src={this.props.src}
                title={this.props.title}
                alt={this.props.title}
              />
            </div>
          </div>
          <div>
            <div className="toolbar-bottom">
              <div className="btn-group">
                <Button title="Zoom Out" onClick={() => this.handleZoomOutClick()}>
                  <span className="fa fa-search-minus"/>
                </Button>
                <Button title="Zoom In" onClick={() => this.handleZoomInClick()}>
                  <span className="fa fa-search-plus"/>
                </Button>
              </div>
              <div className="btn-group" onChange={this.handleModeChange.bind(this)}>
                <Button className={isMoveMode ? 'pressed' : ''} title="Move Mode" onClick={() => this.clickRef('move')}>
                  <span className="fa fa-arrows"/>
                  <input type="radio" ref="move" value="move" name="cropperMode"/>
                </Button>
                <Button className={!isMoveMode ? 'pressed' : ''} title="Crope Mode" onClick={() => this.clickRef('crop')}>
                  <span className="fa fa-crop"/>
                  <input type="radio" ref="crop" value="crop" name="cropperMode"/>
                </Button>
              </div>
              <div className="btn-group" onChange={this.handleAspectRatioChange.bind(this)}>
                <Button disabled={isMoveMode} onClick={() => this.clickRef('ratio1')} title="16:9 Aspect Ratio">
                  <span>16:9</span>
                  <input type="radio" ref="ratio1" name="cropperAspectRatio" value="1.777"/>
                </Button>
                <Button disabled={isMoveMode} onClick={() => this.clickRef('ratio2')} title="4:3 Aspect Ratio">
                  <span>4:3</span>
                  <input type="radio" ref="ratio2" name="cropperAspectRatio" value="1.333"/>
                </Button>
                <Button disabled={isMoveMode} onClick={() => this.clickRef('ratio3')} title="1:1 Aspect Ratio">
                  <span>1:1</span>
                  <input type="radio" ref="ratio3" name="cropperAspectRatio" value="1"/>
                </Button>
                <Button disabled={isMoveMode} onClick={() => this.clickRef('ratio4')} title="2:3 Aspect Ratio">
                  <span>2:3</span>
                  <input type="radio" ref="ratio4" name="cropperAspectRatio" value="0.666"/>
                </Button>
                <Button disabled={isMoveMode} onClick={() => this.clickRef('ratio5')} title="Free Aspect Ratio">
                  <span>{language.ASPECT_FREE}</span>
                  <input type="radio" ref="ratio5" name="cropperAspectRatio" value="NaN"/>
                </Button>
              </div>
              <div className="btn-group">
                <Button title="Rotate Left" onClick={this.handleRotateLeftClick.bind(this)}>
                  <span className="fa fa-rotate-left"/>
                </Button>
                <Button title="Rotate Right" onClick={this.handleRotateRightClick.bind(this)}>
                  <span className="fa fa-rotate-right"/>
                </Button>
              </div>
              <div className="btn-group">
                <Button title="Flip Horizonal" onClick={this.handleFlipHorizonalClick.bind(this)}>
                  <span className="fa fa-arrows-h"/>
                </Button>
                <Button title="Flip Vertical" onClick={this.handleFlipVerticalClick.bind(this)}>
                  <span className="fa fa-arrows-v"/>
                </Button>
              </div>
            </div>
          </div>
          <br/>
          <div>
            <div className="pull-right">
              <div className="btn-group">
                <Button title="Save" onClick={() => this.handleOkClick()}>
                  {language.OK}
                </Button>
             </div>
             <div className="btn-group">
                <Button title="Cancel" onClick={() => this.handleCancelClick()}>
                  {language.CANCEL}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Shadowbox>
    );
  }

  // *************************************************
  //  START OF COMPONENT'S EVENTS
  // *************************************************

  clickRef(ref) {
    this.refs[ref].click();
  }

  handleResetClick() {
    this.applyEditorReset();
  }

  handleFileUploadChange(e) {
    // if a new file was selected, add the file to the DOM without an upload to the server, in case the cropping session will be canceled, and for a faster UI feel

    if (e.target.files && e.target.files[0]) {
      // saving the file instance for later use in the upload stage (after OK)
      this.$cropperImage.newSrcFile = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (readerOnloadArgs) => {
        // saving the old src to enable rollback
        this.$cropperImage.oldSrc = this.$cropperImage.attr('src');

        this.$cropperImage.cropper('destroy');
        this.$cropperImage.attr('src', readerOnloadArgs.target.result);
        this.$cropperImage.load(() => {
          this.applyEditorReset();
        });
      };
    }
  }

  handleZoomOutClick() {
    this.$cropperImage.cropper('zoom', -0.1);
  }

  handleZoomInClick() {
    this.$cropperImage.cropper('zoom', 0.1);
  }

  handleModeChange(e) {
    switch (e.target.value) {

      case 'crop':

        this.$cropperImage.cropper('setDragMode', 'crop');
        this.setState({ mode: ImageEditor.modeTypes.CROP });

        break;

      case 'move':

        this.$cropperImage.cropper('setDragMode', 'move');
        this.$cropperImage.cropper('clear');
        this.setState({ mode: ImageEditor.modeTypes.MOVE });

        break;
    }
  }

  handleAspectRatioChange(e) {
    this.$cropperImage.cropper('setAspectRatio', e.target.value);
  }

  handleRotateLeftClick() {
    this.$cropperImage.cropper('rotate', -90);
  }

  handleRotateRightClick() {
    this.$cropperImage.cropper('rotate', 90);
  }

  handleFlipHorizonalClick() {
    const currentValue = this.$cropperImage.cropper('getData').scaleX;
    this.$cropperImage.cropper('scaleX', -currentValue);
  }

  handleFlipVerticalClick() {
    const currentValue = this.$cropperImage.cropper('getData').scaleY;
    this.$cropperImage.cropper('scaleY', -currentValue);
  }

  handleCancelClick() {
    this.props.onClose();

    if (!this.$cropperImage.oldSrc) {
      // if no new image was uploaded, return to the original state
      this.applyEditorState(this.sessionInitialState);
    } else {
      // if a new image was uploaded, return the original image and its state
      this.$cropperImage.attr('src', this.$cropperImage.oldSrc);
      this.$cropperImage.cropper('destroy');
      delete this.$cropperImage.oldSrc;
      delete this.$cropperImage.newSrcFile;

      this.applyEditorInitialState();
    }
  }

  handleOkClick() {
    this.props.onClose();
    this.getEditingSessionOutput().then((results) => {
      const newImage = results[0];
      const editedImage = results[1];
      this.props.onEditingFinished(newImage, editedImage);
    });
  }

  // *************************************************
  //  END OF COMPONENT'S EVENTS
  // *************************************************

  // *************************************************
  //  START OF COMPONENT'S FUNCTIONS
  // *************************************************

  applyEditorInitialState() {
    this.$cropperImage.cropper({ autoCrop: false, autoCropArea: 0 });

    this.$cropperImage.one('built.cropper', () => {
      if (this.props.editedImage && this.props.editedImage.editorState) {
        this.applyEditorState(this.props.editedImage.editorState);
      } else {
        this.$cropperImage.cropper('setDragMode', 'move');
      }
    });
  }

  applyEditorState(state) {
    if (ImageEditor.hasCropApplied(state)) {
      // if the state transit from default state to a crop state, restart the cropper on crop mode
      if (!ImageEditor.hasCropApplied(this.getEditorState())) {
        this.$cropperImage.cropper('destroy');
        this.$cropperImage.cropper();
        this.setState({ mode: ImageEditor.modeTypes.CROP });
        this.$cropperImage.on('built.cropper', this.applyCropState.bind(this, state));
      } else {
        this.applyCropState(state);
      }
    } else if (ImageEditor.hasImageManipulationApplied(state)) {
      this.$cropperImage.cropper('reset');
      this.$cropperImage.cropper('rotate', state.data.rotate);
      this.$cropperImage.cropper('scale', state.data.scaleX, state.data.scaleY);
    } else {
      this.applyEditorReset();
    }
  }

  applyCropState(state) {
    this.$cropperImage.cropper('setData', state.data);
    this.$cropperImage.cropper('setCropBoxData', state.cropBoxData);
    this.$cropperImage.cropper('setCanvasData', state.canvasData);
  }

  applyEditorReset() {
    this.$cropperImage.cropper('reset');
    this.$cropperImage.cropper('clear');
    this.$cropperImage.cropper('setDragMode', 'move');
    this.setState({ mode: ImageEditor.modeTypes.MOVE });
  }

  getEditorState() {
    return {
      data: this.$cropperImage.cropper('getData'),
      cropBoxData: this.$cropperImage.cropper('getCropBoxData'),
      canvasData: this.$cropperImage.cropper('getCanvasData')
    };
  }

  getEditingSessionOutput() {
    return new Promise((resolve) => {
      const editorState = this.getEditorState();
      const croppedCanvas = this.$cropperImage.cropper('getCroppedCanvas');
      let newImage;
      let editedImage;

      // if a new image was selected, upload it to the server as the new src
      if (this.$cropperImage.newSrcFile) {
        newImage = {
          file: this.$cropperImage.newSrcFile
        };
      }

      if (JSON.stringify(editorState) === JSON.stringify(this.sessionInitialState)) {
        resolve([newImage, undefined]);
      } else if (croppedCanvas instanceof HTMLElement) {
        if (editorState.data.width && editorState.data.height) {
          editedImage = {
            file: ImageEditor.convertCanvasToFile(croppedCanvas),
            editorState
          };

          resolve([newImage, editedImage]);
        }
      } else if (ImageEditor.hasImageManipulationApplied(editorState)) {
        this.createImageManipulationCanvas(editorState.data.rotate, editorState.data.scaleX, editorState.data.scaleY)
          .then((canvas) => {
            editedImage = {
              file: ImageEditor.convertCanvasToFile(canvas),
              editorState
            };

            resolve([newImage, editedImage]);
          });
      } else {
        resolve([newImage, null]);
      }
    });
  }


  createImageManipulationCanvas(rotationDegrees, scaleX, scaleY) {
    return new Promise((resolve) => {
      const originalImage = $('div.cropper-canvas img')[0];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = originalImage.src;

      image.onload = () => {
        if (rotationDegrees === 0 || Math.abs(rotationDegrees) === 180) {
          canvas.width = image.width;
          canvas.height = image.height;
        } else {
          canvas.width = image.height;
          canvas.height = image.width;
        }

        if (rotationDegrees === 0 || Math.abs(rotationDegrees) === 180) {
          ctx.translate(image.width / 2, image.height / 2);
        } else {
          ctx.translate(image.height / 2, image.width / 2);
        }

        ctx.rotate(rotationDegrees * Math.PI / 180);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        resolve(canvas);
      };
    });
  }

  // *************************************************
  //  END OF COMPONENT'S FUNCTIONS
  // *************************************************

}

if (__DEV__) {
  ImageEditor.propTypes = {
    language: PropTypes.object.isRequired,
    title: PropTypes.string,
    src: PropTypes.string.isRequired,
    show: PropTypes.bool,
    editedImage: PropTypes.object,
    onEditingFinished: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };
}
