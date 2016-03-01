/**
 * Created by assaf.david on 23/11/2015.
 *
 * Usage examples:
 *      <Loader show=true backgroundColor="rgba(0,0,0,0.8)" bubbleColor="red" />
 *      <Loader mode={Loader.MODE.PROGRESS} progress="10" />
 *
 * Optional properties:
 *      show - initial state of loader (default = false)
 *      mode - indicates if loader should be a progress bar or a loader. Use {Loader.MODE.PROGRESS} for progress bar. (default = LOADER)
 *      progress - optional to set initial value (default - 0)
 *      backgroundColor - background color of loader, in case opacity needed use rgba color (default = #fff)
 *      bubbleColor - color of the three animated bubbles (default = #333333, not aplied for pogress bar)
 *
 * Methods:
 *      showLoader()
 *      hideLoader()
 *
 * Notes:
 * Size & Position - takes full width and height of first parent with a relative position
 *
 *
 */
import Interact, { Element } from 'interact';

const DEFAULT_BACKGROUND_COLOR = "#fff";
const DEFAULT_BUBBLE_COLOR = "#333333";

export default class Loader extends Element {
    static MODE = {
        LOADER: 0,
        PROGRESS: 1
    };
    static getDefaultProps() {
        return {
            show: false,
            mode: Loader.MODE.LOADER,
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            bubbleColor: DEFAULT_BUBBLE_COLOR,
            progress: 0,
			alignToTop: false
        };
    }
    static getRoundedProgress(progress) {
        return Math.round(progress).toString();
    }

    render() {
        return (
            <div class="loader" ref="loader" style={`
                display: ${this.props.show ? 'block' : 'none'};
                background-color: ${this.props.backgroundColor};
                `}>

                {this.props.mode === Loader.MODE.PROGRESS &&
                    <div class="progress-wrapper">
                        <div class="progress-value"><span class="progress-number" ref="progressNumber">{Loader.getRoundedProgress(this.props.progress)}</span>%</div>
                        <progress class="progress-bar" max="100" value={this.props.progress.toString()} ref="progressBar"></progress>
                    </div>
                }

                {this.props.mode === Loader.MODE.LOADER &&
                    <div class={`loading-bubbles ${this.props.alignToTop ? 'align-top-top' : ''}`}>
                        <div class="bubble-container">
                            <div class="bubble" style={`background-color: ${this.props.bubbleColor}`}></div>
                        </div>
                        <div class="bubble-container">
                            <div class="bubble" style={`background-color: ${this.props.bubbleColor}`}></div>
                        </div>
                        <div class="bubble-container">
                            <div class="bubble" style={`background-color: ${this.props.bubbleColor}`}></div>
                        </div>
                    </div>
                }

            </div>
        )
    }

    didPropsUpdate(prevProps) {
        // If only 'show' has been updated => do not reRender
        let reRender = true;
        if (this.props.show !== prevProps.show) {
            reRender = false;
            this.refs.loader.style.display = this.props.show ? 'block' : 'none';
        }

        const progress = this.props.progress;
        const prevProgress = prevProps.progress;
        // If 'progress' was a number and was changed to another number, do not reRender
        if (typeof progress === 'number' && typeof prevProgress === 'number' && progress !== prevProgress) {
            reRender = false;
            this.refs.progressNumber.innerHTML = Loader.getRoundedProgress(progress);
            this.refs.progressBar.value = progress.toString();
        }

        return reRender;
    }

    setShow(newShow) {
        this.setProps({
            show: newShow
        })
    }
    setProgress(newProgress) {
        this.setProps({
            progress: newProgress
        });
    }
}
