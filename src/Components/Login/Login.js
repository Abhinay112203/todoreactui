import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Popover,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../Loader/LoadingProvider";
import "./Login.css";
const validationRules = {
  minLength: {
    regex: /^.{8,}$/,
    message: "Minimum 8 characters",
  },
  hasUpperCase: {
    regex: /[A-Z]/,
    message: "At least one uppercase letter",
  },
  hasLowerCase: {
    regex: /[a-z]/,
    message: "At least one lowercase letter",
  },
  hasNumber: {
    regex: /\d/,
    message: "At least one number",
  },
  hasSpecialChar: {
    regex: /[@$!%*?&]/,
    message: "At least one special character (e.g., @$!%*?&)",
  },
};
function Login() {
  const { loading, setLoading } = useLoading();
  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    status: "",
    open: false,
    message: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const [errors, setErrors] = useState(() => {
    const newErrors = [];
    for (const rule in validationRules) {
      newErrors.push({
        state: "warning",
        message: validationRules[rule].message,
      });
    }
    return newErrors;
  });
  async function formSubmittted() {
    console.log(value);
    if (value.email == null || value.email === "" || value.email == undefined) {
      setError("Email is required!");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.email)) {
      setError("Invalid Email");
      return;
    }
    if (errors.filter((val) => val.state !== "success").length > 0) {
      setError("Invalid Password");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      let headers = new Headers();
      headers.append("content-type", "application/json");
      try {
        await fetch("http://68.233.119.75:5236/api/login", {
          method: "POST",
          body: JSON.stringify(value),
          headers,
        }).then(async (res) => {
          if (res.ok) {
            let response = await res.json();
            console.log(response);
            localStorage.setItem("user-id", response.id);
            localStorage.setItem("token", response.token);
            setTimeout(() => {
              navigate("/auth/");
            }, 100);
          }
        });
      } catch (error) {
        setError(JSON.stringify(error));
      }
      setLoading(false);
    }, 3000);
  }
  function valueChange(e) {
    const valueType = e.target.name;
    const newValue = e.target.value;
    setValue({ ...value, [valueType]: newValue });
    if (valueType === "password") {
      const newErrors = [];
      let hasError = false;
      for (const rule in validationRules) {
        let state = validationRules[rule].regex.test(newValue)
          ? "success"
          : "warning";
        if (state === "warning") {
          hasError = true;
        }
        newErrors.push({
          state: state,
          message: validationRules[rule].message,
        });
      }

      setErrors(newErrors);
      if (!hasError) {
        handlePopoverClose();
        return;
      }
    }
  }
  function handleClose() {
    setToast({ ...toast, open: false });
  }
  function setError(message) {
    setToast({ status: "error", open: true, message });
  }

  const handlePopoverOpen = (event) => {
    console.log(errors);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="container">
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
                aria-describedby={id}
                id="email-basic"
                label="Email"
                variant="outlined"
                name="email"
                value={value.email}
                onChange={valueChange}
              />
            </FormControl>

            <FormControl aria-describedby={id} variant="outlined">
              <TextField
                id="password-basic"
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                value={value.password}
                onChange={valueChange}
                onFocus={handlePopoverOpen}
                onBlur={handlePopoverClose}
              />
            </FormControl>
            <Divider />
            <Button type="button" onClick={formSubmittted} variant="contained">
              Login
            </Button>
          </Stack>
        </Paper>
      </Box>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toast.status}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Popover
        id={id}
        disableAutoFocus
        onBlur={handlePopoverClose}
        open={open}
        anchorEl={anchorEl}
        transformOrigin={{
          horizontal: "right",
          vertical: "center",
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        {errors.map((pwdError, idx) => {
          return (
            <Alert
              key={idx}
              style={{ width: "100%" }}
              icon={
                pwdError.state == "success" ? (
                  <CheckCircleOutline fontSize="inherit" />
                ) : (
                  <CancelRounded fontSize="inherit" />
                )
              }
              severity={pwdError.state}
            >
              {pwdError.message}
            </Alert>
          );
        })}
      </Popover>
    </div>
  );
}

export default Login;
