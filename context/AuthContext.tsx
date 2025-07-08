import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "192.168.2.1:3000";

export interface UserType {
  gmailId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
}

export interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
}

export const UserContext = createContext<AuthContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/auth/session`, {
          credentials: "include",
        });
        console.log("Session response:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Session data:", data);
          if (data && data.user) {
            setUser(data.user);
            router.replace("/(root)/(tabs)/home");
          }
        } else {
          console.log("No active session found.");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        setUser(data.user);
        router.replace("/(root)/(tabs)/home");
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed, please check your credentials.");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const signWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        if (idToken) {
          const serverResponse = await fetch(
            `${BACKEND_URL}/auth/google/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ idToken }),
            }
          );

          if (!serverResponse.ok) {
            throw new Error("Google Sign-In failed on the server.");
          }

          const data = await serverResponse.json();
          setUser(data.user);
          router.replace("/(root)/(tabs)/home");
        } else {
          throw new Error(
            "Google Sign-In failed: idToken is null. Ensure webClientId is configured correctly."
          );
        }
      } else {
        throw new Error("Google Sign-In failed");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      if (
        isErrorWithCode(error) &&
        error.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        // User cancelled the sign-in flow
      } else {
        throw new Error("An error occurred during Google Sign-In.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        const data = await response.json();
        if (data.userId) {
          router.replace({ pathname: "/(auth)/otp", params: { email } });
          return true;
        } else {
          throw new Error("Registration failed, please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Registration failed, please try again.");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const verifyOtp = useCallback(
    async (otp: string, email: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, email }),
        });

        if (!response.ok) {
          throw new Error("Email verification failed");
        }

        const data = await response.json();
        setUser(data.user);
        router.replace("/(root)/(tabs)/home");
      } catch (error) {
        console.error("OTP verification error:", error);
        throw new Error("OTP verification failed, please try again.");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const resendOtp = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/auth/send-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Resend OTP failed");
      }

      const data = await response.json();
      console.log("OTP resent successfully:", data);
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw new Error("Resend OTP failed, please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed, please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      signWithGoogle,
      verifyOtp,
      register,
      resendOtp,
    }),
    [
      user,
      loading,
      login,
      logout,
      signWithGoogle,
      verifyOtp,
      register,
      resendOtp,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}
