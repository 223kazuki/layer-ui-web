/**
 *
 * @class
 * @extends layerUI.components.Component
 */
import { registerComponent } from '../../component';

registerComponent('layer-action-button', {
  template: '<button class="layer-button" layer-id="button"></button>',
  style: `layer-action-button {
    display: flex;
    flex-direction: column;
    align-content: stretch;
  }
  layer-action-button button {
    border-radius: 0px;
    border-width: 0px;
    cursor: pointer;
  }
  .layer-button-content > * {
    max-width: 100%;
    width: 100%;
  }
  `,
  // Note that there is also a message property managed by the MessageHandler mixin
  properties: {
    text: {
      set(value) {
        this.nodes.button.innerHTML = value;
      },
    },
    tooltip: {
      set(value) {
        this.nodes.title = value;
      },
    },
    event: {},
    data: {},
    disabled: {
      type: Boolean,
      set(value) {
        this.nodes.button.disabled = value;
      }
    },
  },
  methods: {
    /**
     * @method
     */
    onCreate() {
      this.addEventListener('click', this._onClick.bind(this));
    },

    /**
     *
     * @method
     */
    onRender() {

    },


    _onClick(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      let cardView = this;
      while (cardView.tagName !== 'LAYER-CARD-VIEW' && cardView.parentComponent) {
        cardView = cardView.parentComponent;
      }
      if (cardView) cardView.runAction({ event: this.event, data: this.data });
    },
  },
});