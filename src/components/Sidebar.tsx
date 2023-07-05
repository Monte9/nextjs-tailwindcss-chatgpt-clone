import React from "react";
import {
  AiOutlineMessage,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { FiMessageSquare } from "react-icons/fi";
import {MdPhone} from "react-icons/md";
import { SiLinkedin } from "react-icons/si";
import { SiGithub } from "react-icons/si";
import { SiTwitter } from "react-icons/si";
import { SiMedium } from "react-icons/si";
import Link from 'next/link'




const Sidebar = () => {
  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <a href="mailto:sparab22alumni.stanford.edu" target="_blank" className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
          <AiOutlinePlus className="h-4 w-4" />
          Chat with Human
        </a>
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
          <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
            <Link href='/' legacyBehavior>
            <a className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
              <FiMessageSquare className="h-4 w-4" />
              <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                Biographical
                <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
              </div>
            </a>
            </Link>
            <Link href='/writings' legacyBehavior>
            <a className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
              <FiMessageSquare className="h-4 w-4" />
              <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                Writings/Talks
                <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
              </div>
            </a>
            </Link>
            <Link href='/pastProjects' legacyBehavior>
            <a className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
              <FiMessageSquare className="h-4 w-4" />
              <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                Past Projects
                <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
              </div>
            </a>
            </Link>
            <Link href='/funFacts' legacyBehavior>
            <a href="src/components/Resume.tsx" className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
              <FiMessageSquare className="h-4 w-4" />
              <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                Fun Facts
              </div>
            </a>
            </Link>

          </div>
        </div>
        <a href="https://twitter.com/sparab22" target = "_blank" className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <SiLinkedin className="h-4 w-4" />
          LinkedIn
        </a>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <SiGithub className="h-4 w-4" />
          GitHub
        </a>
        <a href="https://twitter.com/sparab22" target = "_blank" className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <SiTwitter className="h-4 w-4" />
          Twitter
        </a>
        <a
          href="https://medium.com/@sparab18"
          target="_blank"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <SiMedium className="h-4 w-4" />
          Blog
        </a>
        <a href="tel:+16404009871" target= "_blank" className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <MdPhone className="h-4 w-4" />
          Text me
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;


