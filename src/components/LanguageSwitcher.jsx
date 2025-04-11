import { useTranslation } from 'react-i18next';

// Ajout de la fonctionnalité de changement de langue
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}