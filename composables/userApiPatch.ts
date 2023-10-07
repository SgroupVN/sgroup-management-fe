import { getApiBaseUrl } from "./../utils/config";
import { useAuthStore } from "~/store/auth";

export default function useApiPatch<T>(url: string, opts: any = {}) {
  url = getApiBaseUrl() + url;
  const bearerToken = useAuthStore().bearerToken;
  const defaultHeaders = {
    Authorization: bearerToken,
  };
  return $fetch<T>(url, {
    ...opts,
    method: "patch",
    headers: {
      ...opts.headers,
      ...defaultHeaders,
    },
  });
}
