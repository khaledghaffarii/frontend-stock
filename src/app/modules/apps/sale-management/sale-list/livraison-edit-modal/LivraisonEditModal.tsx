import {useEffect} from 'react'

import {LivraisonEditModalFormWrapper} from './LivraisonEditModalFormWrapper'
import {LivraisonEditModalHeader} from './LivraisonEditModalHeader'

const LivraisonEditModal = () => {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  return (
    <>
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* begin::Modal dialog */}
        <div className='m-5 mw-1050px'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <LivraisonEditModalHeader />
            {/* begin::Modal body */}
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7 w-100'>
              <LivraisonEditModalFormWrapper />
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className='modal-backdrop fade show'></div>
      {/* end::Modal Backdrop */}
    </>
  )
}

export {LivraisonEditModal}
