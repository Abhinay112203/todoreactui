import { Button } from "@mui/material";
import { useState } from "react";
import CreateItemDialog from "../CreateItem/CreateItem";
import "./Home.css";
function Home() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };
  
  return (
    <div>
      <header className="">
        <Button variant="contained" onClick={handleClickOpen}>
          Add Item
        </Button>
        <CreateItemDialog open={open} onClose={handleClose} />
      </header>
    </div>
  );
}
export default Home;
