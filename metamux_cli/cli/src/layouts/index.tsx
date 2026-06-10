import { KeyboardProvider } from "../providers/KeyboardProvider";
import { DialogProvider } from "../providers/DialogProvider";
import { ToastProvider } from "../providers/ToastProvider";
import { Outlet } from "react-router";

const index = () => {
  return (
    <KeyboardProvider>
      <DialogProvider>
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </DialogProvider>
    </KeyboardProvider>
  );
};

export default index;
