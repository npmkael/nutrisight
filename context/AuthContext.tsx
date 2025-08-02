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

export const BACKEND_URL =
  "https://nutrisight-backend-dd22d1bd9780.herokuapp.com";

interface NutritionalData {
  [key: string]: number;
}

interface DietHistory {
  date: Date;
  nutritionalData: NutritionalData[];
}

export interface UserType {
  _id: string; // (dynamic)
  gmailId?: string; // (dynamic)
  profileLink?: string; // (dynamic)
  gender?: string; // (dynamic)
  birthdate?: Date; // (dynamic)
  height?: number; // in feet (dynamic)
  weight?: number; // in kg (dynamic)
  targetWeight?: number; // in kg (dynamic)
  bmi?: number; // Body Mass Index (dynamic)
  allergens?: string[]; // Array of allergens (dynamic)
  medicalConditions?: string[]; // Array of medical conditions (dynamic)
  dietHistory?: DietHistory[]; // Array of diet history objects (dynamic)
  firstName?: string; // (dynamic)
  lastName?: string; // (dynamic)
  email?: string; // (dynamic)
  password?: string; // hidden, always undefined
  otp?: string; // hidden, always undefined
  otpExpires?: Date; // hidden, always undefined
  isVerified: boolean; // (dynamic)
}

export interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  registered?: boolean;
  login: (email: string, password: string) => Promise<void>;
  signWithGoogle: () => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  verifyOtp: (otp: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  uploadProfilePicture: (imageUri: string) => Promise<void>;
  onboardingSubmission: (
    name: string,
    allergens: string[],
    gender: string,
    age: number,
    height: number,
    weight: number,
    email: string
  ) => Promise<void>;
  agreement: (email: string) => Promise<void>;
}

export const UserContext = createContext<AuthContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState<boolean>(false);

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
          console.log("Session data:", data.user);
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
          router.replace("/(auth)/sign-in");
          throw new Error("Login failed");
        }

        const data = await response.json();
        setUser(data.user);
        router.replace("/(root)/(tabs)/home");
      } catch (error) {
        console.error("Login error:", error);
        router.replace("/(auth)/sign-in");
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
            router.replace("/(auth)/sign-in");
            throw new Error("Google Sign-In failed on the server.");
          }

          const data = await serverResponse.json();
          if (data.user) {
            setUser(data.user);
            router.replace("/(root)/(tabs)/home");
            return;
          }
          if (!data.success && !data.user && !data.email) {
            router.replace("/(auth)/sign-in");
            throw new Error("Google Sign-In failed, please try again.");
          }
          router.replace({
            pathname: "/(auth)/welcome",
            params: { email: data.email },
          });
        } else {
          router.replace("/(auth)/sign-in");
          throw new Error(
            "Google Sign-In failed: idToken is null. Ensure webClientId is configured correctly."
          );
        }
      } else {
        router.replace("/(auth)/sign-in");
        throw new Error("Google Sign-In failed");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      if (
        isErrorWithCode(error) &&
        error.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        router.replace("/(auth)/sign-in");
      } else {
        router.replace("/(auth)/sign-in");
        throw new Error("An error occurred during Google Sign-In.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ): Promise<boolean> => {
      try {
        setLoading(true);
        console.log("Registering user:", {
          firstName,
          lastName,
          email,
          password,
        });
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const errorData = !response.ok ? await response.json() : null;
          console.error("Registration failed:", errorData || response);
          if (response.status === 409) {
            router.replace("/(auth)/sign-up");
            throw new Error("Email is already registered.");
          }
          router.replace("/(auth)/sign-up");
          throw new Error(errorData?.message || "Registration failed");
        }

        const data = await response.json();
        if (data.userId) {
          router.replace({ pathname: "/(auth)/otp", params: { email } });
          return true;
        } else {
          router.replace("/(auth)/sign-up");
          throw new Error("Registration failed, please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        router.replace("/(auth)/sign-up");
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
          router.replace("/(auth)/sign-up");
          throw new Error("OTP verification failed");
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error("OTP verification failed, please try again.");
        }
        router.replace("/(auth)/welcome");
      } catch (error) {
        console.error("OTP verification error:", error);
        router.replace("/(auth)/sign-up");
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

  const onboardingSubmission = useCallback(
    async (
      name: string,
      allergens: string[],
      gender: string,
      age: number,
      height: number,
      weight: number,
      email: string
    ) => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/auth/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            allergens,
            gender,
            age,
            height,
            weight,
            email,
          }),
        });
        if (!res.ok) {
          console.error("Onboarding submission failed:", res);
          throw new Error("Onboarding submission failed, please try again.");
        }

        const data = await res.json();
        if (!data.success) {
          throw new Error("Onboarding submission failed, please try again.");
        }
        console.log("Onboarding submission successful:", data);
        setRegistered(true);
      } catch (error) {
        console.error("Onboarding submission error:", error);
        throw new Error("Onboarding submission failed, please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const agreement = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/auth/agreement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Agreement submission failed");
      }

      const data = await response.json();
      if (!data.user) {
        throw new Error("Agreement submission failed, please try again.");
      }
      setUser(data.user);
      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Agreement submission error:", error);
      throw new Error("Agreement submission failed, please try again.");
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
        router.replace("/(root)/(tabs)/home");
        throw new Error("Logout failed");
      }

      setUser(null);
      setRegistered(false);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      router.replace("/(root)/(tabs)/home");
      throw new Error("Logout failed, please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const uploadProfilePicture = useCallback(
    async (imageUri: string) => {
      try {
        setLoading(true);

        // Create form data
        const formData = new FormData();
        formData.append("profilePicture", {
          uri: imageUri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);

        const response = await fetch(
          `${BACKEND_URL}/account/change-profile-picture`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!response.ok) {
          console.error("Upload profile picture failed:", response);
          throw new Error("Failed to upload profile picture");
        }

        const data = await response.json();
        // Optionally update user profile in state
        setUser((prev) =>
          prev ? { ...prev, profileLink: data.profileLink } : prev
        );
        router.replace("/(root)/(tabs)/account");
      } catch (error) {
        console.error("Upload profile picture error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, setUser]
  );

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
      uploadProfilePicture,
      onboardingSubmission,
      agreement,
      registered,
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
      uploadProfilePicture,
      onboardingSubmission,
      agreement,
      registered,
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
