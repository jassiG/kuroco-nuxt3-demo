import { ref } from 'vue';

const profile = ref(null);

export function useProfileStore() {
  const setProfile = (data) => {
    profile.value = data;
  };

  return {
    profile,
    setProfile,
  };
}

export async function getProfile() {
  const res = await useFetch('/rcms-api/13/profile',{
    baseURL:useRuntimeConfig().public.apiBase,
    credentials: 'include',
  });
  return res.data.value;
}
