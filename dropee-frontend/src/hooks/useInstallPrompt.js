import { useEffect, useMemo, useState } from 'react';

const isStandaloneMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
};

const isIosSafari = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(userAgent);
  const isWebkit = /WebKit/.test(userAgent);
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS/.test(userAgent);
  return isIos && isWebkit && !isOtherBrowser;
};

const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneMode());
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setShowIosHint(false);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const syncStandalone = () => setIsInstalled(isStandaloneMode());

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    mediaQuery.addEventListener('change', syncStandalone);

    syncStandalone();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      mediaQuery.removeEventListener('change', syncStandalone);
    };
  }, []);

  const canInstall = useMemo(() => !isInstalled && Boolean(deferredPrompt), [isInstalled, deferredPrompt]);
  const canShowIosHint = useMemo(() => !isInstalled && !deferredPrompt && isIosSafari(), [isInstalled, deferredPrompt]);

  const promptInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }

    if (canShowIosHint) {
      setShowIosHint((current) => !current);
    }
  };

  const dismissIosHint = () => setShowIosHint(false);

  return {
    canInstall,
    canShowIosHint,
    isInstalled,
    promptInstall,
    showIosHint,
    dismissIosHint,
  };
};

export default useInstallPrompt;