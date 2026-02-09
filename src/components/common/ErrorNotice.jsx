import React from "react";
import { getErrorDisplay } from "../../lib/httpError";

const ErrorNotice = ({ error, className = "" }) => {
  const { message, details } = getErrorDisplay(error);
  if (!message) return null;

  return (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
    >
      <p className="font-medium">{message}</p>
      {details.length > 0 && (
        <div className="mt-2 space-y-1 text-xs text-red-700">
          {details.map((detail, idx) => (
            <div key={`${detail}-${idx}`}>- {detail}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorNotice;
