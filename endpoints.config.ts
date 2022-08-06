export default {
    host: process.env.HOST ?? '',
    user: process.env.USER_ ?? '',
    password: process.env.PASSWORD ?? '',
    database: process.env.DATABASE ?? '',
    api_key: process.env.API_KEY ?? '',
    tableName: process.env.TABLE_NAME ?? '',
    admin: process.env.ADMIN ?? ''
}