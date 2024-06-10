import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import mongoose from 'mongoose';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lottie";

const startServer = async () => {
  const app: any = express();

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(cors());
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }), // Ensure context includes req, res for file uploads
  });

  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(MONGO_URI, {
  });

  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
};

startServer();
