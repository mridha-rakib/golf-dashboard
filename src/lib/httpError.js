import axios from "axios";

export const extractErrorMessage = (error, fallback = "Something went wrong") => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
};

export default extractErrorMessage;
