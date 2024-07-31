import { getProfile, useProfileStore } from "~/composables/profile";

export default defineNuxtRouteMiddleware(async (to) => {
  const { setProfile } = useProfileStore();

  getProfile().then((profile) => {
    if (profile.member_id) {
      setProfile(profile);
      return;
    }else {
      return '/login';
    }
  });
})
