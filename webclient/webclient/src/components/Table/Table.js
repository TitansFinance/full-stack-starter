import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'

import TableRowDetailPair from '@/components/TableRowDetailPair'

import './Table.sass'


export const TableRow = ({
  children,
  expanded = false,
  expandableContent = null,
  className = '',
  ...rest
}) => {
  return (
    <div className={cx({ TableRow: true, [className]: Boolean(className) })} {...rest}>
      {children}
      {expanded ? expandableContent : null}
    </div>
  )
}

export const TableSubRow = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={cx({ TableSubRow: true, [className]: Boolean(className) })} {...rest}>
      {children}
    </div>
  )
}

function onScrollEvent(e, callback) {
  // visible height + pixel scrolled = total height
  // console.log('onScrollEvent(e, onScroll)', e)
  const scrollTop = e.target.scrollTop
  const offsetHeight = e.target.offsetHeight
  const scrollHeight = e.target.scrollHeight
  if ((offsetHeight + scrollTop) === scrollHeight) {
    // console.log('End')
    if (callback) callback(e, { end: true })
  } else {
    if (callback) callback(e, { end: false })
  }
}

export const Table = ({
  onRowClick = () => ({}),
  onCellClick = () => ({}),
  onTableScroll = () => ({}),
  children,
  className = '',
  items = [],
  limitExpandedRows = true,
  noMoreItemsText = 'No more items.',
  ...rest
}) => {
  const table = useRef(null)
  const [expandedRowsMap, setExpandedRowsMap] = useState([])

  useEffect(() => {
    table.current && table.current.addEventListener('scroll', (e) => onScrollEvent(e, onTableScroll))
  }, () => {
    table.current && table.current.removeEventListener('scroll', (e) => onScrollEvent(e, onTableScroll))
  })

  let rows = null
  if (typeof children === 'function') {
    rows = items.map((item, key) => children({
      index: key,
      item,
      key,
      isExpanded: Boolean(expandedRowsMap[key]),
      expandRow: (shouldExpand) => {
        if (limitExpandedRows) setExpandedRowsMap(Object.assign({}, { [key]: shouldExpand }))
      },
    }))
  } else if (children) {
    rows = children
  }

  return (
    <div ref={table} className={cx({ Table: true, [className]: Boolean(className) })} {...rest}>
      {rows}
      {(noMoreItemsText !== null) ? <div className="NoMoreItemsText">{noMoreItemsText}</div> : null}
    </div>
  )
}

Table.Row = TableRow
Table.SubRow = TableSubRow
Table.RowDetailPair = TableRowDetailPair

export default Table
