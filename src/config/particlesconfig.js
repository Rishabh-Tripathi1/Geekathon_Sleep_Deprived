const particlesConfig = {
  background: {
    color: {
      value: "#05060a",
    },
  },
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: false,
        mode: [],
      },
      onHover: {
        enable: true,
        mode: [],
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 200,
        duration: 2,
        size: 0,
        opacity: 0,
      },
      push: {
        particles_nb: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#470868",
    },
    links: {
      color: "#fff",
      distance: 100,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: false,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 0.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      options: {
        polygon: {
          sides: 6,
        },
      },
      type: "polygon",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

export default particlesConfig;
