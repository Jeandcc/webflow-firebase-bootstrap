import { MDCLinearProgress } from '@material/linear-progress';
import './style.scss';

class ProgressIndicator {
  private progressBar?: MDCLinearProgress;

  constructor() {
    const indicatorHTML = $(`
    <div class="load-indicator__wrapper">
      <div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
        <div class="mdc-linear-progress__buffer">
          <div class="mdc-linear-progress__buffer-bar"></div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>
      <style>
        .mdc-linear-progress {
          position: fixed;
          top: 0;
          left:0;
          z-index:1001;
        }
        .mdc-linear-progress__bar-inner {
          border-color: #cc0000;
        }
      </style>
    </div>`);

    $(document.body).append(indicatorHTML);

    this.progressBar = new MDCLinearProgress(
      indicatorHTML.find('.mdc-linear-progress')[0],
    );

    this.progressBar.close();
  }

  open() {
    this.progressBar?.open();
  }

  close() {
    this.progressBar?.close();
  }
}

export const loadIndicator = new ProgressIndicator();
export default loadIndicator;
