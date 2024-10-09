import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";

function CreateItemDialog(props) {
  const { onClose, open } = props;
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle> Create Item </DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={3}>
          <FormControl>
            <TextField 
            label="apple"
            ></TextField>
          </FormControl>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CreateItemDialog;
