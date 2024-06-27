import {ID, Response} from '../../../../../../_metronic/helpers'

export type Product = {
  id?: ID
  name?: string
  category_id?: {
    id: any
    name: any
  }
  color?: string
  category?: any
  quantity?: number
  minimalQuantity?: number
  priceSale?: number
  createdAt?: Date
  updatedAt?: Date
}
export type ProductsQueryResponse = Response<Array<Product>>
