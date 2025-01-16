import axios from "axios";
import { useEffect, useState } from "react";
import data from "../../public/home_cinema_config.json";
export const api: string = data["torrent-streamer-api"].origin;

export const streamEndPoint = "/api/stream";
const magnetURIEndpoint = "/api/get_magnet_uri";

export async function fetchConfigs() {
  const configs = (await axios.get("/home_cinema_config.json")).data as Configs;
  return configs;
}

export function useGetMagnetURI(hash: string) {
  const [resp, setResp] = useState<string>("");
  const [err, setErr] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  if (!hash) {
    setIsLoading(false);
    setErr("hash is required");
  }
  const get = async (url: string) => {
    const resp = await axios.get(url);
    if (resp.status === 200) {
      let m: string = resp.data.magnetURI;
      setResp(m);
    } else {
      setErr("unexpected error while getting magnet URI");
    }
  };
  const fetch = () => {
    setIsLoading(true);
    fetchConfigs()
      .then((c) => {
        const url = new URL(
          magnetURIEndpoint,
          c["torrent-streamer-api"].origin
        );
        url.searchParams.set("hash", hash);
        get(url.href).catch((e) => {
          setErr(e);
        });
      })
      .catch(() => {
        setErr("error when fetching configs");
      });
    setIsLoading(false);
  };
  useEffect(() => {
    fetch();
  }, []);
  return {
    resp,
    err,
    isLoading,
    setErr,
  };
}
