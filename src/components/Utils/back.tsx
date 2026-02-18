import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

export function Back() {
  const nav = useNavigate();
  return (
    <div
      className="cursor-pointer inset-shadow-sm/40 text-white shadow-2xl border border-white/10 inset-shadow-white/40 bg-white/40 backdrop-blur-xs rounded-full h-10 w-10 flex justify-center items-center"
      onClick={() => {
        nav(-1);
      }}
    >
      <FontAwesomeIcon
        className="h-5! font-bold text-black"
        icon={faChevronLeft}
      />
    </div>
  );
}
