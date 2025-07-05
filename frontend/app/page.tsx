'use client'
import { use, useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";  

// Import the actual Navbar component
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  // Create a ref for the textarea
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState('');
  
  // State for resizable panels
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);

  // Auto-resize textarea function
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the new height
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 36; // Adjusted for mobile
      const maxHeight = 100; // Adjusted for mobile
      
      // Set the height within the limits
      if (scrollHeight <= maxHeight) {
        textarea.style.height = Math.max(minHeight, scrollHeight) + 'px';
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflowY = 'auto';
      }
    }
  };

  // Handle textarea input change
  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
    autoResizeTextarea();
  };

  // Handle container click
  const handleContainerClick = (e) => {
    // Check if clicked element is a button or inside a button
    if (!e.target.closest('button')) {
      textareaRef.current?.focus();  // Focus textarea if not clicking a button
    }
  };

  // Handle mouse down on resize handle
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Handle mouse move during resize
  const handleMouseMove = (e) => {
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <>
      <div className="flex flex-col border border-black shadow-md bg-background m-2 sm:m-3 lg:m-6 xl:m-11 h-[calc(100vh-1rem)] sm:h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-3rem)] xl:h-[calc(100vh-5.5rem)] font-mono md:overflow-hidden">
        <Navbar />
        {/* Main content area */}
        <div className="flex flex-col md:flex-row grow h-full" ref={containerRef}>
          {/* Chat Area */}
          <div 
            className="relative flex flex-col justify-between border-r-0 md:border-r px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20 w-full md:w-1/2 h-auto md:h-full "
            style={isMounted && window.innerWidth >= 768 ? { width: `${leftWidth}%` } : {}}
          >
            <div className="h-full md:h-[83%] w-full fade-scroll">
              {/* Welcome Message */}
              <div className="flex flex-col items-center h-full justify-center text-center px-2 sm:px-4 ">
                <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Logo/Title */}
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                      Welcome to <span className="text-accent">RAGtag</span>
                    </h1>
                    <div className="w-12 sm:w-14 md:w-16 h-0.5 sm:h-0.5 md:h-1 bg-accent mx-auto rounded-full"></div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-600 leading-relaxed">
                    Your intelligent document retrieval and generation assistant
                  </p>

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3 text-left">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-1 sm:w-1 h-1 sm:h-1 bg-accent rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                      <p className="text-sm sm:text-xs md:text-tiny text-gray-700 ">
                        Upload documents and get instant, contextual answers
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-1 sm:w-1 h-1 sm:h-1 bg-accent rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                      <p className="text-sm  sm:text-xs md:text-tiny text-gray-700 ">
                        Generate content based on your document knowledge base
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-1 sm:w-1 h-1 sm:h-1  bg-accent rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                      <p className="text-sm  sm:text-xs md:text-tiny text-gray-700 ">
                        Quickly find the most relevant information with AI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Copilot-style Textarea Area with Buttons Below */}
            <div 
              className="w-full md:w-[93.81%] static md:absolute md:bottom-4 lg:bottom-8 md:self-center md:left-1/2 md:-translate-x-1/2 border-1 border-color-black mb-3 sm:mb-4 md:mb-0"
              onClick={handleContainerClick}
            >
              <textarea
                ref={textareaRef}
                value={textareaValue}
                onChange={handleTextareaChange}
                className="flex w-full bg-card px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm placeholder:text-muted-foreground outline-none resize-none"
                placeholder="Type your query here..."
                style={{ 
                  minHeight: '36px',
                  height: '36px',
                  transition: 'height 0.1s ease-out'
                }}
              />
<div className="flex justify-between ">
  {/* First Button */}
<Button
  variant="link"
  size="icon"
  className="
    inline-flex items-center justify-center
    h-7 w-7 m-1 p-3
    hover:opacity-80
    hover:outline-1
    hover:outline-black
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"  
    height="12"
    viewBox="0 0 24 24"
    className="transition-opacity duration-200 group-hover:opacity-60"
  >
    <g fill="#2a2216" fillRule="evenodd" clipRule="evenodd">
      <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16" />
      <path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z" />
    </g>
  </svg>
</Button>



  {/* Send Button - Larger with Hover Disabled */}
<Button
  variant="link"
  size="icon"
  className="
    inline-flex items-center justify-center
    h-7 w-7 m-1 p-3
    rounded-full
    transition-colors duration-200
    hover:opacity-90
    focus-visible:outline-none
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-8
    shrink-0 [&_svg]:shrink-0
  "
>
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
    <path fill="#2a2216" fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10m-13.53-.47a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.75.75 0 1 1-1.06 1.06l-1.72-1.72V16a.75.75 0 0 1-1.5 0V9.81l-1.72 1.72a.75.75 0 0 1-1.06 0" clipRule="evenodd" />
  </svg>
</Button>


</div>

            </div>
          </div>

          {/* Resize Handle - Only visible on desktop */}
          <div 
            className="hidden md:block resize-handle w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize relative group transition-colors duration-200"
            onMouseDown={handleMouseDown}
          >
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
      </div>
    </>
  );
}