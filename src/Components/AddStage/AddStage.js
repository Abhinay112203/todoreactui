import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Paper,
    Snackbar,
    Stack,
    TextField,
  } from "@mui/material";
  import { useState } from "react";
  import { useLoading } from "../Loader/LoadingProvider";
  
  function AddStageDialog(props) {
    const { onClose, open } = props;
    const { setLoading } = useLoading();
    const [value, setValue] = useState({
      name: "",
      description: "",
    });
    const [toast, setToast] = useState({
      status: "",
      open: false,
      message: "",
    });
    const handlePopupClose = () => {
      onClose();
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };
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
        let headers = new Headers();
        headers.append("content-type", "application/json");
        try {
          await fetch("http://localhost:5134/api/login", {
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
                handlePopupClose();
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
        <DialogTitle> Create Item </DialogTitle>
        <DialogContent>
          <Box className="login-box">
            <Paper elevation={3}>
              <Stack
                component="form"
                sx={{ padding: "20px" }}
                spacing={2}
                noValidate
              >
                <p> Login </p>
                <Divider />
                <FormControl variant="outlined">
                  <TextField
                    id="list-name-add"
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={value.name}
                    onChange={valueChange}
                  />
                </FormControl>
  
                <FormControl variant="outlined">
                  <TextField
                    id="list-description-add"
                    label="Description"
                    variant="outlined"
                    type="text"
                    multiline={true}
                    name="description"
                    value={value.description}
                    onChange={valueChange}
                  />
                </FormControl>
                <Divider />
                <Button
                  type="button"
                  onClick={formSubmittted}
                  variant="contained"
                >
                  Add List
                </Button>
              </Stack>
            </Paper>
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
  