import * as LocalAuthentication from "expo-local-authentication";
import { createContext, useState, useContext, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active" && isAuthenticated) {
          setIsAuthenticated(false);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const authenticate = async (onSuccess: () => void) => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    console.warn("Biometric authentication not available or not enrolled");
    onSuccess();
    return;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to view your data",
    fallbackLabel: "Enter Passcode",
  });

  if (result.success) {
    onSuccess();
  }
};
