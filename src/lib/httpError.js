import axios from "axios";

const buildError = (message, extra = {}) => {
  const err = new Error(message || "Something went wrong");
  Object.assign(err, extra);
  return err;
};

const normalizeZodErrors = (errors) => {
  if (!Array.isArray(errors)) return { details: [], fieldErrors: {} };
  const details = [];
  const fieldErrors = {};
  errors.forEach((item) => {
    const rawField = item?.field || item?.path || "";
    const field = String(rawField)
      .replace(/^(body|params|query)\./, "")
      .trim();
    const message = item?.message || "Invalid value";
    const label = field ? `${field}: ${message}` : message;
    details.push(label);
    if (field) {
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(message);
    }
  });
  return { details, fieldErrors };
};

export const extractErrorMessage = (error, fallback = "Something went wrong") => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const baseMessage =
      data?.message || data?.error || error.message || fallback;
    const { details, fieldErrors } = normalizeZodErrors(data?.errors);
    return buildError(baseMessage, {
      details,
      fieldErrors,
      status: error.response?.status,
      errorCode: data?.errorCode,
      requestId: data?.requestId,
      raw: data,
    });
  }

  if (error instanceof Error) return error;
  if (typeof error === "string") return buildError(error);
  if (error && typeof error === "object") {
    const message = error?.message || fallback;
    return buildError(message, error);
  }

  return buildError(fallback);
};

export const getErrorDisplay = (error, fallback = "Something went wrong") => {
  if (!error) return { message: "", details: [] };
  if (typeof error === "string") return { message: error, details: [] };
  const message = error?.message || fallback;
  const details = Array.isArray(error?.details) ? error.details : [];
  return { message, details };
};

export const formatErrorMessage = (error, fallback = "Something went wrong") => {
  const { message, details } = getErrorDisplay(error, fallback);
  if (!details.length) return message;
  return `${message} (${details.join("; ")})`;
};

export default extractErrorMessage;
