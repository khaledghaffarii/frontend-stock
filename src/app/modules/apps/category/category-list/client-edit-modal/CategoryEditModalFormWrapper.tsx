import {useQuery} from 'react-query'
import {CategoryEditModalForm} from './CategoryEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getCategoryById} from '../core/_requests'
import {useAuth} from '../../../../auth'

const CategoryEditModalFormWrapper = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: category,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      if (itemIdForUpdate && token) {
        return getCategoryById(itemIdForUpdate, token)
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
    return <CategoryEditModalForm isUserLoading={isLoading} category={{id: undefined}} />
  }

  if (!isLoading && !error && category) {
    return <CategoryEditModalForm isUserLoading={isLoading} category={category} />
  }

  return null
}

export {CategoryEditModalFormWrapper}

// const {
//   isLoading,
//   data: client,
//   error,
// } = useQuery(
//   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
//   () => {
//     return getCategoryById(itemIdForUpdate, token))
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
