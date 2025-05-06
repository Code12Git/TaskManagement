const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold  mb-4">Error</h2>
        <p className=" mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-opacity-90 transition"
        >
          Retry
        </button>
      </div>
    </div>
  )

export default ErrorDisplay;  