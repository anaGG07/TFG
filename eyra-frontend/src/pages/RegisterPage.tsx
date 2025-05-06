import { RegisterForm } from '../features/auth/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFEDEA] p-4 py-12">
      {/* Logo grande para la página de registro */}
      <div className="fixed top-6 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#C62328] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-[#FFEDEA]" fill="currentColor">
                <path d="M50,20 C65,20 70,35 70,50 C70,65 65,80 50,80 C35,80 30,65 30,50 C30,35 35,20 50,20 Z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-serif tracking-tight text-[#C62328]">
            EYRA<span>CLUB</span>
          </h2>
        </div>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;