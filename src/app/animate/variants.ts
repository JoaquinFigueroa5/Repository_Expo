export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.35, delay: i * 0.06 } }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, damping: 26, stiffness: 320, mass: 0.8 } },
  exit: { opacity: 0, scale: 0.93, y: 8, transition: { duration: 0.18, ease: "easeIn" } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -14 },
  visible: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.4, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] } }),
};

export const slideRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const viewTransition = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: "easeIn" } },
};

export const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const toastVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.88 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 20, stiffness: 360 } },
  exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } },
};
