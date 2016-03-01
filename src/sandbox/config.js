import Task from '../task/index.js';
const isSaveForRefresh = false;

const generalOptions = {
  languages: ['en_us', 'fr_fr', 'he_il'],
  widths: ['100%', '500px', '600px', '700px', '800px'],
  initialTypes: Object.keys(Task.TYPE).filter(key => key !== 'MC').map(key => Task.TYPE[key]),
  themes: ['ttk-theme-default', 'ttk-theme-corporate', 'ttk-theme-dl', 'ttk-theme-k-6']
};
generalOptions.initialTypes.unshift(Task.TYPE.MC);

let sandboxSettings = {
  autoSave: false,
  mode: Task.MODE.EDITOR,
  theme: generalOptions.themes[0], // default
  language: generalOptions.languages[0], // defualt EN
  width: generalOptions.widths[0], // full
  initialType: generalOptions.initialTypes[0], // MC,
  displayQuestion: false,
  displaySettings: true,
  displayProgress: true
};
let model = Task.getDefaultModel(sandboxSettings.initialType);
let state;

// If hash is set, take model and sandboxSettings from window's hash
if (isSaveForRefresh) {
  const hashObject = JSON.parse(window.location.hash.substr(1));
  sandboxSettings = hashObject.sandboxSettings;
  model = hashObject.model;
  state = hashObject.state;
}

const handleChange = (newConfig) => {
  if (newConfig.isSaveForRefresh) {
    window.location.hash = JSON.stringify({
      sandboxSettings: newConfig.sandboxSettings,
      model: newConfig.model,
      state: newConfig.state
    });
  }
};

const config = {
  generalOptions,
  model,
  state,
  isSaveForRefresh,
  setIsSaveForRefresh: newIsSaveForRefresh => {
    config.isSaveForRefresh = newIsSaveForRefresh;
    handleChange(config);
  },
  setModel: newModel => {
    config.model = newModel;
    handleChange(config);
  },
  setState: newState => {
    config.state = newState;
    handleChange(config);
  },
  sandboxSettings,
  setSandboxSettings: newSandboxSettings => {
    config.sandboxSettings = newSandboxSettings;
    handleChange(config);
  }
};

export default config;
