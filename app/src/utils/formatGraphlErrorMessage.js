// @flow

export default function (message: string): string {
  return message.replace('GraphQL error: ', '');
}
