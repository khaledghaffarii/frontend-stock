import {useListView} from '../../core/ListViewProvider'
import {CategoryListToolbar} from './CategoryListToolbar'
import {CategoryListGrouping} from './CategoryListGrouping'
import {CategoryListSearchComponent} from './CategoryListSearchComponent'

const CategoryListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <CategoryListSearchComponent />

      <div className='card-toolbar'>
        {selected.length > 0 ? <CategoryListGrouping /> : <CategoryListToolbar />}
      </div>
    </div>
  )
}

export {CategoryListHeader}
