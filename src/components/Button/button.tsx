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
          "bg-white rounded-full font-bold ps-10 pr-10 md:text-2xl pt-3 pb-3 md:ps-20 md:pr-20 text-black " +
          props.className
        }
      >
        {props.children}
      </button>
    </>
  );
}
