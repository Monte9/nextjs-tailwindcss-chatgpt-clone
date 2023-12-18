import Image from "next/image";
import { BsRobot } from "react-icons/bs";
import { HiUser } from "react-icons/hi";
import { TbCursorText } from "react-icons/tb";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const Message = (props: any) => {
  const { message } = props;
  const { role, parts: text } = message;

  const isUser = role === "user";

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${isUser ? "dark:bg-sky-900" : "bg-gray-50 dark:bg-sky-700"
        }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
        <div className="flex flex-row gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 lg:px-0 m-auto w-full">
          <div className="w-8 flex flex-col relative items-end">
            <div className="relative h-10 w-10 p-2 rounded-3xl text-white flex items-center justify-center bg-cyan-950 text-opacity-100r">
              {isUser ? (
                <HiUser className="h-4 w-4 text-white" />
              ) : (
                <BsRobot className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="text-xs flex items-center justify-center gap-1 absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible !invisible">
              <button
                disabled
                className="text-gray-300 dark:text-gray-400"
              ></button>
              <span className="flex-grow flex-shrink-0">1 / 1</span>
              <button
                disabled
                className="text-gray-300 dark:text-gray-400"
              ></button>
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                <div className="markdown prose w-full break-words dark:prose-invert dark">
                  {!isUser && text === null ? (
                    <TbCursorText className="h-6 w-6 animate-pulse" />
                  ) : (
                    text.startsWith('blob:') ? (
                      <Image
                        style={{ maxWidth: "150px", margin: "5px" }}
                        width="300" height="500" 
                        src={text}
                        alt="Imagem"
                      />
                    ) : (
                      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
