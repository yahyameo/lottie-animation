import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { createWriteStream } from 'fs';
import Animation from '../models/Animation';

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
  Upload: GraphQLUpload,
  Query: {
    searchAnimations: async (_: any, { query }: any) => {
      return await Animation.find({ name: { $regex: query, $options: 'i' } });
    },
    getAnimation: async (_: any, { id }: any) => {
      return await Animation.findById(id);
    },
    getAllAnimations: async () => {
      return await Animation.find();
    },
  },
  Mutation: {
    uploadAnimation: async (_: any, { file, name, description }: { file: FileUpload; name: string; description: string }) => {
      const { createReadStream, filename } = await file;
      const uniqueFilename = `${uuidv4() + "." + filename.split(".")[1]}`;
      const filepath = path.join(__dirname, '../uploads', uniqueFilename);

      await new Promise((res, rej) =>
        createReadStream()
          .pipe(createWriteStream(filepath))
          .on('finish', res)
          .on('error', rej)
      );

      const animation = new Animation({ name, description, fileName: filename, path: uniqueFilename });
      return await animation.save();
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
