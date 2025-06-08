'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import ReactSiriwave, { IReactSiriwaveProps } from 'react-siriwave'

import { CALL_STATUS } from '../types'

// Define CurveStyle type
type CurveStyle = 'ios' | 'ios9'

interface SiriProps {
  theme: CurveStyle

  audioLevel: number
  callStatus: CALL_STATUS
}

const Siri: React.FC<SiriProps> = ({ theme, audioLevel, callStatus }) => {
  const isSessionActive = callStatus === CALL_STATUS.ACTIVE

  const [siriWaveConfig, setSiriWaveConfig] = useState<IReactSiriwaveProps>({
    theme: theme || 'ios9',
    ratio: 1,
    speed: 0.2,
    amplitude: 1,
    frequency: 6,
    color: theme === 'ios' ? '#000' : '#fff',
    cover: false,
    width: 300,
    height: 100,
    autostart: true,
    pixelDepth: 1,
    lerpSpeed: 0.1,
  })

  useEffect(() => {
    setSiriWaveConfig((prevConfig) => ({
      ...prevConfig,
      amplitude: isSessionActive ? (audioLevel > 0.01 ? audioLevel * 7.5 : 0) : 0,
      speed: isSessionActive ? (audioLevel > 0.5 ? audioLevel * 10 : 0) : 0,
      frequency: isSessionActive ? (audioLevel > 0.01 ? audioLevel * 5 : 0) : audioLevel > 0.5 ? audioLevel * 10 : 0,
    }))
  }, [audioLevel, isSessionActive])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <motion.div
          className="rounded-4xl p-4 overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReactSiriwave {...siriWaveConfig} />
        </motion.div>
      </div>
    </div>
  )
}

export default Siri
