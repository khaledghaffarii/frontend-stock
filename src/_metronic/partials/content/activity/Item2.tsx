import React, {FC, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'

const Item2: FC = () => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className='timeline-item'>
      <div className='timeline-line w-40px'></div>

      <div
        className='timeline-icon symbol symbol-circle symbol-40px'
        onClick={toggleDetails}
        style={{cursor: 'pointer'}}
      >
        <div className='symbol-label bg-light'>
          <KTSVG
            path='/media/icons/duotune/communication/com009.svg'
            className='svg-icon-2 svg-icon-gray-500'
          />
        </div>
      </div>

      <div className='timeline-content mb-10 mt-n2 '>
        <div className='overflow-auto pe-3'>
          <button onClick={toggleDetails} className='fs-5 fw-bold mt-5 border-0'>
            Appel #12345 : 12-juin-2022
          </button>
          {showDetails && (
            <div className='mt-3'>
              <div className='d-flex align-items-center mt-1 fs-6'>
                <div className='text-muted me-2 fs-5'>Télé conseiller:</div>
                <div className='d-flex align-items-center'>
                  <div className='symbol symbol-circle symbol-25px me-2'>
                    <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='img' />
                  </div>
                  <div className='fs-5'>Alan Nilson</div>
                </div>
              </div>
              <div className='d-flex align-items-center mt-1 fs-6'>
                <div className='text-muted me-2 fs-5'>Date de l'appel:</div>
                <div className='fs-5'>15 juin 2024 à 14:23</div>
              </div>
              <div className='d-flex align-items-center mt-1 fs-6'>
                <div className='text-muted me-2 fs-5'>Durée de l'appel:</div>
                <div className='fs-5'>15 min et 20s</div>
              </div>

              <div className='d-flex align-items-center mt-1 fs-6'>
                <div className='text-muted me-2 fs-5'>Statut:</div>
                <div className='fs-5'>Vendu</div>
              </div>
              <div className='d-flex flex-column  mt-1 fs-6'>
                <div className='text-muted me-2 fs-5 text-start'>Note :</div>
                <div className='fs-6 mt-2'>
                  is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                  been the industry's standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type specimen book. It
                  has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export {Item2}
