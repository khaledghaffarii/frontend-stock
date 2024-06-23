import {useQuery} from 'react-query'
import {SupplierEditModalForm} from './SupplierEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getSupplierById} from '../core/_requests'
import {useAuth} from '../../../../auth'

const SupplierEditModalFormWrapper = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: supplier,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      if (itemIdForUpdate && token) {
        return getSupplierById(itemIdForUpdate, token)
      }
      return Promise.reject('Item ID or token is missing')
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )
  if (!itemIdForUpdate) {
    return <SupplierEditModalForm isUserLoading={isLoading} supplier={{id: undefined}} />
  }

  if (!isLoading && !error && supplier) {
    return <SupplierEditModalForm isUserLoading={isLoading} supplier={supplier} />
  }

  return null
}

export {SupplierEditModalFormWrapper}

// const {
//   isLoading,
//   data: supplier,
//   error,
// } = useQuery(
//   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
//   () => {
//     return getSupplierById(itemIdForUpdate, token))
//   },
//   {
//     cacheTime: 0,
//     enabled: enabledQuery,
//     onError: (err) => {
//       setItemIdForUpdate(undefined)
//       console.error(err)
//     },
//   }
// )
