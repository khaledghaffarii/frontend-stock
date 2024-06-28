import {ID, Response} from '../../../../../../_metronic/helpers'

export type Achat = {
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
  supplier_id?: {
    id: any
    address?: string
    email?: string
    company?: string
    fullname?: string
    status?: string
    phone?: string
  }
  quantity?: any
  unitPurchasePrice?: any | undefined
  tva: number
  totalPurchasePrice?: number
  createdAt?: Date
  updatedAt?: Date
}
export type AchatsQueryResponse = Response<Array<Achat>>
