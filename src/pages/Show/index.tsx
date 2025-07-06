import { useParams } from "react-router";
import { useGetTVShowDetails } from "../../hooks/getTVShowDetails";
import { ShowDetails } from "../../components/Show_Details";

export default function Show() {
  const p = useParams();
  const { resp, err, isLoading } = useGetTVShowDetails(p.id as string);
  return (
    <>
      <div className="ps-2 pr-2 md:pr-16  md:ps-16 mt-20">
        {!err && !isLoading && resp && <ShowDetails {...resp} />}
      </div>
    </>
  );
}
