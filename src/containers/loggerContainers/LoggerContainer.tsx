import {
  AppInputField,
  ColumnFieldsT,
  AppDatetimePicker,
  H5,
  Icon,
  Table,
  onChangePaginationFunctionT,
} from '@/src/components'
import { LANG } from '@/src/constants'
import { Logger } from '@/src/modals'
import { appService } from '@/src/utils'
import { message } from 'antd'
import dayjs from 'dayjs'
import _ from 'lodash'
import Link from 'next/link'

import React, { Fragment, useCallback, useState } from 'react'

type LoggerContainerStateT = {
  loading: boolean
  error: string
  data: Logger[]
  page: number
  pageSize: number
  totalCount: number
}
const Columns: ColumnFieldsT[] = [
  {
    accessor: 'email',
    header: 'Email',
  },
]
type GetLogsPayloadT = {
  page?: number
  pageSize?: number
  status?: string
  templateId?: string
  date?: string[] | null
}
type LoggerContainerFiltersT = {
  filterBy: 'ALL' | string[]
  filterValue: string
  date: null | string[]
}
function LoggerContainer() {
  const [state, setState] = useState<LoggerContainerStateT>({
    loading: true,
    error: '',
    data: [],
    pageSize: 25,
    page: 1,
    totalCount: 0,
  })
  const [filter, setFilters] = useState<LoggerContainerFiltersT>({
    filterBy: 'ALL',
    filterValue: '',
    date: null,
  })
  const handleState = (payload: Partial<LoggerContainerStateT>) => {
    setState((prev) => ({ ...prev, ...payload }))
  }
  const handleFilters = (payload: Partial<LoggerContainerFiltersT>) => {
    setFilters((prev) => ({ ...prev, ...payload }))
  }
  const getDateFromTo = (datetime: string[]) => {
    return {
      fromDate: dayjs(datetime?.[0]).startOf('day').toISOString(),
      toDate: dayjs(datetime?.[1]).endOf('day').toISOString(),
    }
  }
  const getLogs = async (payload?: GetLogsPayloadT) => {
    try {
      const { pageSize = state?.pageSize, page = state?.page } = payload || {}
      handleState({ loading: true, error: '' })
      let body: Record<string, any> = {
        offset: page - 1 * pageSize,
        limit: pageSize,
      }
      if (_.has(payload, 'date')) {
        if (payload?.date) {
          body['date'] = payload.date
        }
      } else if (filter?.date?.length) {
        const { fromDate, toDate } = getDateFromTo(filter?.date)
        body['date'] = [fromDate, toDate]
      }
    } catch {
      message.error('Failed to Fetch Logs')
      handleState({
        loading: false,
        error: LANG.COMMON.NETWORK_ERROR,
      })
    }
  }
  const onChangePagination: onChangePaginationFunctionT = useCallback(
    async (page, pageSize) => {
      getLogs({
        page,
        pageSize,
      })
    },
    [],
  )
  const onChangeDate = (date: string[] | null) => {
    handleFilters({ date })
    if (date?.length) {
      const { fromDate, toDate } = getDateFromTo(date)
      getLogs({
        date: [fromDate, toDate],
      })
    } else {
      getLogs()
    }
  }
  return (
    <Fragment>
      <header className="min-h-[3rem] border-b drop-shadow-xl bg-black sticky z-10 top-0 flex items-center gap-4 text-white py-5 px-7 flex-wrap w-full">
        <H5 className="flex-1">Logger</H5>
        <Link href="/login">
          <Icon
            icon="log-out"
            onClick={appService.clear}
            tooltip={{
              title: 'logout',
              arrow: true,
              color: 'cyan',
            }}
          />
        </Link>
      </header>
      <section className=" py-8 px-6 flex-1 overflow-auto w-full flex flex-col gap-5">
        <div className="flex w-full items-center gap-4 flex-wrap">
          <div className="flex-1">
            <AppInputField
              containerClassName="max-w-[20rem] "
              placeholder="Search"
              iconRight={{ icon: 'search' }}
            />
            {/* <AppDatetimePicker value={filter.date} onChange={onChangeDate} /> */}
          </div>
        </div>
        <div className=" rounded-lg drop-shadow-2xl flex-1  bg-blue-50 h-full w-full">
          {/* <Table
            allRows={state.data}
            allColumns={Columns}
            pageNumber={state.page}
            manualLoading={state.loading}
            pageSize={state.pageSize}
            totalCount={state.totalCount}
            onChangePagination={onChangePagination}
          /> */}
        </div>
      </section>
    </Fragment>
  )
}

export default LoggerContainer
