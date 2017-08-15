/* m = $("layer-conversation-view").conversation.createMessage({parts: [
  {
    mimeType: "application/vnd.layer.card.location+json; role=root",
    body: '{"latitude": 37.7734858, "longitude": -122.3916087, "title": "Réveille Coffee Co.", "description": "Good coffee, but pricey, and when you hear people say the name, you know that they just reviled the place."}'
  }]}).send();
  */

/**
 * You must set your Google Maps API key in `window.googleMapsAPIKey`
 *
 * @class ???
 * @extends layerUI.components.Component
 */
import { registerComponent } from '../../components/component';
import CardMixin from '../card-mixin';
import CardPrimitiveMixin from '../card-primitive-mixin';
import { addActionHandler } from '../../handlers/message/layer-card-view';

registerComponent('layer-location-card', {
  mixins: [CardMixin, CardPrimitiveMixin],
  template: '<img layer-id="img" />',
  style: `
  layer-card-view.layer-location-card {
    cursor: pointer;
  }
  .layer-location-card-address-only {
    display: none;
  }
  `,
  properties: {
    mapWidth: {
      value: 288,
    },
    mapHeight: {
      value: 300,
    },
    hideMap: {
      value: false,
      set(value) {
        this.toggleClass('layer-location-card-address-only', value);
        if (this.container) this.setupContainerClasses(this.container);
      },
    },
  },
  methods: {
    /**
     * Can be rendered in a concise format required for Conversation Last Message and Layer Notifier
     *
     * @method
     */
    canRenderConcise(message) {
      return false;
    },


    onAfterCreate() {
      if (!this.hideMap) this._updateImageSrc();
    },

    _updateImageSrc() {
      const marker = this.model.latitude ? this.model.latitude + ',' + this.model.longitude : escape(this.model.street1 + (this.model.street2 ? ' ' + this.model.street2 : '') + ` ${this.model.city} ${this.model.administrativeArea}, ${this.model.postalCode} ${this.model.country}`);

      this.nodes.img.src = `${location.protocol}//maps.googleapis.com/maps/api/staticmap?size=${this.mapWidth}x${this.mapHeight}&language=${navigator.language}&key=${window.googleMapsAPIKey}&zoom=${this.model.zoom}&markers=${marker}`;
    },

    onRender() {
      this.onRerender();
    },

    /**
     *
     * @method
     */
    onRerender() {
      this._updateImageSrc();
    },

    setupContainerClasses(container) {
      container.classList[this.hideMap ? 'add' : 'remove']('layer-arrow-next-container');
    },
  },
});

addActionHandler('open-map', function openMapHandler(customData) {
  let url;
  if (this.model.street1) {
    url = 'http://www.google.com/maps/?q=' +
      escape(this.model.street1 + (this.model.street2 ? ' ' + this.model.street2 : '') + ` ${this.model.city} ${this.model.state}, ${this.model.postalCode} ${this.model.country}`);
  } else if (this.model.latitude) {
    url = `https://www.google.com/maps/search/?api=1&query=${this.model.latitude},${this.model.longitude}&zoom=${this.model.zoom}`;
  }
  if (url) window.open(url);
});
