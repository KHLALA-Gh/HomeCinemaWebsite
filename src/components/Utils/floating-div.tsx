export function FloatingDiv({
  classname,
  children,
  onClose,
  blur,
}: {
  classname?: string;
  children: React.ReactNode;
  onClose: () => any;
  blur?: boolean;
}) {
  return (
    <>
      <>
        <div
          className={`w-full h-screen top-0 left-0 fixed bg-[#00000069] z-998 ${blur ? "blur-md" : ""}`}
          onClick={onClose}
        ></div>
        <div
          className={`fixed top-[50%] left-[50%] translate-[-50%]  min-w-[500px]  z-999 ${classname}`}
        >
          {children}
        </div>
      </>
    </>
  );
}
