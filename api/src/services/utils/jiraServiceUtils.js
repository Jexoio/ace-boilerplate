// @flow
import type { JiraApiResponse } from '../../types';

/**
 * Returns the body of jira's response data as JSON
 */
export const getBodyJson = async (promise: Promise<JiraApiResponse>): Promise<any> => {
  const { body } = await promise;
  return JSON.parse(body);
};

/**
 * Paginates through jira's response until there are no more records left
 */
export const getResultWithoutPagination = async (
  fn: (path: string) => Promise<JiraApiResponse>,
  path: string,
  resultIdentifier: string,
  startAt: number = 0,
  maxResults: number = 100,
): Promise<Array<any>> => {
  let hasMore: boolean = true;
  let currentStartAt: number = startAt;
  let result: Array<any> = [];

  while (hasMore) {
    const paginatedPath = `${path}${path.includes('?') ? '&' : '?'}startAt=${currentStartAt}&maxResults=${maxResults}`;
    const body = await getBodyJson(fn(paginatedPath)); // eslint-disable-line no-await-in-loop
    const { total, [resultIdentifier]: records } = body;
    hasMore = parseInt(total, 10) > currentStartAt + maxResults;
    currentStartAt += maxResults;
    result = [...result, ...records];
  }
  return result;
};
