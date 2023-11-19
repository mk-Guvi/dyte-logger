import { Pagination } from 'antd'
import React, { useMemo, useState } from 'react'

import { RenderCell, RenderHeader } from './components'
import { CircularLoader } from '../loaders'
import { NoDataComponent } from '..'

export type ColumnFieldsT = {
  header: string
  accessor: string
  HeaderCell?: React.FC<any>
  Cell?: React.FC<any>
}
export type CellPropsT = {
  value: any
  column: ColumnFieldsT
  row?: Record<string, any>
}

export type TableHeaderCellT = ColumnFieldsT & {}
export type onChangePaginationFunctionT = (
  page: number,
  pageSize: number,
) => Promise<void>
type TablePropsT = {
  allColumns: ColumnFieldsT[]
  allRows: Record<string, any>[]
  pageSize: number
  pageNumber: number
  totalCount: number
  onChangePagination: onChangePaginationFunctionT
  manualLoading?: boolean
}

export function Table(props: TablePropsT) {
  const {
    allColumns,
    allRows,
    onChangePagination,
    manualLoading,
    totalCount,
    pageSize,
    pageNumber,
  } = props
  const [loader, setLoader] = useState(false)

  const columns = useMemo(() => allColumns, [allColumns])

  const onChange = async (page: number, pageSize: number) => {
    setLoader(true)
    await onChangePagination(page, pageSize)
    setLoader(false)
  }

  return (
    <div
      className={`h-full w-full bg-white  relative flex flex-col   border rounded-lg overflow-auto`}
    >
      {loader ||
      manualLoading ||
      !props?.allRows?.length ||
      !columns?.length ? (
        <div className="absolute flex items-center justify-center h-full w-full">
          {loader || manualLoading ? (
            <CircularLoader className="h-7 w-7 " />
          ) : (
            <NoDataComponent imageClassName="!w-[50%] " label="No Logs" />
          )}
        </div>
      ) : null}
      {/* Table */}
      <div className={`w-full  overflow-auto flex-1 rounded-t-lg`}>
        <table
          className={`${
            loader || manualLoading ? 'opacity-20' : 'opacity-100'
          }    w-full  h-full`}
        >
          {columns.length ? (
            <thead className={`w-full sticky top-0 bg-white   z-40`}>
              <tr
                className={`flex min-h-[50px]  h-fit items-center border-b   sticky  top-0  z-40`}
              >
                {columns?.map((eachCol, colI) => {
                  return (
                    <th
                      scope="col"
                      className={`flex-1 pl-4 items-center min-w-[15rem]   flex h-full  p-[0.5rem]`}
                      key={`${eachCol?.accessor} ${colI}`}
                    >
                      {RenderHeader({
                        ...eachCol,
                      })}
                    </th>
                  )
                })}
              </tr>
            </thead>
          ) : null}
          <tbody className={`w-full h-full`}>
            {!loader && !manualLoading && allRows?.length
              ? allRows?.map((eachRow, rowIndex) => {
                  return (
                    <tr
                      className={`min-h-[40px] flex  border-b`}
                      key={rowIndex}
                    >
                      {columns?.map((eachCol, colIndex) => {
                        return (
                          <td
                            className={`pl-4  z-20   flex-1   flex items-center min-w-[15rem] relative break-words p-[0.7rem]`}
                            key={`${colIndex} ${rowIndex}`}
                          >
                            {RenderCell({
                              value: eachRow[eachCol?.accessor || ''],
                              column: { ...eachCol },
                              row: { ...eachRow },
                            })}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              : null}
          </tbody>
        </table>
      </div>
      {/* Table pagination */}
      {totalCount ? (
        <div className="w-full border-t flex justify-end p-4">
          <Pagination
            total={totalCount}
            responsive
            disabled={manualLoading || loader}
            onChange={onChange}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            pageSize={pageSize}
            current={pageNumber}
            defaultPageSize={pageSize || 20}
            defaultCurrent={pageNumber}
          />
        </div>
      ) : null}
    </div>
  )
}
