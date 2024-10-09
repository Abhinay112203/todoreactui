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
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CreateListDialog from "../Components/CreateList/CreateList";
import { Button } from "@mui/material";
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

// App Bar Section
// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme }) => ({
//   transition: theme.transitions.create(['margin', 'width'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         width: `calc(100% - ${drawerWidth}px)`,
//         marginLeft: `${drawerWidth}px`,
//         transition: theme.transitions.create(['margin', 'width'], {
//           easing: theme.transitions.easing.easeOut,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//       },
//     },
//   ],
// }));

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
    await fetch("http://localhost:5134/api/lists", {
      method: "GET",
      headers,
    }).then(async (res) => {
      if (res.ok) {
        let response = await res.json();
        console.log(response);
        setToDoLists([...response.$values]);
        if (redirect) {
          if (response.$values.length > 0) {
            openList(response.$values[0].id);
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
    if (listCreated) {
      openList(id);
      getLists();
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        style={{ color: "#12c526", backgroundColor: "#005e3f" }}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        position="fixed"
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
          <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
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
              <ListItem onClick={() => openList(listDetails.id)} disablePadding>
                <ListItemButton>
                  <ListItemText primary={listDetails.name} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
      {openCreateList ? <CreateListDialog open={openCreateList} onClose={listCreated} /> : ''}
      
    </Box>
  );
}
