/**
* GENERATED CODE - DO NOT MODIFY
* Created Thu Sep 22 2022
*/
import express from 'express'

export interface QueryParams {}

export type HandlerInput = undefined

export interface InputSchema {
  [k: string]: unknown;
}

export interface HandlerOutput {
  encoding: 'application/json';
  body: OutputSchema;
}

export interface OutputSchema {
  name: string;
  did: string;
}

export type Handler = (
  params: QueryParams,
  input: HandlerInput,
  req: express.Request,
  res: express.Response
) => Promise<HandlerOutput> | HandlerOutput
