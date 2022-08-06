import TelegramBot = require("node-telegram-bot-api")
import { BotAPIHandler } from "./apiHandler";
import { parseEntities } from "./parseEntities";
import { dbPoolData } from "./types";

export class BotAPI {

    private tb : TelegramBot;
    private apiHandler: BotAPIHandler;

    constructor(api_key: string, poolData: dbPoolData, table: string, admin: string) {
        this.tb = new TelegramBot(api_key, {polling: true});
        this.apiHandler = new BotAPIHandler(poolData, table, this.tb, admin);
        this.go();
    }

    private go() {
        this.tb.onText(/\/start/, async (msg) => {
            try {
                await this.apiHandler.reset(msg.chat.id, msg.chat.username);
            } catch(e) {
                console.log(e);
            }
        });

        //only for admin
        this.tb.on('message', async(msg) => {
            try {
                console.log(msg);
                let text;
                if(typeof msg.caption === "undefined") {
                    if(typeof msg.text === "undefined") return;
                    if(typeof msg.entities !== "undefined") {
                        text = parseEntities(msg.text, msg.entities);
                    } else text = msg.text;
                }
                else {
                    if(typeof msg.caption === "undefined") return;
                    if(typeof msg.caption_entities !== "undefined") {
                        text = parseEntities(msg.caption, msg.caption_entities);
                    } else text = msg.caption;
                }
                await this.apiHandler.message(msg.chat.id, msg.chat.username, text);
            } catch(e) {
                console.log(e);
            }
        })

        this.tb.onText(/\/edit/, async(msg) => {
            try {
                await this.apiHandler.editMode(msg.chat.id, msg.chat.username);
            } catch(e) {
                console.log(e);
            }
        })

        this.tb.on('callback_query', async (msg) => {
            try {
                if(typeof msg.message === "undefined") return;
                if(typeof msg.data === "undefined") return;
                await this.apiHandler.callback(msg.message.chat.id, msg.message.message_id, msg.from.username, msg.data);
            } catch(e) {
                console.log(e);
            }
        })
    }


}