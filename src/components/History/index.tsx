import {
  Button,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import { useNavigate } from "react-router";
import { join } from "path-browserify";
import MoreVert from "@mui/icons-material/MoreVert";
import { FloatingDiv } from "../Utils/floating-div";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
export function TorrentHistory({
  name,
  infoHash,
  path,
  onDeleteTorrent,
}: DownloadHistory & { onDeleteTorrent: (infoHash: string) => void }) {
  let nav = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  return (
    <>
      {showDelete && (
        <FloatingDiv
          blur={true}
          onClose={() => {
            setShowDelete(false);
          }}
          borders
          classname="glass border-0! shadow-sm shadow-white/20"
        >
          <div className="flex justify-center items-center flex-col gap-5 mb-6">
            <h1 className="text-xl">
              Are sure you want to delete this torrent ?
            </h1>
            <p className="text-[#ffffff75]">This action is irreversible.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDelete(false);
                }}
                color="neutral"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await window.electron.deleteDH(infoHash);
                  setShowDelete(false);
                  if (onDeleteTorrent) onDeleteTorrent(infoHash);
                }}
                color="danger"
              >
                Delete
              </Button>
            </div>
          </div>
        </FloatingDiv>
      )}
      <div
        onDoubleClick={() => {
          if (infoHash.startsWith("unknown:")) return;
          nav(`/home_cinema/torrents/${infoHash}/files`);
        }}
        className="p-5 bg-[#ffffff11]  glass-dark rounded-md flex flex-col gap-3 cursor-pointer"
      >
        <div className="flex justify-between">
          <div className="flex gap-2">
            {infoHash.startsWith("unknown:") && (
              <div
                className="alert-title"
                title="This folder has no torrent hash"
              >
                <FontAwesomeIcon
                  size="lg"
                  className="text-red-600"
                  icon={faCircleExclamation}
                />
              </div>
            )}
            <h1>{name}</h1>
          </div>
          <div>
            <Dropdown>
              <MenuButton
                sx={{
                  ":hover": {
                    backgroundColor: "#ffffff30",
                  },
                }}
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: "outlined", color: "neutral" } }}
              >
                <MoreVert className="text-white" />
              </MenuButton>
              <Menu className=" p-0! border-0! bg-white/2! inset-shadow-sm/100! shadow-2xl! shadow-white/10! inset-shadow-black/40! backdrop-blur-xs!">
                <MenuItem
                  className="inset-shadow-sm/40 text-white! bg-white/0! hover:bg-white/10! shadow-2xl inset-shadow-white/40 backdrop-blur-xs"
                  onClick={() => {
                    window.electron.openFolder(join(path, name));
                  }}
                >
                  Open Torrent Folder
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowDelete(true);
                  }}
                  className="bg-red-700/30! border-0 text-white! duration-500 inset-shadow-sm/40 hover:bg-red-700/10! shadow-2xl inset-shadow-white/40 backdrop-blur-xs"
                >
                  Delete
                </MenuItem>
              </Menu>
            </Dropdown>
          </div>
        </div>
        <p>
          <span className="bg-[#ffffff19] p-1 rounded-md">
            {join(path, name)}
          </span>
        </p>
      </div>
    </>
  );
}
