import NavBar from "../../components/Navbar";
import img from "../../assets/imgs/home_img.webp";
import Button from "../../components/Button/button";
export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex justify-center xl:justify-between ps-32 pr-32 relative mt-16">
        <div className="xl:z-30 z-10 absolute rounded-full duration-[2000ms] bg-[#000000] xl:bg-[#ffffffa9] opacity-40 xl:opacity-20 hover:opacity-15 w-[200px] h-[200px]  sm:w-[500px] sm:h-[500px] blur-[253px] pointer-events-none lg:top-[75px] lg:left-[300px]"></div>
        <div className="z-20 md:mt-[15%] mt-[30%] translate-y-[-30%]">
          <h1 className="md:text-7xl text-5xl font-black text-white">
            Watch Movies <br /> In Your Home
          </h1>
          <div className="flex gap-5 mt-16">
            <Button>Watch</Button>
            <Button className="!bg-transparent border-4 text-white border-white">
              Search
            </Button>
          </div>
        </div>
        <div className="md:mr-10 xl:relative sm:left-auto sm:top-auto z-0 left-0 top-20 absolute">
          <img src={img} className="h-[588px]" alt="" />
        </div>
      </div>
    </>
  );
}
