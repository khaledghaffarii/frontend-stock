import {ID, Response} from '../../../../../../_metronic/helpers'

export type Sale = {
  id?: ID
  name?: string
  product: any
  refInvoice: any
  product_id?: {
    id: any
    name: any
    quantity?: any
    minimalQuantity?: number
    priceSale?: number
    category?: any
    tva?: any
  }
  client?: any
  client_id?: {
    id: any
    address?: string
    email?: string
    company?: string
    fullname?: string
    status?: string
    phone?: string
  }
  quantity?: any
  status?: any
  tva: number
  totalSalePrice?: number
  saleDate?: Date
  createdAt?: Date
  updatedAt?: Date
}
export type SalesQueryResponse = Response<Array<Sale>>
