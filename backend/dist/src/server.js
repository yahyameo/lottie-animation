"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = require("./schema");
const mongoose_1 = __importDefault(require("mongoose"));
const graphql_upload_ts_1 = require("graphql-upload-ts");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lottie";
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, graphql_upload_ts_1.graphqlUploadExpress)({ maxFileSize: 10000000, maxFiles: 10 }));
    app.use((0, cors_1.default)());
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
    const server = new apollo_server_express_1.ApolloServer({
        schema: schema_1.schema,
        context: ({ req, res }) => ({ req, res }), // Ensure context includes req, res for file uploads
    });
    yield server.start();
    server.applyMiddleware({ app });
    yield mongoose_1.default.connect(MONGO_URI, {});
    app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
});
startServer();
