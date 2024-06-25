import {useQuery} from 'react-query'
import {ProductEditModalForm} from './ProductEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getProductById} from '../core/_requests'
import {useAuth} from '../../../../auth'

const ProductEditModalFormWrapper = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: product,
    error,
  } = useQuery(
    `${QUERIES.PRODUCT_LIST}-user-${itemIdForUpdate}`,
    () => {
      if (itemIdForUpdate && token) {
        return getProductById(itemIdForUpdate, token)
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
    return <ProductEditModalForm isUserLoading={isLoading} product={{id: undefined}} />
  }

  if (!isLoading && !error && product) {
    return <ProductEditModalForm isUserLoading={isLoading} product={product} />
  }

  return null
}

export {ProductEditModalFormWrapper}

// const {
//   isLoading,
//   data: client,
//   error,
// } = useQuery(
//   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
//   () => {
//     return getProductById(itemIdForUpdate, token))
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
