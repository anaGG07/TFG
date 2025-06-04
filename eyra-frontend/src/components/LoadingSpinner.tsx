interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E7E0D5]">
      <style>
        {`
          .drip-spinner {
            position: relative;
            width: 80px;
            height: 80px;
          }

          .drop {
            position: absolute;
            width: 14px;
            height: 14px;
            background-color: #5b0108;
            border-radius: 50%;
            opacity: 0.3;
            animation: drip 1.2s infinite ease-in-out;
          }

          .drop:nth-child(1) { top: 0%; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
          .drop:nth-child(2) { top: 25%; left: 85%; transform: translate(-50%, -50%); animation-delay: 0.15s; }
          .drop:nth-child(3) { top: 50%; left: 100%; transform: translate(-50%, -50%); animation-delay: 0.3s; }
          .drop:nth-child(4) { top: 75%; left: 85%; transform: translate(-50%, -50%); animation-delay: 0.45s; }
          .drop:nth-child(5) { top: 100%; left: 50%; transform: translate(-50%, -100%); animation-delay: 0.6s; }
          .drop:nth-child(6) { top: 75%; left: 15%; transform: translate(-50%, -50%); animation-delay: 0.75s; }
          .drop:nth-child(7) { top: 50%; left: 0%; transform: translate(50%, -50%); animation-delay: 0.9s; }
          .drop:nth-child(8) { top: 25%; left: 15%; transform: translate(-50%, -50%); animation-delay: 1.05s; }

          @keyframes drip {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.8);
              opacity: 1;
            }
          }
        `}
      </style>

      <div className="drip-spinner">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="drop" />
        ))}
      </div>
      {text && <p className="text-[#5b0108] mt-6 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
