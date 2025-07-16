"use client";
import React from "react";
import { useRef, useState, useEffect, ChangeEvent, KeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { Icon } from "@iconify/react";
import Welcome from "@/components/Welcome";
import MessageBubble from "@/components/MessageBubble";

export default function Content() {
  // Create a ref for the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaValue, setQueryValue] = useState("");

  // State for resizable panels
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea function
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";

      // Calculate the new height
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 36; // Adjusted for mobile
      const maxHeight = 100; // Adjusted for mobile

      // Set the height within the limits
      if (scrollHeight <= maxHeight) {
        textarea.style.height = Math.max(minHeight, scrollHeight) + "px";
        textarea.style.overflowY = "hidden";
      } else {
        textarea.style.height = maxHeight + "px";
        textarea.style.overflowY = "auto";
      }
    }
  };

  // Handle textarea input change
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQueryValue(e.target.value);
    autoResizeTextarea();
  };

  // Handle send button click
  const handleSend = async () => {
    // Handle send button click logic here
    console.log("Send button clicked");
    if (!textareaValue.trim()) return;
    const newHistory: ChatMessage[] = [...chatHistory, { role: "user", content: textareaValue }];
    setChatHistory(newHistory);
    setQueryValue("");
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: textareaValue }),
      });
      const { response: aiResponse } = await response.json();

      setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      console.log(aiResponse); // The response from FastAPI backend
    } catch (error) {
      console.error("Error sending query:", error);
    }


    // Scroll to the bottom of the container
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Press Enter key to send query
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Only submit if there's actual content (not just whitespace)
      if (textareaValue.trim()) {
        handleSend();
      }
    }
  };
  // Handle container click
  const handleContainerClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Check if clicked element is a button or inside a button
    if (!(e.target as Element).closest("button")) {
      textareaRef.current?.focus(); // Focus textarea if not clicking a button
    }
  };

  // Handle mouse down on resize handle
  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Handle mouse move during resize
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width;

    // Calculate new width percentage
    const newLeftWidth = (mouseX / containerWidth) * 100;

    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
    setLeftWidth(constrainedWidth);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Auto-resize on component mount and when value changes
  useEffect(() => {
    autoResizeTextarea();
  }, [textareaValue]);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add global mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  type ChatMessage = {
    role: "user" | "assistant";
    content: string;
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  return (
    <>
      <div className="flex flex-col md:flex-row grow h-full" ref={containerRef}>
        {/* Chat Area */}
        <div
          className="relative flex flex-col  border-r-0 md:border-r px-3 sm:px-4 md:px-6 lg:px-8  w-full md:w-1/2"
          style={isMounted && window.innerWidth >= 768 ? { width: `${leftWidth}%` } : {}}
        >
          <div className="h-full md:h-[542px] max-h-[542px] overflow-auto fade-scroll mt-8 mb-3 w-full ">
            {/* Welcome Component */}
            {chatHistory.length === 0 ? (
              <Welcome />
            ) :
              <div className="w-full h-full max-h-full flex flex-col">
                {
                  chatHistory.map((message, index) => (
                    <MessageBubble key={index} role={message.role} content={message.content} />
                  ))
                }
              </div>
            }

            {/* Add more MessageBubble components as needed */}
          </div>
          {/* Copilot-style Textarea Area with Buttons Below */}
          <div className="w-full flex flex-col static md:absolute bottom-8 md:w-[92%] md:self-center border-1 border-color-black mb-4 sm:mb-4 md:mb-0" onClick={handleContainerClick}>
            <textarea
              ref={textareaRef}
              value={textareaValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="flex w-full bg-card px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm placeholder:text-muted-foreground outline-none resize-none"
              placeholder="Type your query here..."
              style={{
                minHeight: "38px",
                height: "38px",
                transition: "height 0.1s ease-out",
              }}
            />
            <div className="flex justify-between ">
              {/* Attachment Button */}
              <button>
                <Icon className="m-2 border border-black p-2" icon="tdesign:attach" width="30" height="30" />
              </button>
              {/* Send Button - Larger with Hover Disabled */}
              <button onClick={handleSend}>
                <Icon className="m-2 bg-accent p-2 text-white" icon="line-md:arrow-up" width="29" height="29" />
              </button>
            </div>
          </div>
        </div>

        {/* Resize Handle - Only visible on desktop */}
        <div className="hidden md:block resize-handle w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize relative group transition-colors duration-200" onMouseDown={handleMouseDown}>
          {/* Visual indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>

        {/* Docs Area - Responsive Layout */}
        <div
          className="bg-accent/80 text-white relative flex flex-col justify-between p-3 sm:p-4 md:p-6 lg:p-8 w-full md:w-1/2 h-64 sm:h-80 md:h-full content-center text-center"
          style={isMounted && window.innerWidth >= 768 ? { width: `${100 - leftWidth}%` } : {}}
        >
          <div className="h-[83%] flex grow flex-col justify-center items-center dotted-background w-full gap-2 sm:gap-3 border-2 border-white">
            <div className="w-11/12 h-full  content-center p-2 sm:p-3 text-center">
              <span className="text-sm sm:text-base md:text-lg p-2 lg:text-xl ml-2 bg-[#918171]">DOCS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
