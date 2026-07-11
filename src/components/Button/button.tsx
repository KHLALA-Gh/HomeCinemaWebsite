interface ButtonProps extends React.DetailedHTMLProps<
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
          " inset-shadow-sm/40 text-white shadow-2xl border border-white/10 inset-shadow-white/40 bg-white/40 backdrop-blur-xs  rounded-full font-bold ps-10 pr-10 pt-2 pb-2 md:text-2xl md:pt-3 md:pb-3 md:ps-20 md:pr-20 text-black cursor-pointer " +
          props.className
        }
      >
        {props.children}
      </button>
    </>
  );
}
