import getProfile from "~/composables/profile";

export default defineNuxtRouteMiddleware(async (to) => {
  getProfile().then((profile) => {
    if (profile.member_id) {
      return;
    }else {
      return '/login';
    }
  });
})
