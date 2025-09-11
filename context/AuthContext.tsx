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

import { Alert } from "react-native";

export const BACKEND_URL =
  "https://nutrisight-backend-dd22d1bd9780.herokuapp.com";

export interface NutritionalData {
  [key: string]: number;
}

export interface DietHistory {
  date: string;
  nutritionalData: NutritionalData[];
  breakfast: { name: string; calorie: number }[];
  lunch: { name: string; calorie: number }[];
  dinner: { name: string; calorie: number }[];
  otherMealTime: { name: string; calorie: number }[];
}

export interface LoggedWeight {
  value: number;
  label:
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec";
  year: number;
}

export type DailyRecommendationType = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};

export interface UserType {
  _id: string; // (dynamic)
  gmailId?: string; // (dynamic)
  profileLink?: string; // (dynamic)
  gender?: string; // (dynamic)
  birthDate?: Date; // (dynamic)
  heightFeet?: number; // in feet (dynamic)
  heightInches?: number; // in inches (dynamic)
  weight?: number; // in kg (dynamic)
  targetWeight?: number; // in kg (dynamic)
  weightGoal?: string; // gain/maintain/lose (dynamic)
  bmi?: number; // Body Mass Index (dynamic)
  allergens?: string[]; // Array of allergens (dynamic)
  medicalConditions?: string[]; // Array of medical conditions (dynamic)
  dietHistory?: DietHistory[]; // Array of diet history objects (dynamic)
  loggedWeights?: LoggedWeight[]; // Array of logged weight objects (dynamic)
  firstName?: string; // (dynamic)
  lastName?: string; // (dynamic)
  name?: string; // (dynamic)
  email?: string; // (dynamic)
  password?: string; // hidden, always undefined
  otp?: string; // hidden, always undefined
  otpExpires?: Date; // hidden, always undefined
  isVerified: boolean; // (dynamic)
  dietType?: string; // (dynamic)
  dailyRecommendation?: DailyRecommendationType; // (dynamic)
  activityLevel?: string; // (dynamic)
}

export interface AuthContextType {
  checkingSession: boolean;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
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
  onboardingEmail: string | null;
  onboardingSubmission: (
    name: string,
    allergens: string[],
    gender: string,
    birthDate: Date,
    heightFeet: number,
    heightInches: number,
    weight: number,
    email: string,
    weightGoal: string,
    targetWeight: number,
    dietType: string,
    activityLevel: string
  ) => Promise<string>;
  agreement: (email: string) => Promise<void>;
}

export const UserContext = createContext<AuthContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingSession, setCheckingSession] = useState(true);
  const [onboardingEmail, setOnboardingEmail] = useState<string | null>(null);

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
      setCheckingSession(true);
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
        setCheckingSession(false);
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
        Alert.alert("Login failed", "Please check your credentials.");
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
          setOnboardingEmail(data.email);
          router.replace("/(auth)/(setup)/1");
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
          body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (!response.ok) {
          const errorData = !response.ok ? await response.json() : null;
          console.error("Registration failed:", errorData || response);
          if (response.status === 409) {
            throw new Error("Email is already registered.");
          }
          throw new Error(errorData?.message || "Registration failed");
        }

        const data = await response.json();
        return !!data?.userId;
      } catch (error) {
        console.error("Registration error:", error);
        Alert.alert("Registration failed", "Please try again.");
        return false;
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
        console.log("OTP verification successful:", data);
        setOnboardingEmail(data.email);
        router.replace("/(auth)/(setup)/1");
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
      birthDate: Date,
      heightFeet: number,
      heightInches: number,
      weight: number,
      email: string,
      weightGoal: string,
      targetWeight: number,
      dietType: string,
      activityLevel: string
    ) => {
      try {
        if (
          !email ||
          !name ||
          !gender ||
          !birthDate ||
          !heightFeet ||
          !heightInches ||
          !weight ||
          !weightGoal ||
          targetWeight === null ||
          targetWeight === undefined ||
          !dietType ||
          !activityLevel
        ) {
          // find the missing
          const missingFields = [
            !email && "email",
            !name && "name",
            !gender && "gender",
            !birthDate && "birthDate",
            !heightFeet && "heightFeet",
            !heightInches && "heightInches",
            !weight && "weight",
            !weightGoal && "weightGoal",
            targetWeight === null && "targetWeight",
            targetWeight === undefined && "targetWeight",
            !dietType && "dietType",
            !activityLevel && "activityLevel",
          ].filter(Boolean) as string[];

          throw new Error(
            `All fields are required: ${missingFields.join(", ")}`
          );
        }

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
            birthDate,
            heightFeet,
            heightInches,
            weight,
            email,
            weightGoal,
            targetWeight,
            dietType,
            activityLevel,
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
        return data.email;
      } catch (error) {
        console.error("Onboarding submission error:", error);
        return null;
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
        const data = await response.json();
        throw new Error(data.message || "Agreement submission failed");
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
      setOnboardingEmail(null);
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
      checkingSession,
      setUser,
      onboardingEmail,
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
      checkingSession,
      setUser,
      onboardingEmail,
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
