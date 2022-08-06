export type dbPoolData = {
    host: string,
    user: string,
    password: string,
    database: string,
    connectionLimit: number
}

export type parent_id = number | "NULL"
export type name = string | "NULL"
export type content = string | "NULL"

export type tableData = {
    id: number,
    parent_id: parent_id,
    name: name,
    content: content
}

export type callbackData = {
    path: string,
    reset: number,
    edit_content: number,
    add_content: number,
    add_category: number,
    add: number,
    back_add: number,
    delete: number,
    push: number | undefined,
    back: number | undefined
}

export type userData = {
    message_id: number,
    is_admin: boolean,
    path: string,
    adding: boolean,
    adding_content: boolean,
    adding_category: boolean
}

export interface i_userData {
    [key: string]: userData
}