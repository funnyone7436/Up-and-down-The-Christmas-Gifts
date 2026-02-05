import React, { Suspense, useState, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Leva } from 'leva'

import BackgroundSphere from './components/BackgroundSphere'
import CameraController from './components/CameraController'
import AppUI from './components/AppUI'
import Santa from './components/Santa'
import SantaCar from './components/SantaCar'
import SnowEffect from './components/SnowEffect'
import CarSmoke from './components/CarSmoke'
import AudioSyncManager from './components/AudioSyncManager'
// RESTORED: Pose detection for background animation and scoring
import PoseMotionValueDetector from './components/PoseMotionValueDetector'
import SpeechController from './components/SpeechController'

export default function App() {
  const carRef = useRef()
  const santaRef = useRef()
  
  // State for pose-based motion
  const [motionValue, setMotionValue] = useState(0)
  
  // State for voice-controlled car height
  const [carHeight, setCarHeight] = useState(-16)
  
  // State to manage game activity and scoring
  const [isGameActive, setIsGameActive] = useState(true)

  // Use 0 motion once game ends to stop animations/scoring
  const activeMotion = isGameActive ? motionValue : 0

	const handleVoiceCommand = useCallback((command) => {
	  console.log(`🚀 VOICE TRIGGER: Moving SantaCar ${command.toUpperCase()}!`);
	  
	  setCarHeight(prev => {
		if (command === 'up') {
		  // Limit the height to +40
		  return Math.min(prev + 8, 40); 
		}
		if (command === 'down') {
		  // Limit the height to -40
		  return Math.max(prev - 8, -40); 
		}
		return prev;
	  });
	}, []);

  return (
    <>
      <Leva collapsed={true} />
      
      {/* UI receives the motion value for scoring */}
      <AppUI motionValue={activeMotion} isGameActive={isGameActive}/>
      
      {/* Restored Pose Detector */}
      <PoseMotionValueDetector
        onMotionValue={({ motionValue }) => {
          if (isGameActive) setMotionValue(motionValue)
        }}
        debug={false} 
      />

      {/* Voice Controller */}
      <SpeechController onCommandDetected={handleVoiceCommand} />

      <Canvas>
        <PerspectiveCamera makeDefault fov={75} position={[0, 0, 3]} far={2000} />
        <CameraController speed={0.01} initialAngle={Math.PI / 2} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={5} />

        <Suspense fallback={null}>
          <BackgroundSphere />
          
          <AudioSyncManager 
            santaRef={santaRef} 
            motionValue={activeMotion}
            onFirstLoopComplete={() => setIsGameActive(false)}
          >
            <Santa 
              ref={santaRef}
              radius={90} 
              angle={Math.PI-Math.PI/9} 
              height={-15} 
              scale={.55} 
              rotationOffset={-Math.PI/10}
              motionValue={activeMotion} 
            />
          </AudioSyncManager>

          <SantaCar 
            ref={carRef} 
            radius={85} 
            y={carHeight} 
            scale={1.2} 
            santaScale={2.4} 
            motionValue={activeMotion}
          />
          <CarSmoke carRef={carRef} motionValue={activeMotion} />
          <SnowEffect motionValue={activeMotion} />
        </Suspense>
      </Canvas>
    </>
  )
}