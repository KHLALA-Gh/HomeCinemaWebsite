import * as React from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Drawer from "@mui/joy/Drawer";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import ModalClose from "@mui/joy/ModalClose";
import Menu from "@mui/icons-material/Menu";
import Search from "@mui/icons-material/Search";
import { useNavigate } from "react-router";

export default function DrawerMobileNavigation({
  mode,
}: {
  mode?: "Movies" | "TV";
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState<string>();
  const navigate = useNavigate();

  const onPressEnter = (key: string) => {
    if (key === "Enter") {
      if (mode === "TV") {
        navigate(`/home_cinema/watch_tv_shows?query=${search}`);
      } else {
        location.href = `/home_cinema/search?term=${search}`;
      }
    }
  };
  return (
    <React.Fragment>
      <IconButton
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </IconButton>
      <Drawer
        sx={{
          "&.MuiDrawer-content": {
            backgroundColor: "black !important",
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ml: "auto",
            mt: 1,
            mr: 2,
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            sx={{ fontSize: "sm", fontWeight: "lg", cursor: "pointer" }}
          >
            Close
          </Typography>
          <ModalClose id="close-icon" sx={{ position: "initial" }} />
        </Box>
        <Input
          onKeyUp={(e) => {
            onPressEnter(e.key);
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          size="sm"
          placeholder="Search"
          variant="plain"
          endDecorator={<Search />}
          slotProps={{
            input: {
              "aria-label": "Search anything",
            },
          }}
          sx={{
            m: 3,
            borderRadius: 0,
            borderBottom: "2px solid",
            borderColor: "neutral.outlinedBorder",
            "&:hover": {
              borderColor: "neutral.outlinedHoverBorder",
            },
            "&::before": {
              border: "1px solid var(--Input-focusedHighlight)",
              transform: "scaleX(0)",
              left: 0,
              right: 0,
              bottom: "-2px",
              top: "unset",
              transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
              borderRadius: 0,
            },
            "&:focus-within::before": {
              transform: "scaleX(1)",
            },
          }}
        />
        <List
          size="lg"
          component="nav"
          sx={{
            flex: "none",
            fontSize: "xl",
            "& > div": { justifyContent: "center" },
          }}
        >
          <ListItemButton
            sx={{ fontWeight: "lg" }}
            onClick={() => navigate("/home_cinema")}
          >
            Home
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/home_cinema/watch")}>
            Movies
          </ListItemButton>
          <ListItemButton
            onClick={() => navigate("/home_cinema/watch_tv_shows")}
          >
            TV Shows
          </ListItemButton>
          <ListItemButton onClick={() => navigate("/home_cinema/torrents")}>
            {" "}
            Torrents
          </ListItemButton>
          <ListItemButton onClick={() => navigate("/home_cinema/streams")}>
            {" "}
            Streams
          </ListItemButton>
        </List>
      </Drawer>
    </React.Fragment>
  );
}
