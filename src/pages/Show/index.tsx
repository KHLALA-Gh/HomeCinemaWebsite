import { useParams } from "react-router";
import { useGetTVShowDetails } from "../../hooks/getTVShowDetails";
import { ShowDetails } from "../../components/Show_Details";
import NavBar from "../../components/Navbar";

export default function Show() {
  const p = useParams();
  const { resp, err, isLoading } = useGetTVShowDetails(p.id as string);

  return (
    <>
      <NavBar />
      <div className="ps-2 pr-2 md:pr-16  md:ps-16 mt-20">
        {!err && !isLoading && resp && <ShowDetails {...resp} />}
        {isLoading && (
          <div className="flex gap-10">
            <div className="w-[300px] h-[450px] loading-background rounded-2xl"></div>
            <div className="pt-10 flex flex-col gap-5">
              <div className="w-50 h-5 loading-background"></div>
              <div className="w-150 h-5 loading-background"></div>
              <div className="w-100 h-5 loading-background"></div>
              <div className="w-10 h-5 loading-background"></div>
              <div className="w-65 h-5 mt-10 loading-background"></div>
              <div className="w-40 h-10 mt-30 loading-background"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
