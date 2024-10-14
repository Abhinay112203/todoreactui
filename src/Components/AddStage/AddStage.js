import { CloseRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLoading } from "../../Contexts/Loader/LoadingProvider";

function AddStageDialog(props) {
  const { onClose, open, activeListId, listCount } = props;
  const { setLoading } = useLoading();
  const [value, setValue] = useState({
    name: "",
    description: "",
    order: listCount + 1,
    listId: activeListId
  });
  const [toast, setToast] = useState({
    status: "",
    open: false,
    message: "",
  });
  const handlePopupClose = (id) => {
    onClose(id);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  useEffect(() => {
    setValue({...value, order: listCount + 1});
  },[listCount]);

  function handleClose() {
    setToast({ ...toast, open: false });
  }
  function setError(message, status = "error") {
    setToast({ status, open: true, message });
  }
  function valueChange(e) {
    const valueType = e.target.name;
    const newValue = e.target.value;
    setValue({ ...value, [valueType]: newValue });
  }
  async function formSubmittted() {
    if (value.name == null && value.name.trim() == "") {
      setError("Name cannot be empty");
    }
    if (value.description == null && value.description.trim() == "") {
      setError("Name cannot be empty");
    }
    setLoading(true);
    setTimeout(async () => {
      let token = localStorage.getItem("token");
      let headers = new Headers();
      headers.append("content-type", "application/json");
      headers.append("Authorization", "Bearer " + token);
      try {
        await fetch("/api/stages", {
          method: "POST",
          body: JSON.stringify(value),
          headers,
        }).then(async (res) => {
          if (res.ok) {
            let response = await res.json();
            console.log(response);
            setError("Successfully Created List", "success");
            setTimeout(() => {
              //   navigate("/auth/");
              handlePopupClose(response.id);
            }, 2000);
          }
        });
      } catch (error) {
        setError(JSON.stringify(error));
      }
      setLoading(false);
    }, 3000);
  }
  return (
    <Dialog onClose={handlePopupClose} open={open}>
      <DialogTitle> Create Stage </DialogTitle>
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
      <Divider />
      <DialogContent>
        <Box className="login-box">
          <Stack
            sx={{ flexWrap: "wrap", padding: "20px" }}
            component="form"
            spacing={2}
            noValidate
          >
            <Stack useFlexGap spacing={2} direction="row">
              <FormControl sx={{ flex: 1 }} variant="outlined">
                <TextField
                  id="stage-name-add"
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={value.name}
                  onChange={valueChange}
                />
              </FormControl>

              <FormControl sx={{ flex: 1 }} variant="outlined">
                <TextField
                  id="stage-description-add"
                  label="Description"
                  variant="outlined"
                  type="text"
                  multiline={true}
                  name="description"
                  value={value.description}
                  onChange={valueChange}
                />
              </FormControl>
            </Stack>
            <Stack spacing={2} direction="row">
              <FormControl sx={{ flex: 1 }} variant="outlined">
                <InputLabel id="demo-simple-select-helper-label">
                  Age
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={value.order}
                  label="Age"
                  name="order"
                  onChange={valueChange}
                >
                  {Array.from(Array(listCount + 1).keys()).map((num) => {
                    return <MenuItem key={num} value={num + 1}>{num + 1}</MenuItem>
                  })}
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
              {/* <FormControl sx={{ flex: 1 }} variant="outlined">
                  <TextField
                    id="ending-stage-add"
                    label="Ending Stage"
                    variant="outlined"
                    type="text"
                    name="endingStage"
                    value={value.endingStage}
                    onChange={valueChange}
                  />
                </FormControl> */}
            </Stack>

            <Divider />
            <Button type="button" onClick={formSubmittted} variant="contained">
              Add List
            </Button>
          </Stack>
        </Box>
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          open={toast.open}
          autoHideDuration={6000}
          onClose={handlePopupClose}
        >
          <Alert
            onClose={handlePopupClose}
            severity={toast.status}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
}

export default AddStageDialog;
