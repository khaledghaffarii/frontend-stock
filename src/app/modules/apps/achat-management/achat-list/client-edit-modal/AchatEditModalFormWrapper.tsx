import {useQuery} from 'react-query'
import {AchatEditModalForm} from './AchatEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getAchatById} from '../core/_requests'
import {useAuth} from '../../../../auth'

const AchatEditModalFormWrapper = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: achat,
    error,
  } = useQuery(
    `${QUERIES.ACHAT_LIST}-user-${itemIdForUpdate}`,
    () => {
      if (itemIdForUpdate && token) {
        return getAchatById(itemIdForUpdate, token)
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
    //@ts-ignore
    return <AchatEditModalForm isUserLoading={isLoading} achat={{id: undefined}} />
  }

  if (!isLoading && !error && achat) {
    return <AchatEditModalForm isUserLoading={isLoading} achat={achat} />
  }

  return null
}

export {AchatEditModalFormWrapper}

// const {
//   isLoading,
//   data: client,
//   error,
// } = useQuery(
//   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
//   () => {
//     return getAchatById(itemIdForUpdate, token))
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
