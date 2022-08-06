import { DB } from "./db";
import { dbPoolData } from "./types";

export class DBCards extends DB {
    constructor(poolData: dbPoolData, table: string) {
        super(poolData, table);
    }

    public async getRootCards() {
        return await this.selectChildrenWithParentId("NULL");
    }

}