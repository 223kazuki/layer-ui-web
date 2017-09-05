/**
 * TODO: Location Model should be able to use one of these
 */

import { Client, MessagePart, CardModel, Util }  from '@layerhq/layer-websdk';

class OrganizationModel extends CardModel {

  _parseMessage(payload) {
    super._parseMessage(payload);

    this.addressModels = this.getModelsFromPart('address');
    this.contactModels = this.getModelsFromPart('contact');
  }
}

OrganizationModel.prototype.addressModels = null;
OrganizationModel.prototype.contactModels = null;
OrganizationModel.prototype.type = '';

OrganizationModel.MIMEType = 'application/vnd.layer.card.organization+json';

MessagePart.TextualMimeTypes.push(OrganizationModel.MIMEType);

// Register the Card Model Class with the Client
Client.registerCardModelClass(OrganizationModel, 'OrganizationModel');

module.exports = OrganizationModel;
