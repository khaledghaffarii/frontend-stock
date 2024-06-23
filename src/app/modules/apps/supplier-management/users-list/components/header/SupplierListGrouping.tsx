import {useQueryClient, useMutation} from 'react-query'
import {QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteSupplier} from '../../core/_requests'
import {useAuth} from '../../../../../auth'
import {useEffect, useRef} from 'react'
import {Modal as BootstrapModal} from 'bootstrap'
const SupplierListGrouping = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {selected, clearSelected} = useListView()
  const queryClient = useQueryClient()
  const {query} = useQueryResponse()

  const deleteSelectedItems = useMutation(() => deleteSupplier(selected, auth?.token ?? ''), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.CLIENTS_LIST}-${query}`])
      clearSelected()
    },
  })
  const modalRef: any = useRef(null)
  const bootstrapModalRef: any = useRef(null) // useRef to store the bootstrap modal instance

  useEffect(() => {
    bootstrapModalRef.current = new BootstrapModal(modalRef.current)
  }, [])

  const handleDeleteClick = () => {
    bootstrapModalRef.current.show()
  }

  const handleConfirmDeleteClick = async () => {
    bootstrapModalRef.current.hide()
    await deleteSelectedItems.mutateAsync()
  }

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>

      <button type='button' className='btn btn-danger' onClick={handleDeleteClick}>
        Delete Selected
      </button>
      <div className='modal' ref={modalRef}>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>Confirmez-vous la suppression définitive ?</h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>

            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Annuller
              </button>
              <button type='button' className='btn btn-danger' onClick={handleConfirmDeleteClick}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {SupplierListGrouping}
