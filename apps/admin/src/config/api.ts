const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

if (!apiUrl) {
  throw new Error("VITE_API_URL must be configured for the admin application");
}

type ApiError = {
  message?: string;
};

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";
type ApiBody = Record<string, unknown> | FormData;

export async function apiRequest<T>(
  path: string,
  body?: ApiBody,
  method: ApiMethod = "POST",
): Promise<T> {
  const isFormData = body instanceof FormData;
  const response = await fetch(`${apiUrl}/api/v1/${path}`, {
    ...(method === "GET" || method === "DELETE"
      ? {}
      : { body: isFormData ? body : JSON.stringify(body ?? {}) }),
    credentials: "include",
    ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
    method,
  });
  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.message ?? "The request could not be completed");
  }

  return data;
}
