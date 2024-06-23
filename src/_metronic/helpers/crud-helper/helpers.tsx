import {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react'
import qs from 'qs'
import {ID, QueryResponseContextProps, QueryState} from './models'
import {Modal, Button} from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import {useAuth} from '../../../app/modules/auth'

export const exportPDF = (data: any) => {
  const doc = new jsPDF()
  const tableColumn = ['Full Name', 'Email', 'Phone', 'Address', 'Status']
  const tableRows: any = []

  data.forEach((client: {fullname: any; email: any; telephone: any; address: any; status: any}) => {
    const clientData = [
      client.fullname,
      client.email,
      client.telephone,
      client.address,
      client.status,
    ]
    tableRows.push(clientData)
  })

  //@ts-ignore
  if (typeof doc.autoTable === 'function') {
    //@ts-ignore
    doc.autoTable({
      startY: 30, // Adjust startY to move the table down
      head: [tableColumn],
      body: tableRows,
      columnStyles: {
        0: {cellWidth: 40},
        1: {cellWidth: 35},
        2: {cellWidth: 25},
        3: {cellWidth: 50},
        4: {cellWidth: 30},
        5: {cellWidth: 30},
      },
      styles: {overflow: 'linebreak'},
      margin: {left: 14}, // Adjust left margin to move the table to the left
    })
  } else {
    console.error('autoTable function does not exist on jsPDF instance')
  }

  doc.text('Client List', 14, 15)
  doc.save('client_list.pdf')
}

export const exportExcel = (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients')
  XLSX.writeFile(workbook, 'client_list.xlsx')
}
function createResponseContext<T>(initialState: QueryResponseContextProps<T>) {
  return createContext(initialState)
}
function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== ''
}
export function formatPhone(phoneNumber: any) {
  phoneNumber = phoneNumber.replace(/[- )(]/g, '')
  if (!phoneNumber.startsWith('+216 ')) {
    phoneNumber = '+216 ' + phoneNumber
  }
  phoneNumber = phoneNumber.replace('+216 ', '+216 ')
  phoneNumber = phoneNumber.replace(/(\d{2})(\d{3})/, '$1 - $2 - ')
  return phoneNumber
}
//@ts-ignore
export const ExportModal = ({isOpen, onRequestClose, onExport}) => {
  return (
    <Modal show={isOpen} onHide={onRequestClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sélectionnez le format que vous souhaitez exporter </Modal.Title>
      </Modal.Header>

      <Modal.Footer>
        <div className='text-center w-100 m-5 p-5'>
          <Button className=' m-5 p-5 ' variant='info' onClick={() => onExport('pdf')}>
            Export as PDF
          </Button>
          <Button className=' m-5 p-5 ' variant='info' onClick={() => onExport('excel')}>
            Export as Excel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
export const truncateString = (str: any, num: any) => {
  if (str.length <= num) {
    return str
  }
  return str.substring(0, num) + '...'
}

export const handleStatus = (status: string) => {
  let bgColor = ''
  switch (status) {
    case 'vendu':
      bgColor = '#E8FFF3'
      break
    case 'annulé':
      bgColor = '#FFC2BF'
      break
    case 'reporter':
      bgColor = '#F8F5FF'
      break
    case 'en attente':
      bgColor = '#FFD59D'
      break
    default:
      bgColor = 'lightgray'
      break
  }

  return (
    <span
      style={{
        backgroundColor: bgColor,
        padding: '0.2em 0.5em',
        borderRadius: '5px',
        color: '#000',
      }}
    >
      {status}
    </span>
  )
}
// Example: page=1&items_per_page=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
function stringifyRequestQuery(state: QueryState): string {
  const pagination = qs.stringify(state, {filter: ['page', 'items_per_page'], skipNulls: true})
  const sort = qs.stringify(state, {filter: ['sort', 'order'], skipNulls: true})
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, {filter: ['search'], skipNulls: true})
    : ''

  const filter = state.filter
    ? Object.entries(state.filter as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `filter_${obj[0]}=${obj[1]}`
        })
        .join('&')
    : ''

  return [pagination, sort, search, filter]
    .filter((f) => f)
    .join('&')
    .toLowerCase()
}

function parseRequestQuery(query: string): QueryState {
  const cache: unknown = qs.parse(query)
  return cache as QueryState
}

function calculatedGroupingIsDisabled<T>(isLoading: boolean, data: Array<T> | undefined): boolean {
  if (isLoading) {
    return true
  }

  return !data || !data.length
}

function calculateIsAllDataSelected<T>(data: Array<T> | undefined, selected: Array<ID>): boolean {
  if (!data) {
    return false
  }

  return data.length > 0 && data.length === selected.length
}

function groupingOnSelect(
  id: ID,
  selected: Array<ID>,
  setSelected: Dispatch<SetStateAction<Array<ID>>>
) {
  if (!id) {
    return
  }

  if (selected.includes(id)) {
    setSelected(selected.filter((itemId) => itemId !== id))
  } else {
    const updatedSelected = [...selected]
    updatedSelected.push(id)
    setSelected(updatedSelected)
  }
}

function groupingOnSelectAll<T>(
  isAllSelected: boolean,
  setSelected: Dispatch<SetStateAction<Array<ID>>>,
  data?: Array<T & {id?: ID}>
) {
  if (isAllSelected) {
    setSelected([])
    return
  }

  if (!data || !data.length) {
    return
  }

  setSelected(data.filter((item) => item.id).map((item) => item.id))
}

// Hook
function useDebounce(value: string | undefined, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export {
  createResponseContext,
  stringifyRequestQuery,
  parseRequestQuery,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  groupingOnSelectAll,
  useDebounce,
  isNotEmpty,
}
