import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  delay?: number;
  children: string;
  hideAfter?: number;
  duration?: number;
  className?: string;
  animate: TargetAndTransition;
  initial: TargetAndTransition;
  firstStartDelay?: number;
}
export default function AnimatedText({
  delay,
  children,
  hideAfter,
  className,
  duration,
  animate,
  initial,
  firstStartDelay,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!hideAfter) return;
    const timer = setTimeout(() => {
      setVisible(false);
    }, hideAfter);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={className}
      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
    >
      <AnimatePresence>
        {visible &&
          children.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={initial}
              animate={animate}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: duration || 0.3,
                delay: (i + 1) * (delay || 0.2) + (firstStartDelay || 0), // stagger effect
              }}
            >
              {word}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}
