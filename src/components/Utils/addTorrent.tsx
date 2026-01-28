import { useState } from "react";
import Button from "../Button/button";
import Input from "../Input/Input";
import { useNavigate } from "react-router";

export function AddTorrent() {
  const [value, setValue] = useState("");
  const nav = useNavigate();
  const onCreate = () => {
    if (value.length < 40) return;
    nav(`/home_cinema/torrents/${value.trim()}/files`);
  };
  return (
    <div className="p-5 bg-[#161616] flex flex-col gap-3">
      <Input
        onChange={(e) => setValue(e.target.value)}
        placeholder="info hash"
        onKeyUp={(e) => {
          if (e.code === "Enter") {
            onCreate();
          }
        }}
        value={value}
        type="text"
      />
      <Button className="text-base! w-fit! ps-8! pr-8!" onClick={onCreate}>
        Add
      </Button>
    </div>
  );
}
