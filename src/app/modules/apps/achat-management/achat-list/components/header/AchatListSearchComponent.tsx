import {useEffect, useState} from 'react'
import {
  ExportModal,
  KTSVG,
  exportExcel,
  exportPDF,
  stringifyRequestQuery,
  useDebounce,
} from '../../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse, useQueryResponseData} from '../../core/QueryResponseProvider'
import {createMultipleAchats, getAchat} from '../../core/_requests'
import {useAuth} from '../../../../../auth'
import {AchatListLoading} from '../loading/AchatListLoading'

const AchatListSearchComponent = () => {
  const {updateState} = useQueryRequest()
  const {refetch} = useQueryResponse()
  const clients = useQueryResponseData()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false) // État de chargement
  const {currentUser, auth} = useAuth()
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  const [data, setData] = useState<any>({})
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getAchat(query, token)
          //@ts-ignore
          setData(data?.data)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [])

  const handleExport = (format: any) => {
    if (format === 'pdf') {
      exportPDF(clients)
    } else if (format === 'excel') {
      exportExcel(clients)
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      updateState({search: debouncedSearchTerm})
    }
  }, [debouncedSearchTerm])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true) // Début du chargement
      try {
        const token: any = auth?.token // Récupérez le token d'authentification
        await createMultipleAchats(file, token)
        await refetch() // Rafraîchit les données après importation
      } catch (error) {
        console.log('🚀 ~ handleFileChange ~ error:', error)
        console.error("Erreur lors de l'importation des clients:", error)
      } finally {
        setIsLoading(false) // Fin du chargement
      }
    }
  }

  return (
    <div className='d-flex flex-md-row w-75 justify-content-between'>
      {isLoading && <AchatListLoading />} {/* Affichage de l'indicateur de chargement */}
      <div className='mt-2 mx-5'>
        <button
          disabled={Object.keys(data).length == 0 ? true : false}
          type='button'
          className='btn btn-light-primary me-3'
          onClick={() => setIsModalOpen(true)}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
          Export
        </button>
        <label className='btn btn-light-primary me-3'>
          <KTSVG path='/media/icons/duotune/arrows/arr077.svg' className='svg-icon-2' />
          Import
          <input
            type='file'
            accept='.xlsx, .xls'
            onChange={handleFileChange}
            style={{display: 'none'}}
          />
        </label>
      </div>
      <div className='d-flex align-items-center position-relative my-1'>
        <KTSVG
          path='/media/icons/duotune/general/gen021.svg'
          className='svg-icon-1 position-absolute ms-6'
        />
        <input
          type='text'
          data-kt-user-table-filter='search'
          className='form-control form-control-solid w-750px ps-14'
          placeholder='Search Client'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ExportModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  )
}

export {AchatListSearchComponent}
