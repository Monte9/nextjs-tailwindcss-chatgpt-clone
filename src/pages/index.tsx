import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import MobileSiderbar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";
import { i18nDictEn } from "../utils/translate/i18n-en";
import { i18nDictPt } from "../utils/translate/i18n-pt";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [i18n, setI18n] = useState(i18nDictEn);
  const [apiKey, setApiKey] = useState<any>();

  useEffect(() => {
    const preferredLanguage = navigator.language.split('-')[0];
    if (['pt'].includes(preferredLanguage))
      setI18n(i18nDictPt);
  });

    useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      handleApiKey(apiKey);
    }
  }, []);

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const handleApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("apiKey", key);
  } 

  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      {isComponentVisible ? (
        <MobileSiderbar toggleComponentVisibility={toggleComponentVisibility} I18nDictionary={i18n} apiKey={apiKey} handleApiKey={handleApiKey} />
      ) : null}
      <div className="dark hidden flex-shrink-0 bg-sky-950 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col ">
          <Sidebar I18nDictionary={i18n} apiKey={apiKey} handleApiKey={handleApiKey} />
        </div>
      </div>
      <Chat toggleComponentVisibility={toggleComponentVisibility} I18nDictionary={i18n} apiKey={apiKey} handleApiKey={handleApiKey} />
      <Analytics />
    </main>
  );
}
