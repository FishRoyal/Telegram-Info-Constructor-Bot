import { tableData } from "./types"

export class Utils {

    public getInlineKeyboardTemplate(tableData: tableData[], parent_id: number | "NULL", admin: boolean) {
        let inline_keyboard = []

        const type = this.getTypeOfList(tableData);
        if(!admin) {
            for(const row of tableData) {
                if(row.content === null)
                    inline_keyboard.push([{
                        text: row.name,
                        callback_data: `{"push":${row.id}}`
                    }])
            }
        }
        if(admin) {
            for(const row of tableData) {
                if(row.content === null)
                    inline_keyboard.push([{
                        text: row.name,
                        outerWidth: 10,
                        callback_data: `{"push":${row.id}}`
                    }, {
                        text: "-",
                        callback_data: `{"delete":${row.id}}` 
                    }])
            }
            if(type === "category") {
                inline_keyboard.push([{
                    text: "+",
                    callback_data: `{"add_category":1}`
                }])
            } else if(type === "content") {
                inline_keyboard.push([{
                    text: "Изменить",
                    callback_data: `{"edit_content":1}`
                }])
            } else {
                inline_keyboard.push([{
                    text: "+",
                    callback_data: `{"add":1}`
                }])
            }
        }
        if(parent_id !== "NULL")
            inline_keyboard.push([{
                text: "Назад",
                callback_data: `{"back":1}`
            },
            {
                text: "В начало",
                callback_data: `{"reset":1}`
            }])
        return inline_keyboard;
    }

    public getTypeOfList(tableData: tableData[]): "empty" | "content" | "category" {
        if(tableData.length === 0) return "empty";
        if(tableData[0].content !== null) return "content";
        if(tableData[0].content === null) return "category";
        return "empty";
    }

    public getInlineKeyboardTemplateAdd(listType: "empty" | "content" | "category", admin: boolean) {

        if(!admin) return [];

        let inline_keyboard = []

        if(listType === "empty") {
            inline_keyboard.push([{
                text: "Категорию",
                callback_data: `{"add_category":1}`
            }, {
                text: "Контент",
                callback_data: `{"add_content":1}`
            }])
        }

        inline_keyboard.push([{
            text: "Назад",
            callback_data: `{"back_add":1}`
        }])
        return inline_keyboard;
    }
    

}