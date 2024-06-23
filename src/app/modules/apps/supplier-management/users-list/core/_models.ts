import {ID, Response} from '../../../../../../_metronic/helpers'
export type Supplier = {
  address?: string
  createdAt?: Date
  email?: string
  company?: string
  fullname?: string
  id?: ID
  status?: string
  phone?: string
  updatedAt?: Date
}

export type SuppliersQueryResponse = Response<Array<Supplier>>

export const initialSupplier: Supplier = {
  // avatar: 'avatars/300-6.jpg',
  // position: 'Art Director',
  // role: 'Administrator',
  // name: '',
  // email: '',
}
