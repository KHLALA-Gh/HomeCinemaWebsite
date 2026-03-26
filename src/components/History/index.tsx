import {
  Button,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import pathBrowser from "path-browserify";
import { useNavigate } from "react-router";
import { join } from "path-browserify";
import MoreVert from "@mui/icons-material/MoreVert";
import { FloatingDiv } from "../Utils/floating-div";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Btn from "../Button/button";
import {
  faCircleExclamation,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { SmallTorrentSearch } from "../Utils/torrentSearch";
import { TorrentProps } from "../TorrentProps";
import { moveTorrent } from "../../lib/utils";
export function TorrentHistory({
  name,
  infoHash,
  path,
  size,
  date,
  onDeleteTorrent,
  unknownTorrent,
  selectMode,
  reload,
  onSelect,
  onDeselect,
  selected,
  onClick,
}: DownloadHistory & {
  onDeleteTorrent: (infoHash: string) => void;
  unknownTorrent: boolean;
  reload: () => void;
  onSelect: () => void;
  onDeselect: () => void;
  selectMode: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  let nav = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [torrentSearchQuery, setTorrentSearchQuery] = useState("");
  const [openProps, setOpenProps] = useState(false);
  const [torrentProps, setTorrentProps] = useState<TorrentProps | null>(null);
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
              <Btn
                onClick={() => {
                  setShowDelete(false);
                }}
                className="glass! bg-white/10! hover:inset-shadow-white/60! hover:inset-shadow-sm duration-300! text-base! ps-6! pr-6!"
              >
                Cancel
              </Btn>
              <Btn
                onClick={async () => {
                  try {
                    await window.electron.deleteDH(
                      pathBrowser.join(path, name),
                    );
                    reload();

                    if (onDeleteTorrent) onDeleteTorrent(infoHash);
                  } catch (err: any) {
                    alert(err?.message);
                  }
                  setShowDelete(false);
                }}
                className="glass! bg-red-500/20! hover:bg-red-500/30! duration-300! text-base! ps-6! pr-6!"
              >
                Delete
              </Btn>
            </div>
          </div>
        </FloatingDiv>
      )}
      <div
        onClick={() => {
          if (selectMode) {
            if (selected) onDeselect();
            else onSelect();
          }
        }}
        className="p-5 select-none bg-[#ffffff11] bg-pop rounded-2xl flex justify-between gap-3 cursor-pointer"
      >
        <div
          onClick={onClick}
          className="flex justify-between gap-5 flex-col w-full"
        >
          <div className="flex gap-2">
            {selectMode && (
              <div>
                <input
                  type="checkbox"
                  onChange={(t) => {
                    if (t.target.checked) onSelect();
                    else onDeselect();
                  }}
                  checked={selected}
                  name=""
                  id=""
                />
              </div>
            )}
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
          <p>
            <span className="bg-[#ffffff19] p-1 rounded-md">
              {join(path, name)}
            </span>
          </p>
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
            <Menu className="overflow-hidden! p-0! border-0! bg-white/2! inset-shadow-sm/100! shadow-2xl! shadow-white/10! inset-shadow-black/40! backdrop-blur-xs!">
              <MenuItem
                className="inset-shadow-sm/40 text-white! bg-white/0! hover:bg-white/10! shadow-2xl inset-shadow-white/40 backdrop-blur-xs"
                onClick={() => {
                  window.electron.openFolder(join(path, name));
                }}
              >
                Open Torrent Folder
              </MenuItem>
              <MenuItem
                className="inset-shadow-sm/40 text-white! bg-white/0! hover:bg-white/10! shadow-2xl inset-shadow-white/40 backdrop-blur-xs"
                onClick={async () => {
                  let props = await window.electron.getTorrentProps(infoHash);
                  setTorrentProps(props);
                  setOpenProps(true);
                }}
              >
                Properties
              </MenuItem>
              <MenuItem
                className="inset-shadow-sm/40 text-white! bg-white/0! hover:bg-white/10! shadow-2xl inset-shadow-white/40 backdrop-blur-xs"
                onClick={async () => {
                  try {
                    const dest = await window.electron.selectFolder();
                    if (!dest) return;
                    await moveTorrent(
                      {
                        name,
                        path,
                        size,
                        date,
                        infoHash,
                      },
                      dest,
                    );
                    reload();
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
              >
                Move Torrent
              </MenuItem>
              {unknownTorrent && (
                <MenuItem
                  className="inset-shadow-sm/40 text-white! bg-white/0! hover:bg-white/10! shadow-2xl inset-shadow-white/40 backdrop-blur-xs"
                  onClick={() => {
                    setTorrentSearchQuery(name);
                  }}
                >
                  Search torrent
                  <FontAwesomeIcon
                    className=""
                    icon={faExclamationCircle}
                    color="yellow"
                  />
                </MenuItem>
              )}
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
      {torrentSearchQuery && (
        <FloatingDiv
          title="Torrent Search"
          blur
          onClose={() => {
            setTorrentSearchQuery("");
          }}
        >
          <SmallTorrentSearch query={torrentSearchQuery} />
        </FloatingDiv>
      )}
      {openProps && (
        <FloatingDiv
          onClose={() => {
            setOpenProps(false);
          }}
          blur
        >
          {torrentProps && (
            <div className="w-[500px]">
              <TorrentProps {...torrentProps} />
            </div>
          )}
          {!torrentProps && (
            <div className="flex justify-center items-center ">
              <h1 className="font-bold">Cannot get torrent properties.</h1>
            </div>
          )}
        </FloatingDiv>
      )}
    </>
  );
}
