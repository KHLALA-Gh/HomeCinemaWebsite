import { Button } from "@mui/joy";
import AnimatedText from "../../components/Utils/animatedText";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import img from "../../assets/imgs/glass_bar.png";
import img1 from "../../assets/imgs/glass_nav.png";
import img2 from "../../assets/imgs/glass_watch.png";
import img3 from "../../assets/imgs/glass_series.png";

export default function NewUpdate() {
  const [page, setPage] = useState(0);
  return (
    <div className="overflow-hidden">
      <AnimatePresence>
        {page === 0 && <Page1 setPage={setPage} />}
        {page === 1 && <Page2 setPage={setPage} />}
        {page === 2 && <Page3 setPage={setPage} />}
        {page === 3 && <Page4 setPage={setPage} />}
        {page === 4 && <Page5 setPage={setPage} />}
        {page === 5 && <Page6 setPage={setPage} />}
      </AnimatePresence>
    </div>
  );
}

function Page1({ setPage }: { setPage: (page: number) => void }) {
  return (
    <motion.div
      exit={{
        x: -50,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className=" w-full h-screen p-10 mt-10"
    >
      <AnimatedText
        className="text-6xl font-medium "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
        hideAfter={1000}
      >
        Welcome To
      </AnimatedText>
      <AnimatedText
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-7xl"
        duration={1}
        delay={1.7}
      >
        HomeCinema
      </AnimatedText>
      <AnimatedText
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl"
        delay={3}
      >
        v0.1.0
      </AnimatedText>
      <motion.div
        className="blur-3xl w-70 h-70 rounded-full bg-[#ffffff20] absolute top-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 3,
        }}
      ></motion.div>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 3.5,
        }}
      >
        <h1 className="text-2xl">Discover the new changes</h1>
        <Button onClick={() => setPage(1)} className="mt-5!">
          Noice
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Page2({ setPage }: { setPage: (page: number) => void }) {
  return (
    <motion.div
      exit={{
        x: -50,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className=" w-full h-screen p-10 mt-10"
    >
      <AnimatedText
        className="text-6xl font-medium "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
      >
        Core Modules Update
      </AnimatedText>

      <motion.div
        className="blur-3xl w-70 h-70 rounded-full bg-[#ffffff20] absolute top-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
      ></motion.div>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
      >
        <ul className="[word-spacing:0.5rem]">
          <li>@homecinema/app alpha-6</li>
          <li>@homecinema/streamer v3</li>
          <li>@homecinema/desktop v0.1.0</li>
        </ul>
        <Button onClick={() => setPage(2)} className="mt-5!">
          Mhm
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Page3({ setPage }: { setPage: (page: number) => void }) {
  return (
    <motion.div
      exit={{
        x: -50,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className=" w-full h-screen p-10 mt-10"
    >
      <AnimatedText
        className="text-6xl font-medium mb-5 "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
      >
        New Glass Look
      </AnimatedText>

      <motion.div
        className="blur-3xl w-70 h-70 rounded-full bg-[#ffffff20] absolute top-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
      ></motion.div>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
      >
        <div className="ani-bounce absolute">
          <img src={img} alt="" />
        </div>
        <div className=" absolute z-10 mt-20 left-25">
          <img src={img1} alt="" />
        </div>
        <div className=" absolute mt-0 z-5 left-80">
          <img src={img2} alt="" />
        </div>
        <div className=" absolute left-150 mt-15 ani-bounce-delay">
          <img src={img3} alt="" />
        </div>
        <Button onClick={() => setPage(3)} className="mt-60!">
          Cool
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Page4({ setPage }: { setPage: (page: number) => void }) {
  return (
    <motion.div
      exit={{
        x: -50,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className=" w-full h-screen p-10 mt-10"
    >
      <AnimatedText
        className="text-6xl font-medium "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
      >
        New third Party Services !!
      </AnimatedText>

      <motion.div
        className="blur-3xl w-70 h-70 rounded-full bg-[#ffffff20] absolute top-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
      ></motion.div>
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 1,
        }}
      >
        <h1>
          Now you can link your TMDB account with Homecinema and have your
          watchlist in the app.
        </h1>
        <Button onClick={() => setPage(4)} className="mt-5!">
          Pretty coool
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Page5({ setPage }: { setPage: (page: number) => void }) {
  return (
    <motion.div
      exit={{
        x: -50,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className=" w-full h-screen p-10 mt-10"
    >
      <motion.div
        className="blur-3xl w-70 h-70 rounded-full bg-[#ffffff20] absolute top-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.5,
        }}
      ></motion.div>
      <AnimatedText
        firstStartDelay={0.5}
        delay={0.2}
        className="text-4xl italic font-semibold"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        "No need for a cinema when having HomeCinema"
      </AnimatedText>
      <motion.p
        className="text-[#ffffff50] italic ps-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 3,
        }}
      >
        khlala
      </motion.p>
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 3,
        }}
      >
        <Button onClick={() => setPage(5)} className="mt-5!">
          lezz goo
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Page6({ setPage }: { setPage: (page: number) => void }) {
  const nav = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setPage(5);
    }, 4000);
    setTimeout(() => {
      nav("/");
    }, 8000);
  }, []);
  return (
    <motion.div
      className="flex items-center justify-center w-full h-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 3,
        delay: 0.5,
      }}
    >
      <h1 className="font-medium text-9xl">Enjoy</h1>
    </motion.div>
  );
}
