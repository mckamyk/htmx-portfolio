import { Elysia } from "elysia";
import {pino} from 'pino'
import type { Context } from 'elysia';
import { LoggerOptions, stdSerializers } from 'pino';
import pretty from 'pino-pretty'



export const logger = () => {
  return (app: Elysia) => {
    return app.derive(() => {
      const log = pino({ formatters, serializers }, pretty({ colorize: true }))
      return { log }
    })
  }
}

const serializers: LoggerOptions['serializers'] = {
  request: serializeRequest,
  err: stdSerializers.err
};

function serializeRequest(request: Request) {
  return {
    method: request.method,
    url: request.url,
    referrer: request.referrer,
    body: request.json()
  };
}

const formatters: LoggerOptions['formatters'] = {
  log(object) {
    if (isContext(object)) {
      const context = object as unknown as Context;
      return { request: context.request };
    } else if (isRequest(object)) {
      return serializeRequest(object as unknown as Request);
    }
    return object;
  }
};

function isContext(object: unknown) {
  const context = object as Context;
  return context.request && context.store;
}

function isRequest(object: unknown) {
  const request = object as Request;
  return request.url && request.method;
}

