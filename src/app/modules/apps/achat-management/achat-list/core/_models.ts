import {ID, Response} from '../../../../../../_metronic/helpers'

export type Achat = {
  id?: ID
  name?: string
  product: any
  product_id?: {
    id: any
    name: any
    quantity?: number
    minimalQuantity?: number
    priceSale?: number
    category?: any
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
  quantity?: number
  unitPurchasePrice?: number
  totalPurchasePrice?: number
  createdAt?: Date
  updatedAt?: Date
}
export type AchatsQueryResponse = Response<Array<Achat>>
