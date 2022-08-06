import { dbPoolData } from "./types";
import * as mysql from "mysql2"

export class DB {

    private connector;
    private table;

    constructor(data: dbPoolData, table: string) {
        this.connector = mysql.createPool({
            host: data.host,
            user: data.user,
            password: data.password,
            database: data.database,
            connectionLimit: data.connectionLimit
        })
        this.table = table;
    }

    public async selectChildrenWithParentId(parent_id: number | "NULL") {
        try {
            let queryString;
            if(parent_id !== "NULL") queryString = `SELECT * FROM ${this.table} WHERE parent_id=${parent_id}`;
            else queryString = `SELECT * FROM ${this.table} WHERE parent_id is NULL`
            const selectedItems = await this.connector.promise().query(queryString);
            const res = Object.values(selectedItems[0]);
            if(res.length > 0 && res[0].content !== null) {
                let res_modified = res;
                res_modified[0].content = res[0].content.split('$^&').join('"');
                return res_modified;
            } else return res;
        } catch(e) {
            console.log(e);
            return [];
        }
    }

    public async addItemWithParentId(parent_id: number | "NULL", name: string, content: string | undefined) {
        try {
            console.log(
                "addimng"
            )
            let queryString;
            if(typeof content !== "undefined") {
                const text_filtered = content.split('"').join('$^&');
                const isExists = await this.ifContentChildExists(parent_id)
                if(!isExists)
                    queryString = `INSERT INTO ${this.table} (parent_id, name, content) VALUES (${parent_id}, "${name}", "${text_filtered}")`
                else 
                    queryString = `UPDATE ${this.table} SET content="${content}" WHERE parent_id=${parent_id}`
            }
            else 
                queryString = `INSERT INTO ${this.table} (parent_id, name) VALUES (${parent_id}, "${name}")`
            await this.connector.promise().query(queryString);
        } catch(e) {
            console.log(e);
        }
    }

    public async ifContentChildExists(parent_id: number | "NULL"): Promise<boolean>{
        try {
            const queryString = `SELECT * FROM ${this.table} WHERE name="content" AND parent_id="${parent_id}"`
            const selectedItems = await this.connector.promise().query(queryString);
            if(Object.values(selectedItems[0]).length > 0) return true;
            return false;
        } catch(e) {
            console.log(e);
            return true;
        }
    }

    public async editContent(id: number, content: string, table: string) {
        try {
            const queryString = `UPDATE ${table} SET content="${content}" WHERE id=${id}`
            await this.connector.promise().query(queryString);
        } catch(e) {
            console.log(e);
        }
    }

    public getTable() {
        return this.table;
    }

    public async selectParentName(parent_id: number): Promise<string> {
        try {
            const queryString = `SELECT * FROM ${this.table} WHERE id="${parent_id}"`
            const selectedItems = await this.connector.promise().query(queryString);
            return Object.values(Object.values(selectedItems)[0])[0].name;
        } catch(e) {
            console.log(e);
            return ""
        }
    }

    public async deleteCategory(parent_id: number) {
        try {
            const queryString = `DELETE FROM ${this.table} WHERE id="${parent_id}"`
            await this.connector.promise().query(queryString);
        } catch(e) {
            console.log(e);
        }
    }
    
}