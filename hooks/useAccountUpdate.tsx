import { useCallback, useState } from "react";

type UpdatePayload = Partial<{
  name: string;
  email: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  // Add other allowed fields as needed
}>;

type UpdateResponse<T = any> = {
  message?: string;
  data?: T;
  error?: string;
};

export function useAccountUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<UpdateResponse | null>(null);

  const updateAccount = useCallback(async (payload: UpdatePayload) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch(
        "https://nutrisight-backend-dd22d1bd9780.herokuapp.com/account/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add auth headers if needed, e.g. Authorization
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      console.log("Update response:", result.data);
      if (!res.ok) {
        setError(result.error || "Failed to update account");
        setResponse(null);
      } else {
        setResponse(result);
      }
    } catch (err: any) {
      setError(err.message || "Network error");
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateAccount, isLoading, error, response };
}
