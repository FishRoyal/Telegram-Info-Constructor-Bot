import { callbackData, i_userData } from "./types";

export class UserData {

    private currentData: i_userData;

    constructor(readonly admin: string) {
        this.currentData = {};
    }

    public deleteCallbackData(username: string) {
        if(username in this.currentData) delete this.currentData[username];
    }

    public updateCallbackData(username: string, message_id: number, data: callbackData): number | "NULL" {
        if(!(username in this.currentData)) {
            this.currentData[username] = {
                is_admin: false,
                message_id: message_id,
                path: ":NULL",
                adding: false,
                adding_category: false,
                adding_content: false
            }
        } else {
            this.currentData[username].message_id = message_id;
        }
        if(typeof data.push !== "undefined") {
            this.currentData[username].path = this.currentData[username].path + ':' + data.push.toString();
        }
        if(typeof data.back !== "undefined") {
            const splited_data = this.currentData[username].path.split(':');
            if(typeof splited_data !== "undefined") {
                const popped_data = splited_data.slice(0, -1);
                if(typeof popped_data !== "undefined") {
                    const joined_data = popped_data.join(':')
                    this.currentData[username].path = joined_data;
                }
            }
        }
        if(typeof data.add !== "undefined") {
            this.currentData[username].adding = true;
        }
        if(typeof data.add_category !== "undefined") {
            this.currentData[username].adding_category = true;
        }
        if(typeof data.add_content !== "undefined") {
            this.currentData[username].adding_content = true;
        }
        if(typeof data.edit_content !== "undefined") {
            this.currentData[username].adding_content = true;
        }
        if(typeof data.back_add !== "undefined") {
            this.currentData[username].adding = false;
            this.currentData[username].adding_category = false;
            this.currentData[username].adding_content = false;
        }
        if(typeof data.reset !== "undefined") {
            this.currentData[username].path = ":NULL";
        }
        const last_parent = this.currentData[username].path.split(':');
        const res = last_parent[last_parent.length - 1];
        if(res !== "NULL") return parseInt(res);
        else return "NULL"
    }

    public ifAddingData(username: string): "false" | "content" | "category" | "true" {
        if(typeof this.currentData[username] === "undefined") return "false";
        if(this.currentData[username].adding_category) return "category"
        if(this.currentData[username].adding_content) return "content"
        if(this.currentData[username].adding === false) return "false"
        return "true"
    }


    public getLastParent(username: string) {
        if(!(username in this.currentData)) {
            this.currentData[username] = {
                is_admin: false,
                message_id: 0,
                path: ":NULL",
                adding: false,
                adding_category: false,
                adding_content: false
            }
        }
        const last_parent = this.currentData[username].path.split(':');
        const res = last_parent[last_parent.length - 1];
        if(res !== "NULL") return parseInt(res);
        else return "NULL"
    }  

    public getMessageId(username: string): number {
        if(typeof this.currentData[username] !== "undefined")
            return this.currentData[username].message_id;
        else return 0;
    }

    public resetAdding(username: string) {
        if(typeof this.currentData[username] !== "undefined") {
            this.currentData[username].adding = false;
            this.currentData[username].adding_category = false;
            this.currentData[username].adding_content = false;
        }
    }

    public setMessageId(username: string, message_id: number) {
        if(!(username in this.currentData)) {
            this.currentData[username] = {
                is_admin: false,
                message_id: 0,
                path: ":NULL",
                adding: false,
                adding_category: false,
                adding_content: false
            }
        }
        this.currentData[username].message_id = message_id;
        console.log("NEW MESSAGE ID: ", message_id)
    }

    public isAdmin(username: string) {
        if(!(username in this.currentData)) {
            this.currentData[username] = {
                is_admin: false,
                message_id: 0,
                path: ":NULL",
                adding: false,
                adding_category: false,
                adding_content: false
            }
        }
        return this.currentData[username].is_admin;
    }

    public changeMode(username: string) {
        if(!(username in this.currentData)) {
            this.currentData[username] = {
                is_admin: false,
                message_id: 0,
                path: ":NULL",
                adding: false,
                adding_category: false,
                adding_content: false
            }
        }
        if(this.admin === username){
            this.currentData[username].is_admin = !this.currentData[username].is_admin;
            return true;
        }
        else {
            return false;
        }
    }

}