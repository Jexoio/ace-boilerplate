// @flow
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';

const scalarResolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
};

export default scalarResolvers;
