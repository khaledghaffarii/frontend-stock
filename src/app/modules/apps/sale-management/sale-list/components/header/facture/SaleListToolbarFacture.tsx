import {KTSVG} from '../../../../../../../../_metronic/helpers'
import {useListView} from '../../../core/ListViewProvider'

const SaleListToolbarFacture = () => {
  const {setItemIdForUpdate} = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
        Facture
      </button>
    </div>
  )
}

export {SaleListToolbarFacture}
