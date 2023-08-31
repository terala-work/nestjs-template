import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { eventContext } from "aws-serverless-express/middleware.js";
import { Server } from "node:http";
import { AppModule } from "./modules/app/app.module";

// import express = require("express");
import Express from "express";

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = Express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: false,
  });

  app.use(eventContext());
  app.enableCors();

  await app.init();
  return createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  if (cachedServer) {
    return proxy(cachedServer, event, context, "PROMISE").promise;
  } else {
    const server = await bootstrapServer();
    cachedServer = server;
    return proxy(server, event, context, "PROMISE").promise;
  }
};
