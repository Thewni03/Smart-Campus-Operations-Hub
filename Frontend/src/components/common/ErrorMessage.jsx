const ErrorMessage = ({ message = "Something went wrong.", onRetry }) => (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-red-600 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-blue-600 hover:underline mt-1"
        >
          Try again
        </button>
      )}
    </div>
  );
  
  export default ErrorMessage;
  