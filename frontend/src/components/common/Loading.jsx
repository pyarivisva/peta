const Loading = ({ fullScreen = false }) => {
  const containerStyle = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[9999]" 
    : "flex items-center justify-center p-4";

  return (
    <div className={containerStyle}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-blue-600 font-medium animate-pulse">
          Memuat data...
        </p>
      </div>
    </div>
  );
};

export default Loading;