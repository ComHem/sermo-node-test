import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

const acceptOne = 'Accept must be: ';
const acceptMany = 'Accept must be one of: ';

const contentTypeOne = 'Content-Type must be: ';
const contentTypeMany = 'Content-Type must be one of: ';

export interface Criteria {
  accept?: string[];
  contentType?: string[];
}

interface BestMatch {
  accept?: string | boolean;
  contentType?: string | boolean | null;
}

export function assertRequestType(
  req: Request,
  res: Response,
  criteria: Criteria,
): BestMatch | undefined {
  const {accept, contentType} = criteria;
  const bestMatch: BestMatch = {};

  if (accept) {
    bestMatch.accept = req.accepts(...accept);
    if (!bestMatch.accept) {
      res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .send((accept.length > 1 ? acceptMany : acceptOne) + accept.join(', '));
      return;
    }
  }

  if (contentType) {
    bestMatch.contentType = req.is(contentType);
    if (!bestMatch.contentType) {
      res
        .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
        .send(
          (contentType.length > 1 ? contentTypeMany : contentTypeOne) +
            contentType.join(', '),
        );
      return;
    }
  }

  return bestMatch;
}
