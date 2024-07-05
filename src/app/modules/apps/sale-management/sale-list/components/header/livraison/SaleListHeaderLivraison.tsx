import {useListView} from '../../../core/ListViewProvider'
import {SaleListGroupingLivraison} from './SaleListGroupingLivraison'

import {SaleListSearchLivraison} from './SaleListSearchLivraison'

import {SaleListToolbarLivraison} from './SaleListToolbarLivraison'

const SaleListHeaderLivraison = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <SaleListSearchLivraison />

      <div className='card-toolbar'>
        {selected.length > 0 ? <SaleListGroupingLivraison /> : <SaleListToolbarLivraison />}
      </div>
    </div>
  )
}

export {SaleListHeaderLivraison}
