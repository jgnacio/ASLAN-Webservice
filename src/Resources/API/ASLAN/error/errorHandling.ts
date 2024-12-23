import { AxiosError } from "axios";

export function handleApiError(error: any) {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;

    // Network Errors
    if (axiosError.code === "ECONNREFUSED") {
      console.error(
        "Error: Connection refused. Ensure the API URL is correct and the server is accessible."
      );
    } else if (axiosError.code === "ETIMEDOUT") {
      console.error(
        "Error: Connection timed out. Check your network or API server."
      );
    }

    // HTTP Response Errors
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      console.error(`HTTP Error: ${status} - ${JSON.stringify(data)}`);
    } else {
      console.error("Unknown Axios Error:", axiosError.message);
    }
  } else {
    console.error("Unexpected Error:", error.message);
  }
}
