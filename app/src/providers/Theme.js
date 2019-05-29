// @flow
import { createContext } from 'react';

const PRIMARY_COLOR = '#172B4D';
export const tokens = {
  h1: {
    textColor: PRIMARY_COLOR,
  },
  panel: {
    header: {
      textColor: '#fff',
      backgroundColor: PRIMARY_COLOR,
    },
    body: {
      borderColor: PRIMARY_COLOR,
    },
  },
};

export default createContext(tokens);
