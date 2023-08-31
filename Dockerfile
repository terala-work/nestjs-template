FROM node:18 as build
COPY ./package.json /app/package.json
WORKDIR /app
RUN npm install

FROM gcr.io/distroless/nodejs18-debian11 as image
COPY --from=build /app/node_modules /app/node_modules
COPY dist/ /app/dist/
WORKDIR /app
USER nonroot
EXPOSE 3000
CMD [ "--require", "@opentelemetry/auto-instrumentations-node", "dist/main.js"]

# FROM node:18 as image
# COPY --from=build /app/node_modules /app/node_modules
# COPY dist/ /app/dist
# EXPOSE 3000
# WORKDIR /app
# CMD ["node", "--require", "@opentelemetry/auto-instrumentations-node", "dist/main.js"]
