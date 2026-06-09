import {
  useRef,
  useContext,
  useCallback,
  useState,
  createContext,
  useEffect,
} from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import type { ReactNode } from "react";

type Responder = () => boolean;

export type KeyboardContextProviderProps = {
  push: (name: string, responder: Responder) => void;
  pop: (name: string) => void;
  isTopLayer: (name: string) => boolean;
  setResponder: (name: string, responder?: Responder | null) => void;
};

type KeyboardProviderProps = {
  children: ReactNode;
};

const KeyboardContext = createContext<KeyboardContextProviderProps | null>(
  null,
);

export const useKeyboardContext = () => {
  const value = useContext(KeyboardContext);
  if (!value) {
    return null;
  }
  return value;
};

export const KeyboardProvider = ({ children }: KeyboardProviderProps) => {
  const [stack, setStack] = useState<string[]>(["base"]);
  const keyboardControlStackRef = useRef(stack);
  const responders = useRef<Map<string, Responder>>(new Map());
  const renderer = useRenderer();

  const push = useCallback((name: string, responder: Responder) => {
    if (responders) {
      responders.current.set(name, responder);
    }

    setStack((prev: string[]) => {
      if (prev.includes(name)) {
        return prev;
      }

      return [...prev, name];
    });
  }, []);

  const pop = useCallback((id: string) => {
    responders.current.delete(id);
    setStack((prev) => prev.filter((layer) => layer != id));
  }, []);

  const isTopLayer = useCallback(
    (name: string) => {
      return stack.length === 0 || stack[stack.length - 1] === name;
    },
    [stack],
  );

  useEffect(() => {
    keyboardControlStackRef.current = stack;
  }, [stack]);

  //utility function
  const setResponder = useCallback(
    (name: string, responder?: Responder | null) => {
      if (responder) {
        responders.current.set(name, responder);
      } else {
        responders.current.delete(name);
      }
    },
    [],
  );

  useKeyboard((key) => {
    if (!key.ctrl || key.name !== "c") return;

    const currentStack = keyboardControlStackRef.current;
    for (let i = currentStack.length - 1; i >= 0; i--) {
      const layerId = currentStack[i] as string;
      const responder = responders.current.get(layerId) as Responder;

      if (responders && responder()) {
        return;
      }
    }

    renderer.destroy();
  });

  return (
    <KeyboardContext.Provider value={{ setResponder, pop, push, isTopLayer }}>
      {children}
    </KeyboardContext.Provider>
  );
};
