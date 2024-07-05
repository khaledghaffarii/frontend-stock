import {FC, useEffect, useState} from 'react'
import {useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../_metronic/assets/ts/components'
import {ID, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {updateSale} from '../../core/_requests'
import {useAuth} from '../../../../../auth'
import {Button, Modal, Spinner, Form} from 'react-bootstrap'
import {SaleListLoading} from '../../components/loading/SaleListLoading'

type Props = {
  id: Array<ID>
}

const SaleActionsCell: FC<Props> = ({id}) => {
  const {setItemIdForUpdate} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  const {currentUser, auth} = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)

  const handleShowModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const token: any = auth?.token

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const handleConversion = async (newStatus: number | null) => {
    if (newStatus === null) return
    setLoading(true)

    try {
      //@ts-ignore
      await updateSale(id, {status: newStatus}, token)
      console.log(`Conversion en ${newStatus} réussie pour la vente avec ID: ${id}`)

      queryClient.invalidateQueries([`${QUERIES.CLIENTS_LIST}-${query}`])
      handleCloseModal()
    } catch (error) {
      console.error('Erreur lors de la conversion de statut :', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant='link' className='text-primary mx-5' onClick={handleShowModal}>
        Convertir
      </Button>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Convertir le document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Convertir Devis en :</p>
          <div className='d-flex flex-row p-3'>
            <div className='form-check mb-2 px-8'>
              <input
                className='form-check-input'
                type='radio'
                name='status'
                id='status0'
                value='0'
                checked={selectedStatus === 0}
                onChange={() => setSelectedStatus(0)}
              />
              <label className='form-check-label text-dark' htmlFor='status0'>
                Facture
              </label>
            </div>
            <div className='form-check mb-2 px-8'>
              <input
                className='form-check-input'
                type='radio'
                name='status'
                id='status1'
                value='1'
                checked={selectedStatus === 1}
                onChange={() => setSelectedStatus(1)}
              />
              <label className='form-check-label text-dark' htmlFor='status1'>
                Bon de livraison
              </label>
            </div>
            <div className='form-check mb-2 px-8'>
              <input
                className='form-check-input'
                type='radio'
                name='status'
                id='status2'
                value='2'
                checked={selectedStatus === 2}
                onChange={() => setSelectedStatus(2)}
              />
              <label className='form-check-label text-dark' htmlFor='status2'>
                Bon de commande
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() => handleConversion(selectedStatus)}
            disabled={selectedStatus === null || loading}
          >
            {loading ? <SaleListLoading /> : 'Valider'}
          </Button>
          <Button variant='secondary' onClick={handleCloseModal}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {SaleActionsCell}
