// Ajout de points de rupture pour la responsivité
const breakpoints = {
  xs: '@media (max-width: 600px)',
  sm: '@media (min-width: 600px) and (max-width: 960px)',
  md: '@media (min-width: 960px) and (max-width: 1280px)',
  lg: '@media (min-width: 1280px) and (max-width: 1920px)',
  xl: '@media (min-width: 1920px)'
};

const responsiveStyles = {
  container: {
    width: '100%',
    padding: '16px',
    [breakpoints.xs]: {
      padding: '8px'
    },
    [breakpoints.sm]: {
      padding: '12px'
    }
  },
  text: {
    fontSize: '1rem',
    [breakpoints.xs]: {
      fontSize: '0.875rem'
    },
    [breakpoints.lg]: {
      fontSize: '1.125rem'
    }
  }
};

export { breakpoints, responsiveStyles };