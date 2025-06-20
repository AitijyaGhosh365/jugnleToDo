import { useLocation, useNavigate } from 'react-router-dom';

const TransitionButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === '/') {
      navigate('/jungle');
    } else {
      navigate('/');
    }
  };

  return (
    <button 
      className="
      fixed top-4 right-4
      w-[400px] max-w-[80vw] h-[80px] bg-[#f8f8a6] cursor-pointer
      flex justify-center items-center
      border-4 border-[#e49d5b] rounded-[15px] text-[#11852c] overflow-hidden
      transition-all duration-100 ease-in
      text-[min(5vw,40px)] px-[15px] text-center whitespace-nowrap truncate
      hover:bg-[#fafa95] hover:scale-105
      md:h-[70px] md:text-[min(6vw,30px)] z-[1000]
      "
      onClick={handleClick}
    >
      {location.pathname === '/' ? "Jungle🌱" : "ToDo✅"}
    </button>
  );
};

export default TransitionButton;