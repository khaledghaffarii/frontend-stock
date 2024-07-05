import {useListView} from '../../../core/ListViewProvider'
import {SaleListGroupingCommande} from './SaleListGroupingCommande'
import {SaleListSearchCommande} from './SaleListSearchCommande'
import {SaleListToolbarCommande} from './SaleListToolbarCommande'

const SaleListHeaderCommande = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <SaleListSearchCommande />

      <div className='card-toolbar'>
        {selected.length > 0 ? <SaleListGroupingCommande /> : <SaleListToolbarCommande />}
      </div>
    </div>
  )
}

export {SaleListHeaderCommande}
