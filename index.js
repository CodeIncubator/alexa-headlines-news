/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

"use strict";
const Alexa = require("alexa-sdk");
var Feed = require("rss-to-json");
let data = [];

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = "amzn1.ask.skill.cc3a8ce1-046e-4de0-ab0d-2759f318b00e";

const SKILL_NAME = "Today Headlines";
const GET_FACT_MESSAGE = "Today's News Headlines: ";
const HELP_MESSAGE =
	"You can say tell me a space fact, or, you can say exit... What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye Have a good day!";

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
	LaunchRequest: function() {
		this.emit("GetNewsIntent");
	},
	Unhandled: function() {
		this.emit(
			":ask",
			"Sorry I didnt understand that. Say help for assistance."
		);
	},
	GetNewsIntent: function() {
		getNews();
		const updatedNews = data.join(' <break time="1s"/> ');
		console.log("all news  covered" + updatedNews);
		const speechOutput = GET_FACT_MESSAGE + updatedNews;
		this.response.cardRenderer(SKILL_NAME, updatedNews);
		this.response.speak(speechOutput);
		this.emit(":responseReady");
		data = [];
	},
	"AMAZON.HelpIntent": function() {
		const speechOutput = HELP_MESSAGE;
		const reprompt = HELP_REPROMPT;

		this.response.speak(speechOutput).listen(reprompt);
		this.emit(":responseReady");
	},
	"AMAZON.CancelIntent": function() {
		this.response.speak(STOP_MESSAGE);
		this.emit(":responseReady");
	},
	"AMAZON.StopIntent": function() {
		this.response.speak(STOP_MESSAGE);
		this.emit(":responseReady");
	}
};

function getNews() {
	return Feed.load(
		"https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
		function(err, rss) {
			for (let i = 0; i <= rss.items.length - 1; i++) {
				if (rss.items[i].hasOwnProperty("title")) {
					if (rss.items[i].title != "") {
						data.push(rss.items[i].title);
					}
				}
			}
		}
	);
}

exports.handler = function(event, context, callback) {
	const alexa = Alexa.handler(event, context, callback);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};
