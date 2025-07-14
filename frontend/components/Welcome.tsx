export default function Welcome() {
    return (
        <>            
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
                    <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-600 leading-relaxed">Your intelligent document retrieval and generation assistant</p>

                    {/* Features */}
                    <div className="space-y-2 sm:space-y-3 text-center items-center flex flex-col justify-center">
                        <div className="flex items-center justify-ceenter space-x-2 sm:space-x-3">
                            <div className="w-1 sm:w-1 h-1 sm:h-1 bg-accent rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                            <p className="text-sm sm:text-xs md:text-xs text-gray-700 ">Upload documents and get instant, contextual answers</p>
                        </div>
                        <div className="flex items-center justify-ceenter space-x-2 sm:space-x-3">
                            <div className="w-1 sm:w-1 h-1 sm:h-1 bg-accent rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                            <p className="text-sm  sm:text-xs md:text-xs text-gray-700 ">Generate content based on your document knowledge base</p>
                        </div>
                        <div className="flex items-center justify-ceenter space-x-2 sm:space-x-3">
                            <div className="w-1 sm:w-1 h-1 sm:h-1  bg-accent rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                            <p className="text-sm  sm:text-xs md:text-xs text-gray-700 ">Quickly find the most relevant information with AI</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
