import { KeyboardProvider } from "../providers/KeyboardProvider";
import { DialogProvider } from "../providers/DialogProvider";
import { ToastProvider } from "../providers/ToastProvider";
import { ModelProvider } from "../providers/ModelProvider";
import { Outlet } from "react-router";

const index = () => {
  return (
    <KeyboardProvider>
      <ModelProvider>
        <DialogProvider>
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </DialogProvider>
      </ModelProvider>
    </KeyboardProvider>
  );
};

export default index;
