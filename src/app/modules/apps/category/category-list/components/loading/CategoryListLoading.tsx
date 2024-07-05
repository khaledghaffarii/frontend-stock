import React, {useEffect} from 'react'
import {useLottie} from 'lottie-react'
import Loading from '../../../../../../../animations/Animation - 1720110796306.json'

const CategoryListLoading = () => {
  const styles: any = {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(10px)', // Ajoute un flou à l'arrière-plan
      zIndex: 9998,
    },
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    lottie: {
      maxWidth: '5%',
      maxHeight: '5%',
      backgroundColor: 'transparent',
    },
  }

  const options = {
    animationData: Loading,
    loop: true,
    autoplay: true,
  }

  const {View} = useLottie(options)

  return (
    <>
      <div style={styles.backdrop} />
      <div style={styles.container}>
        <div style={styles.lottie}>{View}</div>
      </div>
    </>
  )
}

export {CategoryListLoading}
