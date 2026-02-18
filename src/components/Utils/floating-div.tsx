import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export function FloatingDiv({
  classname,
  children,
  onClose,
  blur,
  title,
  borders,
}: {
  classname?: string;
  children: React.ReactNode;
  onClose: () => any;
  blur?: boolean;
  title?: string;
  borders?: boolean;
}) {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setScale(1);
    }, 10);
  }, []);
  const close = () => {
    setScale(0);
    setTimeout(() => {
      onClose();
    }, 150);
  };
  return (
    <>
      <div
        style={{
          opacity: scale,
        }}
        className={
          "duration-200 w-full h-screen top-0 left-0 fixed bg-[#00000021] z-998"
        }
        onClick={close}
      ></div>
      <div
        style={{
          scale: scale,
        }}
        className={
          "duration-225 fixed glass-dark top-[50%] left-[50%] translate-[-50%]  min-w-[500px]  z-999 ${classname} scale " +
          (borders ? "border-2 border-white rounded-md" : "")
        }
      >
        <div className="flex justify-between p-2">
          <h1 className=" text-xl font-bold  relative">{title}</h1>
          <div className="cursor-pointer" onClick={close}>
            <FontAwesomeIcon icon={faXmark} className="h-7 mr-2" />
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
