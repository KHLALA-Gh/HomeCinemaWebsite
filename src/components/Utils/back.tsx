import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

export function Back() {
  const nav = useNavigate();
  return (
    <div
      className="cursor-pointer bg-white rounded-full h-10 w-10 flex justify-center items-center"
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
