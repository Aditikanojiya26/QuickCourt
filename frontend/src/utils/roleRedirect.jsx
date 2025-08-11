export const getUserRoleRedirectPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "user":
      return "/user/dashboard";
    default:
      return "/dashboard";
  }
};
export default getUserRoleRedirectPath;