export default async function getProfile() {
  const res = await useFetch('/rcms-api/13/profile',{
    baseURL:useRuntimeConfig().public.apiBase,
    credentials: 'include',
  });
  return res.data.value;
}
