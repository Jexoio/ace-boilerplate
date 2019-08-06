// @flow

export type AKTableHeadCell = {
  key: string,
  content: string,
  isSortable?: boolean
};

export type AKTableHead = {
  cells: Array<?AKTableHeadCell>
}

export type AKTableRowCell = {
  key: string,
  name: string,
  content: Node
};

export type AKTableRow = {
  cells: Array<?AKTableRowCell>
}
