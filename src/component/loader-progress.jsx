import React, { Component, PropTypes } from 'react';
import Button from './button.jsx';

/**
 * Progress Loader - handles multiple processes and generates one progress by slowest process
 * All params are optional:
 * @param {number} filesUploadingLength - the amount of processes. Default = 1.
 * @param {number} uploadingMaxPercent - progress bar percent when files finish upload
 * @param {number} fetchingMaxPercent - progress bar percent when files are fetched
 * @param {number} fetchingTime - interval for fetching animation, will end if state has changed to download
 * @param {number} downloadingTime - interval for downloading animation
 * @param  {object) text for each state:
 *      {string} UPLOADING
 *      {string} FETCHING
 *      {string} DOWNLOADING
 */
export default class LoaderProgress extends Component {

  static phaseTypes = {
    UPLOADING: 1,
    FETCHING: 2,
    DOWNLOADING: 4
  };

  static defaultProps = {
    filesUploadingLength: 1,
    uploadingMaxPercent: 80,
    fetchingMaxPercent: 90,
    fetchingTime: 2500, // milliseconds
    downloadingTime: 2500, // milliseconds
    text: {
      UPLOADING: '',
      FETCHING: '',
      DOWNLOADING: ''
    }
  };

  constructor(props) {
    super(props);
    const currentPhase = props.phase ? props.phase[0] : LoaderProgress.phaseTypes.UPLOADING;
    const filesUploadingLength = props.filesUploadingLength || 1;
    const phase = [];
    const progress = [];
    for (let i = 0; i < filesUploadingLength; i++) {
      progress[i] = 0;
      phase[i] = currentPhase;
    }

    this.state = {
      show: props.show || true,
      progress,
      phase
    };
    this._timeoutIds = [];
  }

  componentDidUpdate() {
    this.managePhase(this.state, this.props);
  }

  componentWillUnmount() {
    this._timeoutIds.forEach(timeoutId => {clearTimeout(timeoutId);});
  }

  render() {
    const style = {
      display: this.state.show ? 'block' : 'none'
    };
    const mainPhase = Math.min(...this.state.phase);
    let text;

    switch (mainPhase) {
      case LoaderProgress.phaseTypes.UPLOADING:
        text = this.props.text.UPLOADING;
        break;
      case LoaderProgress.phaseTypes.FETCHING:
        text = this.props.text.FETCHING;
        break;
      case LoaderProgress.phaseTypes.DOWNLOADING:
        text = this.props.text.DOWNLOADING;
        break;
    }

    return (
      <div className="t2k-loader-progress" style={style}>
        <div className="progress-wrapper">
          <div className="text-and-bar-wrapper">
            <div className="progress-text">
              <div className="phase">{text}</div>
              <div className="progress-value">
                <span className="progress-number" ref="progressNumber">{this.getModifiedProgress(this.state.phase, this.state.progress, this.props.uploadingMaxPercent)}</span>%
              </div>
            </div>
            <progress className="progress-bar" max="100"
              value={this.getModifiedProgress(this.state.phase, this.state.progress, this.props.uploadingMaxPercent)}
              ref="progressBar"
            />
          </div>
          <div className="uploading-buttons">
            { this.props.onUploadCanceled &&
            <Button onClick={this.props.onUploadCanceled.bind(this)}>CANCEL</Button>
            }
            { this.props.onUploadApproved &&
            <Button disabled onClick={this.props.onUploadApproved.bind(this)}>OK</Button>
            }
          </div>
        </div>
      </div>
    );
  }

  managePhase(state, props) {
    const mainPhase = Math.min(...state.phase);

    switch (mainPhase) {
      case LoaderProgress.phaseTypes.UPLOADING:
        // upon upload finish => change phase to fetching
        let phaseChanged = false;
        const newState = state;
        state.progress.forEach((el, index) => {
          if (el >= 100 && state.phase[index] === LoaderProgress.phaseTypes.UPLOADING) {
            newState.phase[index] = LoaderProgress.phaseTypes.FETCHING;
            newState.progress[index] = props.uploadingMaxPercent;
            phaseChanged = true;
          }
        });
        if (phaseChanged) this._changeState(newState.phase, newState.progress);
        break;
      case LoaderProgress.phaseTypes.FETCHING:
        this.manageProgressChange(props.uploadingMaxPercent, props.fetchingMaxPercent, props.fetchingTime, state.progress);
        break;
      case LoaderProgress.phaseTypes.DOWNLOADING:
        this.manageProgressChange(props.fetchingMaxPercent, 100, props.downloadingTime, state.progress);
        break;
    }
  }

  _changeState(phase, progress) {
    this.setState({ phase, progress });
  }

  // manages the automatic progress of the fetching & downloading phases
  // since we are after the uploading phase, we need only one progress variable to track which will be index 0
  manageProgressChange(prevPhaseMax, currentPhaseMax, currentPhaseTime, progress) {
    const mainProgress = progress[0];
    // in case phase has been modified from parent and progress is still too low => higher the progress to current phase's minimum
    if (mainProgress < prevPhaseMax) {
      const newProgress = progress;
      newProgress.splice(0, 1, prevPhaseMax);
      this.setState({ progress: newProgress });
    } else {
      // when progress is in range of current phase, higher it by intervals
      if (mainProgress < currentPhaseMax) {
        const delay = currentPhaseTime / 10;
        const change = (currentPhaseMax - prevPhaseMax) / 10;
        const newProgress = progress;
        newProgress[0] = Math.min(mainProgress + change, currentPhaseMax);
        const timeoutId = setTimeout(() => {
          // remove the timeoutId so componentWillUnmount will not try to cancel it
          this.removeTimeoutId(timeoutId);
          this.setState({ progress: newProgress });
        }, delay);
        // register the timeout ID for clearing the timeout when component will unmount
        this._timeoutIds.push(timeoutId);
      }
    }
  }

  /**
   * removes timeoutId from this._timeoutIds array
   * @param timeoutId
   */
  removeTimeoutId(timeoutId) {
    const index = this._timeoutIds.findIndex(el => el === timeoutId);
    if (index > -1) this._timeoutIds.splice(index, 1);
  }

  getModifiedProgress(phase, progress, uploadingMaxPercent) {
    const mainPhase = Math.min(...phase);
    const mainProgress = Math.min(...progress);
    const modifiedPercent = mainPhase === LoaderProgress.phaseTypes.UPLOADING ? mainProgress * uploadingMaxPercent / 100 : progress[0];
    return Math.round(modifiedPercent).toString();
  }

  // called from parent
  changeProgress(progress, index = 0) {
    if (index > this.state.progress.length - 1) return;
    const newProgress = this.state.progress;
    newProgress[index] = progress;
    this._changeState(this.state.phase, newProgress);
  }
}
if (__DEV__) {
  LoaderProgress.propTypes = {
    filesUploadingLength: PropTypes.number,
    uploadingMaxPercent: PropTypes.number,
    fetchingMaxPercent: PropTypes.number,
    fetchingTime: PropTypes.number,
    downloadingTime: PropTypes.number,
    show: PropTypes.bool,
    phase: PropTypes.arrayOf(React.PropTypes.number),
    onUploadCanceled: PropTypes.func,
    onUploadApproved: PropTypes.func,
    text: PropTypes.object
  };
}
