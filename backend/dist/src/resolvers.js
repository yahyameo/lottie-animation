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
exports.resolvers = void 0;
const fs_1 = require("fs");
const Animation_1 = __importDefault(require("../models/Animation"));
const graphql_upload_ts_1 = require("graphql-upload-ts");
exports.resolvers = {
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
        })
    },
    Mutation: {
        uploadAnimation: (_3, _c) => __awaiter(void 0, [_3, _c], void 0, function* (_, { file, name, description }) {
            console.log("testing");
            const { createReadStream, filename, mimetype, encoding } = yield file;
            const path = `uploads/${filename}`;
            const stream = createReadStream();
            yield new Promise((resolve, reject) => {
                const writeStream = (0, fs_1.createWriteStream)(path);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
                stream.pipe(writeStream);
            });
            const json = (0, fs_1.readFileSync)(path, 'utf8');
            const animation = new Animation_1.default({ name, description, path: "json" });
            return yield animation.save();
        }),
        downloadAnimation: (_4, _d) => __awaiter(void 0, [_4, _d], void 0, function* (_, { id }) {
            return yield Animation_1.default.findById(id);
        })
    }
};
