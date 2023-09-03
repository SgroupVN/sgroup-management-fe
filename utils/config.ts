export const defaultAPIBaseURL = '/api/';

export const getApiBaseUrl = () => {
    const runtimeConfig = useRuntimeConfig();
    const apiBaseUrl = runtimeConfig.public.apiBaseUrl;

    return apiBaseUrl || defaultAPIBaseURL;
};
