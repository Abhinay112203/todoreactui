import { Button } from "@mui/material";
import CreateItemDialog from "../CreateItem/CreateItem";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewList() {
  const [open, setOpen] = useState(false);
  const [stages, setStages] = useState([]);
  const { id } = useParams();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };
  useEffect(() => {
    getLists();
  }, []);

  async function getLists() {
    let token = localStorage.getItem("token");
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("Authorization", "Bearer " + token);
    await fetch(`http://68.233.119.75:5236/api/lists/${id}/stage`, {
      method: "GET",
      headers,
    }).then(async (res) => {
      if (res.ok) {
        let response = await res.json();
        console.log(response);
        setStages([...response.$values]);
      }
    });
  }
  return (
    <header
      style={{ display: "flex", justifyContent: "space-between" }}
      className=""
    >
      <div>View List</div>
      <Button
        style={{ marginLeft: "auto" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Add Item
      </Button>
      <CreateItemDialog open={open} onClose={handleClose} />
    </header>
  );
}
