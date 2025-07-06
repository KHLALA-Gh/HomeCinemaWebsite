interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  return (
    <>
      <button
        {...props}
        className={
          "bg-white rounded-full font-bold ps-10 pr-10 pt-2 pb-2 md:text-2xl md:pt-3 md:pb-3 md:ps-20 md:pr-20 text-black " +
          props.className
        }
      >
        {props.children}
      </button>
    </>
  );
}
