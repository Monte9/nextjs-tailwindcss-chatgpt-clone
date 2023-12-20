import { useEffect, useRef, useState } from "react";
import { FiImage, FiSend } from "react-icons/fi";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "./Message";
import { GEMINI_PRO_MODEL, GEMINI_PRO_VISION_MODEL, GEMINI_MODELS } from "@/shared/Constants";
import Image from "next/image";
import gemini from "../services/gemini";
import { tutorialTxt } from "@/utils/conversations/tutorialFirstAccess";
import { Image64 } from "../types/Image";
import { Conversation } from "@/types/Conversation";
import { GeminiHandler } from "@/types/GeminiHandler";

const Chat = (props: any) => {
  const { toggleComponentVisibility, I18nDictionary, apiKey, handleApiKey, startCommand } = props;
  const i18n: I18nDictionary = I18nDictionary;

  const defaultApiKey = "AIzaSyBdjNFJDMh3-VY8APOYt2Lc6hh_RA5oyBs";
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [message, setMessage] = useState((typeof startCommand == 'string') ? startCommand : "");
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const [avaliableModels] = useState(GEMINI_MODELS.filter(x => x.available));
  const [selectedModel, setSelectedModel] = useState(GEMINI_PRO_MODEL);
  const [base64Images, setBase64Images] = useState<Image64[]>([]);
  const [inputImages, setInputImages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof startCommand == 'string') {
      sendMessage().then();
    }
  }, [])

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message, textAreaRef]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);


  const getImageMimeType = (image: any): string => {
    const blob = image instanceof Blob ? image : new Blob([image]);
    const type = blob.type;
    return type;
  };

  const convertImageToBase64 = (image: any): Promise<Image64> => {
    return new Promise((resolve) => {

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64Image = e.target.result.replace(/^data:image\/[a-z]+;base64,/, '');
        const mimeType = getImageMimeType(image);
        resolve({
          base64: base64Image,
          mimeType
        })
      };

      reader.readAsDataURL(image);
    });
  };


  const handleChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const images = [];
      const inputImages = [];
      for (const file of e.target.files) {
        const base64 = await convertImageToBase64(file);
        images.push(base64);
        inputImages.push(URL.createObjectURL(file));
      }

      setBase64Images(images);
      setInputImages(inputImages);
    }
  };

  const fileInputRef = useRef<any>();
  const handleFileButtonClick = (e: any) => {
    e.preventDefault();
    fileInputRef?.current?.click();
  };

  const sendMessage = async (e?: any) => {
    e?.preventDefault();

    if (!message?.length && !base64Images?.length) {
      setErrorMessage(i18n.PLEASE_ENTER_MESSAGE_OR_IMAGE);
      return;
    } else {
      setErrorMessage("");
    }

    setIsLoading(true);

    const imagesChat = base64Images.map(image => {
      return { image: image, role: "user" };
    });
    // Add the message to the conversation
    setConversation([
      ...conversation,
      message ? { parts: message, role: "user" } : {},
      ...imagesChat,
      { parts: null, role: "system" },
    ]);

    setMessage("");
    setShowEmptyChat(false);
    setInputImages([]);

    try {
      const geminiHandler = {
        historyMessages: [...conversation, ...imagesChat],
        message: { parts: message, role: "user" },
        model: selectedModel,
        apiKey: apiKey || defaultApiKey,
      } as GeminiHandler;
      geminiHandler.hasImages = !!(geminiHandler.historyMessages.filter(x => x.image).length || geminiHandler.message.image);
      setSelectedModel(geminiHandler.hasImages ? GEMINI_PRO_VISION_MODEL : GEMINI_PRO_MODEL);

      await gemini(geminiHandler, (text: string) => {
        setConversation([
          ...conversation,
          message ? { parts: message, role: "user" } : {},
          ...imagesChat,
          { parts: text, role: "model" },
        ]);
      })

      setIsLoading(false);
    } catch (error: any) {
      if (!apiKey) {
        setConversation([
          ...conversation,
          { parts: tutorialTxt, role: "system" },
        ]);
      }
      console.error(error);
      setErrorMessage(error.message);

      setIsLoading(false);
    }

    if (conversation.length > 8 && conversation.length % 4 && !apiKey) {
      setConversation([
        ...conversation,
        { parts: tutorialTxt, role: "system" },
      ]);
    }

    setBase64Images([]);
  };

  const handleKeypress = (e: any) => {
    // It's triggers by pressing the enter key
    if (e.keyCode == 13 && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
  };


  const close = () => {
    setIsOpen(false);
  };

  const onModelSelect = (model: any) => {
    setSelectedModel(model);
  }

  const getLastIndexArray = (array: any, id: number): boolean => {
    return array.length - 1 === id
  }

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="sticky top-0 z-10 flex items-center border-b border-white/20 pl-1 pt-1 text-white sm:pl-3 md:hidden bg-cyan-950 ">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white"
          onClick={toggleComponentVisibility}
        >
          <span className="sr-only">Open sidebar</span>
          <RxHamburgerMenu className="h-6 w-6 text-white" />
        </button>
        <h1 className="flex-1 text-center text-base font-normal">{i18n.NEW_CHAT}</h1>
        <button type="button" className="px-3">
          <BsPlusLg className="h-6 w-6" />
        </button>
      </div>
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full dark:bg-sky-900">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
              {!showEmptyChat && conversation.length > 0 ? (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div
                    className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
                    Model: {selectedModel.name}
                  </div>
                  {conversation.filter(x => x.type != "command" && x.role).map((message, index: number) => (
                    <Message
                      key={index}
                      id={index}
                      message={message}
                      isLoading={isLoading}
                      isLast={getLastIndexArray(conversation, index)}
                    />
                  ))
                  }
                  <div ref={bottomOfChatRef}></div>
                  <div className="w-full h-32 md:h-48 flex-shrink-0 bg-sky-900"></div>
                </div>
              ) : null}
              {showEmptyChat ? (
                <div className="py-10 relative w-full flex flex-col h-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                      <button
                        className="relative flex w-full cursor-default flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-cyan-950 sm:text-sm align-center"
                        id="headlessui-listbox-button-:r0:"
                        type="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        onClick={() => setIsOpen(!isOpen)}
                        aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                      >
                        <label
                          className="block text-xs text-gray-700 dark:text-gray-500 text-center"
                          id="headlessui-listbox-label-:r1:"
                          data-headlessui-state=""
                        >
                          {i18n.MODEL}
                        </label>
                        <span className="inline-flex w-full truncate">
                          <span className="flex h-6 items-center gap-1 truncate text-white">
                            {selectedModel.name}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <BsChevronDown className="h-4 w-4 text-gray-400" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="absolute z-10 top-14 w-full bg-white dark:bg-gray-800 shadow-md rounded-md">
                          <ul className="py-1">
                            {avaliableModels.map((model) => (
                              <li
                                key={model.id}
                                className="text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                  onModelSelect(model);
                                  close();
                                }}
                              >
                                <span className="block py-2 px-4 truncate">{model.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <h1 className="text-2xl drop-shadow-xl shadow-white sm:text-4xl font-semibold text-center text-gray-200 dark:text-white flex gap-2 items-center justify-center h-screen animate-pulse">
                    Gemini
                  </h1>
                </div>
              ) : null}
              <div className="flex flex-col items-center text-sm dark:bg-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-cyan-950 md:!bg-transparent pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage ? (
                <div className="mb-2 md:mb-0">
                  <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-white/10 bg-white dark:border-white/50 dark:text-white dark:bg-cyan-950 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <div className='flex justify-end'>
                  <textarea
                    ref={textAreaRef}
                    value={message}
                    tabIndex={0}
                    data-id="root"
                    style={{
                      height: "24px",
                      maxHeight: "200px",
                      overflowY: "hidden",
                    }}
                    // rows={1}
                    placeholder={i18n.SEND_MESSAGE}
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeypress}
                  ></textarea>
                  <div style={{ display: "flex" }}>
                    {inputImages && inputImages.length > 0 && (
                      <div style={{ display: "flex" }}>
                        {inputImages.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            style={{ maxWidth: "150px", margin: "5px" }}
                            width="300" height="500"
                            alt={`Preview ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    disabled={isLoading || !(message?.length || base64Images?.length)}
                    onClick={sendMessage}
                    className="mr-1 p-1 rounded-md bg-transparent disabled:bg-gray-500 justify-self-end right-1 md:right-12 disabled:opacity-40">
                    <FiSend className="h-4 w-4 mr-1 text-white " />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleChange}
                    accept=".png, .jpg, .jpeg"
                    multiple
                  />
                  <button
                    disabled={isLoading}
                    onClick={handleFileButtonClick}
                    className="mr-1 p-1 rounded-md bg-transparent disabled:bg-gray-500 justify-self-end right-1 md:right-12 disabled:opacity-40">
                    <FiImage className="h-4 w-4 mr-1 text-white " />
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>
              {i18n.GEMINI_INFORMATION}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
