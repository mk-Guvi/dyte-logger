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
import { useDebounce } from '@/src/utils/debounceHook'
import { message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import _ from 'lodash'

import { useRouter } from 'next/router'

import React, { Fragment, useCallback, useEffect, useState } from 'react'

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
    accessor: 'traceId',
    header: 'Trace Id',
  },
  {
    accessor: 'spanId',
    header: 'Span Id',
  },
  {
    accessor: 'level',
    header: 'Level',
  },
  {
    accessor: 'message',
    header: 'Message',
  },
  {
    accessor: 'parentResourceId',
    header: 'Parent ResourceId',
  },
  {
    accessor: 'resourceId',
    header: 'ResourceId',
  },
  {
    accessor: 'commit',
    header: 'Commit',
  },
  {
    accessor: 'timestamp',
    header: 'Date',
  },
]
type GetLogsPayloadT = {
  page?: number
  pageSize?: number
  filterBy?: 'ALL' | string[]
  filterValue?: string
  date?: string[] | null
}
type LoggerContainerFiltersT = {
  filterBy: 'ALL' | string[]
  filterValue: string
  date: null | string[]
}
function LoggerContainer() {
  const router = useRouter()
  const [state, setState] = useState<LoggerContainerStateT>({
    loading: true,
    error: '',
    data: [],
    pageSize: 50,
    page: 1,
    totalCount: 0,
  })
  const [filter, setFilters] = useState<LoggerContainerFiltersT>({
    filterBy: 'ALL',
    filterValue: '',
    date: null,
  })
  const debouncedSearch = useDebounce(filter?.filterValue, 500)

  useEffect(() => {
    getLogs({ filterValue: debouncedSearch })
  }, [debouncedSearch])

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
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }
      if (_.has(payload, 'date')) {
        if (payload?.date) {
          body['filters'] = { dateFilter: payload.date }
        }
      } else if (filter?.date?.length) {
        const { fromDate, toDate } = getDateFromTo(filter?.date)
        body['filters'] = { dateFilter: [fromDate, toDate] }
      }
      if (_.has(payload, 'filterValue')) {
        if (payload?.filterValue) {
          body['filters'] = {
            ...body?.filters,
            filterValue: payload?.filterValue,
            filterBy: payload?.filterBy || filter.filterBy,
          }
        }
      } else if (filter?.filterValue) {
        body['filters'] = {
          ...body?.filters,
          filterValue: filter?.filterValue,
          filterBy: payload?.filterBy || filter.filterBy,
        }
      }
      const { data: response } = await axios.post('/logger', body)

      if (response?.status) {
        let data = response?.data?.map((e: Logger) => {
          let { metadata, timestamp, ...rest } = e
          return {
            ...rest,
            parentResourceId: metadata?.parentResourceId,
            timestamp: dayjs(timestamp).format('DD-MM-YYYY'),
          }
        })
        handleState({
          data,
          loading: false,
          totalCount: response?.totalCount || 0,
          page,
          pageSize,
        })
      } else if (response?.status === false) {
        handleState({ data: [], loading: false })
      } else {
        throw new Error('Failed to fetch logs')
      }
    } catch (e) {
      console.error(e)
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
      getLogs({ date: null })
    }
  }

  const onLogout = () => {
    appService.clear()
    setTimeout(() => {
      router.push('/')
    }, 500)
  }
  return (
    <Fragment>
      <header className="min-h-[3rem] border-b drop-shadow-xl bg-black sticky z-10 top-0 flex items-center gap-4 text-white py-5 px-7 flex-wrap w-full">
        <H5 className="flex-1">Logger</H5>

        <Icon
          icon="log-out"
          onClick={onLogout}
          className="cursor-pointer"
          tooltip={{
            title: 'logout',
            arrow: true,
            color: 'geekblue-inverse',
          }}
        />
      </header>
      <section className=" py-8 px-6 flex-1 overflow-auto w-full flex flex-col gap-5">
        <div className="flex w-full items-center gap-4 flex-wrap">
          <div className="flex-1">
            <AppInputField
              value={filter?.filterValue}
              onChange={(e) => {
                handleFilters({ filterValue: e.target.value })
              }}
              containerClassName="max-w-[20rem] !h-[2.5rem] !bg-white drop-shadow"
              placeholder="Search"
              iconRight={{ icon: 'search' }}
            />
          </div>
          <Icon
            icon="refresh-cw"
            onClick={() => getLogs()}
            className="cursor-pointer"
            tooltip={{
              title: 'Refresh',
              arrow: true,
              color: 'cyan-inverse',
            }}
          />
          <AppDatetimePicker value={filter.date} onChange={onChangeDate} />
        </div>
        <div className=" rounded-lg drop-shadow-2xl h-[70vh]  bg-blue-50 ">
          <Table
            allRows={state.data}
            allColumns={Columns}
            pageNumber={state.page}
            manualLoading={state.loading}
            pageSize={state.pageSize}
            totalCount={state.totalCount}
            onChangePagination={onChangePagination}
          />
        </div>
      </section>
    </Fragment>
  )
}

export default LoggerContainer
