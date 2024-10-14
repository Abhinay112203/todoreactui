import { createContext, useContext, useState } from "react";
import CustomToast from "./Toast";

const LoadingContext = createContext({
  loading: false,
  setLoading: null,
});
const ToastContext = createContext({
  toast: { status: "", open: false, message: "" },
  setToast: null,
});

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ status: "", open: false, message: "" });
  const value = { loading, setLoading };
  const toastValue = { toast, setToast };
  return (
    <LoadingContext.Provider value={value}>
      <ToastContext.Provider value={toastValue}>
        <CustomToast/>
        {children}
      </ToastContext.Provider>{" "}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
export function useToast(){
  const context = useContext(ToastContext);
  if(!context){
    throw new Error("useToast must be used within Toast Provider")
  }

  return context;
}
