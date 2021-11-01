/**
 * @jest-environment node
 */

import express from 'express';
import {StatusCodes} from 'http-status-codes';
import supertest from 'supertest';
import {assertRequestType, Criteria} from './assertRequestType.js';

const tests: ['Accept' | 'Content-Type', boolean, string, string[], string][] =
  [
    ['Accept', true, 'text/plain', ['text/plain'], 'Success!'],
    ['Accept', true, 'text/plain', ['text/plain', 'text/html'], 'Success!'],
    ['Accept', false, 'text/plain', ['application/json'], 'Accept must be: '],
    [
      'Accept',
      false,
      'text/plain',
      ['application/json', 'application/xml'],
      'Accept must be one of: ',
    ],
    ['Content-Type', true, 'text/plain', ['text/plain'], 'Success!'],
    [
      'Content-Type',
      true,
      'text/plain',
      ['text/plain', 'text/html'],
      'Success!',
    ],
    [
      'Content-Type',
      false,
      'text/plain',
      ['application/json'],
      'Content-Type must be: ',
    ],
    [
      'Content-Type',
      false,
      'text/plain',
      ['application/json', 'application/xml'],
      'Content-Type must be one of: ',
    ],
  ];

tests.forEach(
  ([header, expectSuccess, value, acceptedValues, responseText]) => {
    const titleMatch = expectSuccess ? 'matches' : "doesn't match";
    const titleCount = acceptedValues.length > 1 ? 'multiple' : 'one';
    test(`Header '${header}' ${titleMatch} ${titleCount} accepted value`, async () => {
      const server = express();
      server.use((req, res) => {
        const criteria: Criteria = {};
        if (header === 'Accept') criteria.accept = acceptedValues;
        if (header === 'Content-Type') criteria.contentType = acceptedValues;
        const bestMatch = assertRequestType(req, res, criteria);
        if (bestMatch) {
          res.statusCode = StatusCodes.OK;
          res.send('Success!');
        }
      });

      const res = await supertest(server)
        .post('/')
        .set(header, value)
        .send('foo');

      expect(res.status).toBe(
        expectSuccess
          ? StatusCodes.OK
          : header === 'Accept'
          ? StatusCodes.NOT_ACCEPTABLE
          : StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      );
      expect(res.text).toBe(
        expectSuccess ? responseText : responseText + acceptedValues.join(', '),
      );
    });
  },
);
