'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const BaseBot = require('botmaster').botTypes.BaseBot


class WebUIBot extends BaseBot {

  constructor(settings) {
    super(settings);
    this.type = 'webui';
    this.requiresWebhook = true;
    this.baseMessageURL = settings.baseMessageURL
    this.__applySettings(settings);
    this.__createMountPoints();
  }

  /**
   * sets up the app.
   * Adds an express Router to "/WebUI".
   * sub Router contains code for posting to webhook.
   */

  __createMountPoints() {
    this.app = express();

    this.app.use(bodyParser.json());
    // for parsing application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({
      extended : true
    }));

    this.app.get(this.webhookEndpoint, (req, res) => {
      //console.log("get webhook data");
      res.sendStatus(200);
    });

    this.app.post(this.webhookEndpoint, (req, res) => {
      // only do this if verifyRequestSignarure didn't return false
      //console.log(req);
      //console.log(JSON.stringify(req.body, null, 2));
      this.__emitUpdate(req.body);
      //console.log("got webhook data");
      res.sendStatus(200);
    });
  }

  __setBotIdIfNotSet(update) {
    if (!this.id) {
      this.id = update.recipient.id;
    }
  }

  sendMessage(message) {
    //console.log("Sending WebUI message back");
    //console.log("Message to send => : " + JSON.stringify(message));
    const options = {
      uri : this.baseMessageURL,
      method : 'POST',
      body : message,
      json : true    };

    //require('request-promise').debug = true;
    return request(options).then((body) => {
      if (body.error) {
        //console.log("WebUI send error");
        throw new Error(JSON.stringify(body.error));
      }
      //console.log("WebUI send response body = " + body);
      return body;
    });
  }

}

module.exports = WebUIBot;
