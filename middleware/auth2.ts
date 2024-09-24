export default async ({ app, store, redirect }) => {
  if (!store.getters.authenticated) {
    return redirect('/login');
  }
  await null;
};
