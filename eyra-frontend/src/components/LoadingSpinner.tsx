interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {


  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c0d0c] relative">
      <div className="relative w-[250px] h-[250px]">
        {/* Círculo pequeño con animación de órbita */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[25px] h-[25px] bg-black rounded-full animate-orbit"></div>
        </div>

        {/* Círculo central */}
        <div className="absolute top-1/2 left-1/2 w-[62.5px] h-[62.5px] bg-black rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {text && <p className="text-[#5b0108] mt-6">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
