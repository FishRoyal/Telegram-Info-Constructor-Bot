import TelegramBot = require("node-telegram-bot-api")
import { UserData } from "./userData";
import { DBCards } from "./dbCards"
import { callbackData, dbPoolData } from "./types";
import { Utils } from "./utils";

export class BotAPIHandler {

    private dbCards: DBCards;
    private tb: TelegramBot;
    private utils: Utils;
    private userData: UserData;

    constructor(poolData: dbPoolData, table: string, tb: TelegramBot, admin: string) {
        this.tb = tb;
        this.utils = new Utils();
        this.userData = new UserData(admin);
        this.dbCards = new DBCards(poolData, table);
    }

    public async reset(chat_id: number, username: string | undefined) {
        try {
            if(typeof username === "undefined") {
                await this.tb.sendMessage(chat_id, "Please create an username");
                return;
            }
            const msg_id = this.userData.getMessageId(username);
            msg_id !== 0 ? await this.tb.deleteMessage(chat_id, msg_id.toString()) : console.log();
            this.userData.deleteCallbackData(username);
            const root_cards_data = await this.dbCards.getRootCards();
            const inline_keyboard_d: any[] = this.utils.getInlineKeyboardTemplate(root_cards_data, "NULL", this.userData.isAdmin(username))
            const msg = await this.tb.sendMessage(chat_id, "Выберите категорию", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: inline_keyboard_d
                    },
                    parse_mode: "HTML"
                }
            )
            
            this.userData.setMessageId(username, msg.message_id);
        } catch(e) {
            console.log(e);
        }
    }

    public async callback(chat_id: number, message_id: number, username: string | undefined, data: any) {
        try {
            if(typeof username === "undefined") {
                this.tb.sendMessage(chat_id, "Please create a username");
                return;
            }
            let cb_data = JSON.parse(data) as callbackData;
            console.log(cb_data)
            const parent_id = this.userData.updateCallbackData(username, message_id, cb_data);
            if(typeof cb_data.back !== "undefined" || typeof cb_data.push !== "undefined") {
                await this.move(chat_id, message_id, parent_id, false, username);
            } else if(typeof cb_data.reset !== "undefined") {
                await this.move(chat_id, message_id, "NULL", false, username)
            } else if(this.userData.isAdmin(username)) {
                if(typeof cb_data.add !== "undefined") {
                    await this.add_prepare(chat_id, message_id, "empty");
                } else if(typeof cb_data.add_category !== "undefined") {
                    await this.add_prepare(chat_id, message_id, "category");
                } else if(typeof cb_data.add_content !== "undefined") {
                    await this.add_prepare(chat_id, message_id, "content");
                } else if(typeof cb_data.back_add !== "undefined") {
                    await this.move(chat_id, message_id, parent_id, false, username);
                } else if(typeof cb_data.delete !== "undefined") {
                    const msg_id = this.userData.getMessageId(username);
                    msg_id !== 0 ? await this.tb.deleteMessage(chat_id, msg_id.toString()) : console.log();
                    await this.dbCards.deleteCategory(cb_data.delete);
                    await this.move(chat_id, message_id, parent_id, true, username)
                } else if(typeof cb_data.edit_content !== "undefined") {
                    await this.add_prepare(chat_id, message_id, "content");
                }
            }

        } catch(e) {
            console.log(e);
        }
    }

    public async editMode(chat_id: number, username: string | undefined) {
        try {
            if(typeof username === "undefined") {
                await this.tb.sendMessage(chat_id, "Please create a username");
                return;
            } 
            const res = this.userData.changeMode(username);
            if(!res) {
                await this.tb.sendMessage(chat_id, "You have not rules to edit");
                return;
            }
            const msg_id = this.userData.getMessageId(username);
            console.log(msg_id)
            msg_id !== 0 ? await this.tb.deleteMessage(chat_id, msg_id.toString()) : console.log();
            const root_cards_data = await this.dbCards.getRootCards();
            const inline_keyboard_d: any[] = this.utils.getInlineKeyboardTemplate(root_cards_data, "NULL", this.userData.isAdmin(username))
            const msg = await this.tb.sendMessage(chat_id, "Выберите категорию", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: inline_keyboard_d
                    },
                    parse_mode: "HTML"
                }
            )
            
            this.userData.setMessageId(username, msg.message_id);
        } catch(e) {
            console.log(e);
        }
        
    }

    public async message(chat_id: number, username: string | undefined, text: string | undefined) {
        try {
            if(typeof username === "undefined") {
                await this.tb.sendMessage(chat_id, "Please create a username");
                return;
            }
            if(!this.userData.isAdmin(username)) return;
            if(typeof text === "undefined") return;

            const parent_id = this.userData.getLastParent(username)
            const type_adding = this.userData.ifAddingData(username)
            if(type_adding === "category") {
                await this.dbCards.addItemWithParentId(this.userData.getLastParent(username), text, undefined);
                const msg_id = this.userData.getMessageId(username)
                msg_id !== 0 ? await this.tb.deleteMessage(chat_id, msg_id.toString()) : console.log();
                this.userData.resetAdding(username);
                await this.move(chat_id, msg_id, parent_id, true, username)
            } else if(type_adding === "content") {
                await this.dbCards.addItemWithParentId(this.userData.getLastParent(username), "content", text);
                const msg_id = this.userData.getMessageId(username)
                msg_id !== 0 ? await this.tb.deleteMessage(chat_id, msg_id.toString()) : console.log();
                this.userData.resetAdding(username);
                await this.move(chat_id, msg_id, parent_id, true, username)
            }

        }
        catch(e) {
            console.log(e);
        }
    }

    private async move(chat_id: number, message_id: number, parent_id: number | "NULL", send: boolean, username: string) {
        try {
            const children_cards_data = await this.dbCards.selectChildrenWithParentId(parent_id);
            const inline_keyboard_d: any[] = this.utils.getInlineKeyboardTemplate(children_cards_data, parent_id, this.userData.isAdmin(username));
            let str;
            console.log("Cards", children_cards_data)
            console.log("Keyboard:" , inline_keyboard_d);
            if(children_cards_data.length > 0) {
                if(parent_id === "NULL" && children_cards_data[0].content === null) str = "Выберите категорию"
                else if(children_cards_data[0].content === null) str = "Выберите подкатегорию"
                else { 
                    str = children_cards_data[0].content;
                }
            }
            else {
                str = "Пустой каталог"
            }
            if(!send) {
                await this.tb.editMessageText(str, {
                    message_id: message_id,
                    chat_id: chat_id,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: inline_keyboard_d
                    }
                })
            } else {
                const msg = await this.tb.sendMessage(chat_id, str, {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: inline_keyboard_d
                    },
                    parse_mode: "HTML"
                })
                this.userData.setMessageId(username, msg.message_id);
            }
        } catch(e) {
            console.log(e);
        }
    }

    private async add_prepare(chat_id: number, message_id: number, children_cards_type: "empty" | "category" | "content") {
        try {
            const inline_keyboard_d: any[] = this.utils.getInlineKeyboardTemplateAdd(children_cards_type, true);

            let str = "default";
            if(children_cards_type === "empty") str = "Добавить категорию или контент?";
            if(children_cards_type === "category") str = "Введите имя категории, которую хотите добавить";
            if(children_cards_type === "content") str = "Для добавления контента напишите и отправьте пост"
            await this.tb.editMessageText(str, {
                message_id: message_id,
                chat_id: chat_id,
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: inline_keyboard_d
                }
            })
        } catch(e) {
            console.log(e);
        }
    }

}