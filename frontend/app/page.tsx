import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";  

export default function Home() {
  return (
    <>
      <div className="flex flex-col border border-black shadow-md bg-background m-3 md:m-11 h-[calc(100vh-1.5rem)] md:h-[calc(100vh-5.5rem)] font-mono">
        <Navbar />
        {/* Main content area */}
        <div className="flex grow h-full">
          {/* Chat Area */}
          <div className="relative flex flex-col justify-between border-r px-8 pt-8 w-1/2 h-full">
            <div className="overflow-y-scroll h-[83%] w-full fade-scroll">
              {/* Welcome Message */}
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="max-w-md space-y-6">
                  {/* Logo/Title */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      Welcome to <span className="text-accent">RAGtag</span>
                    </h1>
                    <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Your intelligent document retrieval and generation assistant
                  </p>

                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        Upload documents and get instant, contextual answers
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        Generate content based on your document knowledge base
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">
                        Retrieve relevant information with advanced AI search
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <textarea
              className="w-[93.81%] p-3 absolute bottom-8 self-center border rounded-md mt-2 focus:-translate-y-1 focus:rounded-xl transition-all duration-300 outline-none"
              placeholder="Type your query here..."
            >
             
            </textarea>
          </div>

          {/* Docs Area */}
          <div className="bg-accent/80 text-white relative flex flex-col justify-between p-8 w-1/2 h-full content-center text-center ">
           
            <div className="overflow-y-scroll h-[83%] flex grow flex-col justify-center items-center w-full gap-3 border-2 border-white">
              <div className="w-11/12 h-full content-center p-3 text-center">DOCS</div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}