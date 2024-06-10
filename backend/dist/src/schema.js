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
exports.schema = void 0;
const schema_1 = require("@graphql-tools/schema");
const graphql_upload_ts_1 = require("graphql-upload-ts");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const Animation_1 = __importDefault(require("../models/Animation"));
const typeDefs = `
  scalar Upload

  type Animation {
    id: ID!
    name: String!
    fileName: String!
    path: String!
    description: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    searchAnimations(query: String!): [Animation]
    getAnimation(id: ID!): Animation
    getAllAnimations: [Animation]
  }

  type Mutation {
    uploadAnimation(name: String!, description: String!, file: Upload!): Animation
  }
`;
const resolvers = {
    Upload: graphql_upload_ts_1.GraphQLUpload,
    Query: {
        searchAnimations: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { query }) {
            return yield Animation_1.default.find({ name: { $regex: query, $options: 'i' } });
        }),
        getAnimation: (_2, _b) => __awaiter(void 0, [_2, _b], void 0, function* (_, { id }) {
            return yield Animation_1.default.findById(id);
        }),
        getAllAnimations: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield Animation_1.default.find();
        }),
    },
    Mutation: {
        uploadAnimation: (_3, _c) => __awaiter(void 0, [_3, _c], void 0, function* (_, { file, name, description }) {
            const { createReadStream, filename } = yield file;
            const uniqueFilename = `${(0, uuid_1.v4)() + "." + filename.split(".")[1]}`;
            const filepath = path_1.default.join(__dirname, '../uploads', uniqueFilename);
            yield new Promise((res, rej) => createReadStream()
                .pipe((0, fs_1.createWriteStream)(filepath))
                .on('finish', res)
                .on('error', rej));
            const animation = new Animation_1.default({ name, description, fileName: filename, path: uniqueFilename });
            return yield animation.save();
        }),
    },
};
exports.schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
