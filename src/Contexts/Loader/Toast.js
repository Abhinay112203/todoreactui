import { Alert, Snackbar } from "@mui/material";
import { useToast } from "./LoadingProvider";

function CustomToast() {
  const { toast, setToast } = useToast();
  function handlePopupClose() {
    setToast({ open: false, status: "", message: "" });
  }
  return (
    <>
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
    </>
  );
}
export default CustomToast;