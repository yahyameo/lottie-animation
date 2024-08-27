import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { createWriteStream } from 'fs';
import Animation, { IAnimation } from '../models/Animation';
import { GraphQLError } from 'graphql';

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
    searchAnimations: async (_: any, { query }: any): Promise<IAnimation[]> => {
      return await Animation.find({ name: { $regex: query, $options: 'i' } });
    },
    getAnimation: async (_: any, { id }: any): Promise<IAnimation | null> => {
      const animation = await Animation.findById(id);

      if (!animation) {
        throw new Error(`Animation with id ${id} not found`);
      }

      return animation;
    },
    getAllAnimations: async (): Promise<IAnimation[]> => {
      return await Animation.find();
    },
  },
  Mutation: {
    uploadAnimation: async (_: any, { file, name, description }: { file: FileUpload; name: string; description: string }): Promise<IAnimation> => {
      try {

        const { createReadStream, filename } = await file;

        // Validate file extension
        const fileExtension = path.extname(filename).toLowerCase();

        if (fileExtension !== '.json') {
          throw new GraphQLError('Only .json files are allowed for Lottie animations', {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 400 }
            }
          });
        }

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
      } catch (error: any) {
        console.error('Error in uploadAnimation:', error);
        throw new Error(error);
      }
    }

  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
