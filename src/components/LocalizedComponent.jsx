// Exemple de localisation d'un composant
import { useTranslation } from 'react-i18next';

const LocalizedComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
    </div>
  );
};

export default LocalizedComponent;