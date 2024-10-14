import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useLoading, useToast } from "../../Contexts/Loader/LoadingProvider";
import { CloseRounded } from "@mui/icons-material";

function CreateItemDialog(props) {
  const { onClose, open, activeStageId, activeStageName, activeListId } = props;
  const { loading, setLoading } = useLoading();
  const { toast, setToast } = useToast();
  const [value, setValue] = useState({
    name: "",
    assignedTo: "",
    description: "",
    stageId: activeStageId,
    listId: activeListId,
  });
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  function handleValueChange(e) {
    const valueType = e.target.name;
    const newValue = e.target.value;
    setValue({ ...value, [valueType]: newValue });
  }

  async function createItem() {
    let token = localStorage.getItem("token");
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("Authorization", "Bearer " + token);
    setLoading(true);
    try {
      await fetch("/api/ToDo", {
        method: "POST",
        body: JSON.stringify(value),
        headers,
      }).then(async (res) => {
        setLoading(false);
        if (res.ok) {
          let response = await res.text();
          if (response) {
            console.log(response);
            setToast({ open: true, status: "success", message: response });
          }
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle> Create Item </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          handleListItemClick(null);
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseRounded />
      </IconButton>
      <DialogContent>
        <CssBaseline />
        <Stack
          component="form"
          sx={{ flexWrap: "wrap", padding: "20px" }}
          spacing={2.6}
        >
          <Stack spacing={2} direction="row">
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <TextField
                label="Name"
                name="name"
                value={value.name}
                onChange={handleValueChange}
              ></TextField>
            </FormControl>
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <TextField
                label="Description"
                name="description"
                type="text"
                value={value.description}
                multiline={true}
                onChange={handleValueChange}
              ></TextField>
            </FormControl>
          </Stack>
          <Stack spacing={2} direction="row">
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <TextField
                label="Assigned To"
                name="assignedTo"
                value={value.assignedTo}
                onChange={handleValueChange}
              ></TextField>
            </FormControl>
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <TextField
                label="Stage"
                name="statusId"
                disabled={true}
                value={activeStageName}
              ></TextField>
            </FormControl>
          </Stack>
          <Divider />
          <Button type="button" onClick={createItem} variant="contained">
            {" "}
            Create Item{" "}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CreateItemDialog;
