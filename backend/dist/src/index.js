"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const dotenv_1 = __importDefault(require("dotenv"));
const graphql_upload_ts_1 = require("graphql-upload-ts");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
app.use('/graphql', (0, graphql_upload_ts_1.graphqlUploadExpress)({
    maxFileSize: 10000000,
    maxFiles: 10,
}), (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.schema,
    rootValue: resolvers_1.resolvers,
    graphiql: true,
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
