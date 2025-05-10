interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mb-4"></div>
      {text && <p className="text-[#5b0108]">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;