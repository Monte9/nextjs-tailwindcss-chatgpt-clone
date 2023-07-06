import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import MobileSiderbar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  useEffect(() => {
  }, []);

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };
  const starterMessage = "The site is still under construction. Doing some wicked prompt engineering. Check back soon"
  const systemMessage = "Respond with a joke and also tell them to check the website soon because it's still under construction."

  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      {isComponentVisible ? (
        <MobileSiderbar toggleComponentVisibility={toggleComponentVisibility} />
        ) : null}
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col ">
          <Sidebar />
        </div>
      </div>
      <Chat StartMessage = {starterMessage} toggleComponentVisibility={toggleComponentVisibility} SystemPrompt= {systemMessage}/>
    </main>
  );
}
