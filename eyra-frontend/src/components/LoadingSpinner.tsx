interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative"
      style={{ background: "#E7E0D5" }}
    >
      <style>
        {`
          .wrapper {
            --size: 250px;
            position: absolute;
            width: var(--size);
            height: var(--size);
            top: 50%;
            left: 50%;
            margin: calc(var(--size) / -2);
            background: #E7E0D5;
            filter: blur(10px) contrast(15);
          }
          .wrapper span {
            background: black;
            position: absolute;
            border-radius: 50%;
            display: inline-block;
          }
          .wrapper p {
            position: absolute;
            top: 50%;
            left: 50%;
          }
          .wrapper p:nth-child(1) {
            position: absolute;
            animation: skewing-child .2s ease-in-out infinite alternate;
          }
          .wrapper p:nth-child(1) span {
            width: calc(var(--size) / 10);
            height: calc(var(--size) / 10);
            margin: calc(var(--size) / -20);
            animation: moving 2s cubic-bezier(.97,.01,.12,.99) infinite alternate;
          }
          .wrapper p:nth-child(2) {
            position: absolute;
            animation: squishing 1s ease-in-out infinite alternate;
          }
          .wrapper p:nth-child(2) span {
            width: calc(var(--size) / 4);
            height: calc(var(--size) / 4);
            top: 50%;
            left: 50%;
            margin: calc(var(--size) / -8);
            animation: skewing 2s 1.5s ease-in-out infinite;
            position: absolute;
          }
          @keyframes skewing {
            0% { transform: skewX(6deg); }
            10% { transform: skewX(-6deg); }
            20% { transform: skewX(4deg); }
            30% { transform: skewX(-4deg); }
            40% { transform: skewX(2deg); }
            50% { transform: skewX(-6deg); }
            55% { transform: skewX(6deg); }
            60% { transform: skewX(-5deg); }
            65% { transform: skewX(5deg); }
            70% { transform: skewX(-4deg); }
            75% { transform: skewX(4deg); }
            80% { transform: skewX(-3deg); }
            85% { transform: skewX(3deg); }
            90% { transform: skewX(-2deg); }
            95% { transform: skewX(2deg); }
            100% { transform: skewX(1deg); }
          }
          @keyframes skewing-child {
            0% { transform: skewX(-10deg); }
            100% { transform: skewX(10deg); }
          }
          @keyframes moving {
            0% {transform: translate(calc(var(--size) / -2.5));}
            30% {transform: translate(calc(var(--size) / -10));}
            70% {transform: translate(calc(var(--size) / 10));}
            100% {transform: translate(calc(var(--size) / 2.5));}
          }
          @keyframes squishing {
            10%, 40%, 80% { transform: scale(1, .9); }
            0%, 30%, 60%, 100% {transform: scale(.9, 1);}
          }
        `}
      </style>
      <div className="wrapper">
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
      </div>
      {text && <p className="text-[#5b0108] mt-6">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
