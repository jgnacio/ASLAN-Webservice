"use server";
export const getUrlWP = async () => {
  return process.env.WP_URL;
};
