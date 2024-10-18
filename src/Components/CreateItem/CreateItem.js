  import {
    Autocomplete,
    Button,
    createFilterOptions,
    CssBaseline,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useLoading, useToast } from "../../Contexts/Loader/LoadingProvider";
  import { CloseRounded } from "@mui/icons-material";

  function CreateItemDialog(props) {
    const { onClose, open, activeStageId, activeStageName, activeListId } = props;
    const { loading, setLoading } = useLoading();
    const { toast, setToast } = useToast();
    const [users, setUsers] = useState([]);
    const [assigneeEmail, setAssigneeEmail] = useState("");
    const [value, setValue] = useState({
      name: "",
      assignedTo: {id: "789da5c6-8cd0-4a3d-b4fa-4df44243f25c", name: "ADMIN"},
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
    function onAssignedChange(e,k) {
      console.log(k);
    }
    function onSelectChange(e,k) {
      console.log(k);
    }

    async function createItem() {
      let token = localStorage.getItem("token");
      let headers = new Headers();
      headers.append("content-type", "application/json");
      headers.append("Authorization", "Bearer " + token);
      setLoading(true);
      let payload = {
        ...value,
        assigneeEmail
      }
      try {
        await fetch(`/api/ToDo`, {
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

    async function getUsersList() {
      let token = localStorage.getItem("token");
      let headers = new Headers();
      headers.append("content-type", "application/json");
      headers.append("Authorization", "Bearer " + token);

      await fetch(`/api/users/userSuggestions/${activeListId}`, {
        method: "GET",
        headers,
      }).then(async (res) => {
        if (res.ok) {
          let response = await res.json();
          setUsers([...response]);
        }
      });
    }

    useEffect(() => {
      getUsersList();
    }, []);

    const filter = createFilterOptions();
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
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  value={value.assignedTo}
                  options={users.map((option) => option)}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
          
                    if (params.inputValue !== '') {
                      filtered.push({
                        inputValue: params.inputValue,
                        name: `Add New User`,
                      });
                    }
          
                    return filtered;
                  }}
                  getOptionLabel={(option) => {
                    ///////////// This function is used to Add final text to text input once selected
                    // Value selected with enter, right from the input
                    if (typeof option === "string") {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Regular option
                    return option.name;
                  }}
                  onChange={onAssignedChange}
                  autoSelect={true}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option.name}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assigned To"
                      helperText="If new user enter valid email"
                    />
                  )}
                />
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
