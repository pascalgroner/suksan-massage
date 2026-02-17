"use client";

import { BorderStyle, ChartMode, ChartVariant, DataThemeProvider, IconProvider, LayoutProvider, NeutralColor, ScalingSize, Schemes, SolidStyle, SolidType, SurfaceStyle, Theme, ThemeProvider, ToastProvider, TransitionStyle } from "@once-ui-system/core";
import { style, dataStyle } from "../resources/once-ui.config";
import { iconLibrary } from "../resources/icons";
import { createContext, useContext, useState } from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a Providers");
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(style.theme);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <LayoutProvider>
        <ThemeProvider
          theme={theme as Theme}
          brand={style.brand as Schemes}
          accent={style.accent as Schemes}
          neutral={style.neutral as NeutralColor}
          solid={style.solid as SolidType}
          solidStyle={style.solidStyle as SolidStyle}
          border={style.border as BorderStyle}
          surface={style.surface as SurfaceStyle}
          transition={style.transition as TransitionStyle}
          scaling={style.scaling as ScalingSize}
        >
          <DataThemeProvider
            variant={dataStyle.variant as ChartVariant}
            mode={dataStyle.mode as ChartMode}
            height={dataStyle.height}
            axis={{
              stroke: dataStyle.axis.stroke
            }}
            tick={{
              fill: dataStyle.tick.fill,
              fontSize: dataStyle.tick.fontSize,
              line: dataStyle.tick.line
            }}
            >
            <ToastProvider>
              <IconProvider icons={iconLibrary}>
                {children}
              </IconProvider>
            </ToastProvider>
          </DataThemeProvider>
        </ThemeProvider>
      </LayoutProvider>
    </ThemeContext.Provider>
  );
}