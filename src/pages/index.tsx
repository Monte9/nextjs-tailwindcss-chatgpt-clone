import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import MobileSiderbar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";
import Message from "@/components/Message";

export default function Home() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  useEffect(() => {
  }, []);

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };
  const starterMessage = "Welcome to ShreyasGPT! Go to different chats to learn about different parts of my life and ask questions. If you don't find what you're looking for, feel free to just email me or text me."
  const systemMessage = "Just respond in Spanish with some jokes."

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

// hopefully this works