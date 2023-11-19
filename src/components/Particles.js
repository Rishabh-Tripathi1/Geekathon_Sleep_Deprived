import React, { useMemo, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import particlesConfig from '../config/particlesconfig.js';

const ParticlesComponent = () => {
  const options = useMemo(() => {
    return particlesConfig;
  }, [particlesConfig]);

  const particlesInit = useCallback((engine) => {
    loadSlim(engine);
  }, []);

  return <Particles init={particlesInit} options={options} />;
};

export default ParticlesComponent;
