import { DatePicker } from 'antd'
import dayjs from 'dayjs'

import { RangeValue } from 'rc-picker/lib/interface'

type DatetimePickerPropsT = {
  value: string[] | null
  onChange: (value: string[] | null) => void
}

export function AppDatetimePicker(props: DatetimePickerPropsT) {
  const { value, onChange } = props

  const handleDateChange = (
    dates: RangeValue<dayjs.Dayjs>,
    dateStrings: [string, string],
  ) => {
    if (dates) {
      // dateStrings[0] and dateStrings[1] contain the formatted date strings
      onChange(dateStrings)
    } else {
      // Handle the case when both dates are cleared
      onChange(null)
    }
  }

  return (
    <DatePicker.RangePicker
      size="middle"
      className="shadow-md !bg-transparent"
      style={{
        border: '1px solid black',
        borderRadius: '24px',
      }}
      format={'YYYY-MM-DD'}
      value={value ? [dayjs(value[0]), dayjs(value[1])] : null}
      onChange={handleDateChange}
    />
  )
}
