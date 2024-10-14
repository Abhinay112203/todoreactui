import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import CreateListDialog from "../Components/CreateList/CreateList";
import { Button, colors } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const drawerWidth = 240;

// Main Section
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `1px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: 100000000,
          }),
          marginLeft: 0,
        },
      },
    ],
  })
);

// nothing but styled div
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function AuthorisedLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openCreateList, setOopenCreateList] = useState(false);
  const [toDoLists, setToDoLists] = useState([]);
  const navigate = useNavigate();
  const [mainHeight, setMainHeight] = useState("");
  const {listId} = useParams();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    getLists(true);
    
    return () => {};
  }, []);

  async function getLists(redirect = false) {
    let token = localStorage.getItem("token");
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("Authorization", "Bearer " + token);
    await fetch("/api/lists", {
      method: "GET",
      headers,
    }).then(async (res) => {
      if (res.ok) {
        let response = await res.json();
        setToDoLists([...response]);
        if (redirect) {
          if (response.length > 0) {
            if(!(listId && listId !== "" && listId != undefined)){
              openList(response[0].id);
            }
          } else {
            setOopenCreateList(true);
          }
        }
      }
    });
  }
  function openList(id) {
    navigate(`/auth/list/${id}`);
  }
  function listCreated(id) {
    setOopenCreateList(false);
    if (id) {
      openList(id);
      getLists();
    }
  }
  useLayoutEffect(() => {
    setMainHeight(
      `calc( 100% - ${
        document.getElementById("mainAppBar").clientHeight
      }px) !important`
    );
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar
        id="mainAppBar"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: colors.blueGrey["A700"],
          background: [
            " rgb(255,255,255)",
            "linear-gradient(113deg, rgba(255,255,255,1) 0%, rgba(254,254,254,1) 74%, rgba(129,181,191,1) 100%)",
          ],
        }}
        position="relative"
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            style={{
              fontFamily: '"Updock", cursive',
              fontWeight: 800,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            variant="h6"
            noWrap
            component="div"
          >
            Not Any To-Do
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", height: mainHeight }}>
        <Drawer
          sx={[
            {
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            },
            open && { display: "none" },
          ]}
          variant="permanent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Button
            onClick={() => {
              setOopenCreateList(true);
            }}
            startIcon={<AddIcon />}
            variant="text"
          >
            Add List
          </Button>
          <Divider />
          <List>
            {toDoLists.map((listDetails, index) => (
              <div key={listDetails.id}>
                <ListItem
                  onClick={() => openList(listDetails.id)}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText primary={listDetails.name} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Drawer>
        <Main
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#fdfde8",
          }}
          open={open}
        >
          <Outlet />
        </Main>
      </Box>
      {openCreateList ? (
        <CreateListDialog open={openCreateList} onClose={listCreated} />
      ) : (
        ""
      )}
    </>
  );
}
