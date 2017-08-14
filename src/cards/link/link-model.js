/*
 * Generating Samples:

  LinkModel = layer.Client.getCardModelClass('LinkModel')

  model = new LinkModel({
    url: "http://www.cnn.com/2017/07/07/us/sc-prison-escape-drone/index.html",
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());

 model = new LinkModel({
    url: "http://www.cnn.com/2017/07/07/us/sc-prison-escape-drone/index.html",
    title: "South Carolina inmate used drone, makeshift dummy to escape prison",
    imageUrl: "http://i2.cdn.cnn.com/cnnnext/dam/assets/170707132615-sc-prison-escape-super-tease.jpg",
    description: "A South Carolina prisoner broke out of prison using a cell phone, a makeshift dummy, a drone and wire cutters, the South Carolina Department of Corrections said"
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());


  model = new LinkModel({
    url: "https://github.com/layerhq/layer-websdk",
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());

  model = new LinkModel({
    url: "https://github.com/layerhq/layer-websdk",
    title: "Layer Web SDK"
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());

  model = new LinkModel({
    url: "https://github.com/layerhq/layer-websdk",
    title: "Layer Web SDK",
    author: "Michael Kantor"
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());

  model = new LinkModel({
    url: "https://github.com/layerhq/layer-websdk",
    title: "Layer Web SDK",
    author: "Michael Kantor",
    description: "SDKs for accessing layer's services from web, mobile web and WebViews",
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());

  model = new LinkModel({
    url: "https://github.com/layerhq/layer-websdk",
    title: "Layer Web SDK",
    author: "Michael Kantor",
    description: "The Layer Web SDK is a JavaScript library for adding chat services to your web application. For detailed documentation, tutorials and guides please visit our Web SDK documentation. Supported Browsers: IE 11 and Edge, Safari 7, Chrome 42 and up, Firefox 40 and up.  Older versions of Chrome and Firefox will likely work.",
  });
  model.generateMessage($("layer-conversation-view").conversation, message => message.send());
 */
import { xhr } from 'layer-websdk';
import CardModel from 'layer-websdk/lib/models/card-model';
import { Client, MessagePart, Util }  from 'layer-websdk';

const TitleRegEx = new RegExp(/<meta [^>]*property\s*=\s*['"]og:title['"].*?\/>/);
const DescriptionRegEx = new RegExp(/<meta [^>]*property\s*=\s*['"]og:description['"].*?\/>/);
const AuthorRegEx = new RegExp(/<meta [^>]*property\s*=\s*['"]og:author['"].*?\/>/);
const ImageRegEx = new RegExp(/<meta [^>]*property\s*=\s*['"]og:image['"].*?\/>/);

class LinkModel extends CardModel {
  _generateParts(callback) {
    const body = this._initBodyWithMetadata(['imageUrl', 'author', 'title', 'description', 'url', 'action']);

    this.part = new layer.MessagePart({
      mimeType: this.constructor.MIMEType,
      body: JSON.stringify(body),
    });
    callback([this.part]);
  }

  _parseMessage() {
    super._parseMessage();

    const payload = JSON.parse(this.part.body);
    Object.keys(payload).forEach((propertyName) => {
      this[Util.camelCase(propertyName)] = payload[propertyName];
    });

    // if (!this.title && !this.description) {
    //   this._fetchArticle();
    // }
  }

  getFooter() { return this.author; }
  getDescription() { return this.description; }

  // Disable code in layer-card-view that skips the Card Container
  hasNoContainerData() {
    return false;
  }

  // TODO: This should have a callback so that a message sender can send the message once this has
  // finished populating
  gatherMetadata(callback) {
    layer.xhr({
      method: "GET",
      url: this.url,
    }, (result) => {
      if (result.success) {
        this.html = result.data;
        if (!this.title) this.title = this._getArticleMeta(TitleRegEx);
        if (!this.description) this.description = this._getArticleMeta(DescriptionRegEx);
        if (!this.imageUrl) this.imageUrl = this._getArticleMeta(ImageRegEx);
        if (!this.author) this.author = this._getArticleMeta(AuthorRegEx);
        this.trigger('change');
      }
      callback(result.success, result);
    });
  }

  _getArticleMeta(regex) {
    const matches = this.html.match(regex);
    if (matches) {
      const metatag = matches[0];
      if (metatag) {
        let contentMatches = metatag.match(/content\s*=\s*"(.*?[^/])"/);
        if (!contentMatches) contentMatches = metatag.match(/content\s*=\s*'(.*?[^/])'/);
        if (contentMatches) return contentMatches[1];
      }
    }
    return '';
  }
}


LinkModel.prototype.imageUrl = '';
LinkModel.prototype.author = '';
LinkModel.prototype.title = '';
LinkModel.prototype.description = '';
LinkModel.prototype.url = '';
LinkModel.prototype.html = '';

LinkModel.defaultAction = 'open-url';
LinkModel.cardRenderer = 'layer-link-card';

LinkModel.MIMEType = 'application/vnd.layer.card.link+json';

MessagePart.TextualMimeTypes.push(LinkModel.MIMEType);

// Register the Card Model Class with the Client
Client.registerCardModelClass(LinkModel, "LinkModel");

module.exports = LinkModel;
