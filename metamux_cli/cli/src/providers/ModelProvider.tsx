import { createContext, useContext } from "react";
import type { Model } from "../models";

type ModelContext = {
  activeModel: Model;
  setActiveModel: () => void;
};

const ModelProviderContext = createContext<ModelContext | null>(null);

const useModelContext = () => {
  const value = useContext(ModelProviderContext);

  if (!value) {
    return;
  }

  return value;
};

type ModelProviderProps = {
  children: ReactNode;
};

const index = () => {
  return <ModelProviderContext.Provider></ModelProviderContext.Provider>;
};
