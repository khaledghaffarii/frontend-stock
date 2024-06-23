import {useListView} from '../../core/ListViewProvider'
import {SupplierListToolbar} from './SupplierListToolbar'
import {SupplierListGrouping} from './SupplierListGrouping'
import {SupplierListSearchComponent} from './SupplierListSearchComponent'

const SupplierListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <SupplierListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <SupplierListGrouping /> : <SupplierListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {SupplierListHeader}
