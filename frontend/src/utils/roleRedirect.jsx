export const getUserRoleRedirectPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "user":
    return "/user/dashboard";
    case "facilityowner":
      return "/facilityowner/dashboard";
  }
};
export default getUserRoleRedirectPath;