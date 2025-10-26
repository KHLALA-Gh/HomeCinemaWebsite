import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTVShowById } from "../../lib/idb";
import { ShowDetails } from "../../components/Show_Details";

export default function SavedTVShows() {
  const { id } = useParams();
  const [show, setShow] = useState<TMDBTVShowDetails>();
  const [err, setErr] = useState<string>();
  useEffect(() => {
    if (!id) return;
    if (Number.isInteger(+id)) {
      getTVShowById(+id)
        .then((m) => {
          setShow(m);
        })
        .catch((err) => {
          setErr(err.message);
        });
    }
  }, []);

  return (
    <>
      <div className="ps-2 pr-2 md:pr-16  md:ps-16 mt-20">
        {!err && show && <ShowDetails {...show} />}
        {err && <h1 className="text-red-600 text-xl">Error : {err}</h1>}
      </div>
    </>
  );
}
