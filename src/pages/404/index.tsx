import { faSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/joy";
import { useNavigate } from "react-router";

export function NotFound() {
  const nav = useNavigate();
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-3">
      <FontAwesomeIcon icon={faSadCry} size="4x" />
      <h1 className="text-xl font-bold">Page Not Found</h1>
      <Button
        onClick={() => {
          nav("/");
        }}
      >
        Back To Home
      </Button>
    </div>
  );
}
