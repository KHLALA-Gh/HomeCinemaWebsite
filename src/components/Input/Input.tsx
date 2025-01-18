import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  Icon?: IconProp;
  onClickIcon?: () => void;
}

export default function Input(props: InputProps) {
  return (
    <>
      <div className="rounded-full border-2 border-white flex items-center gap-3 p-2">
        <div onClick={props.onClickIcon}>
          {props.Icon && <FontAwesomeIcon icon={props.Icon} className="ml-2" />}
        </div>
        <input
          {...props}
          type="text"
          className={
            "bg-transparent outline-none placeholder:font-bold " +
            props.className
          }
        />
      </div>
    </>
  );
}
