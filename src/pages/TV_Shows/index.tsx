import { useSearchParams } from "react-router";
import { useGetTVShows } from "../../hooks/getTVShows";

export default function TVShows() {
  const [sp, _] = useSearchParams();
  const {} = useGetTVShows({
    page: sp.get("page") as string,
  });
  return <></>;
}
