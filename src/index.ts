import { BotAPI } from "./botApi";
import "dotenv/config"
import endpointsConfig from "../endpoints.config";

const botApi = new BotAPI(endpointsConfig.api_key, {
    host: endpointsConfig.host,
    user: endpointsConfig.user,
    password: endpointsConfig.password,
    database: endpointsConfig.database,
    connectionLimit: 15
}, endpointsConfig.tableName, endpointsConfig.admin)