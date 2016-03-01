import { playerTypes } from './index.js';

export default function getDefaultModel() {
  return {
    data: {
      showTitle: true,
      showCredit: true,
      player: playerTypes.HTML_PLAYER
    }
  };
}
