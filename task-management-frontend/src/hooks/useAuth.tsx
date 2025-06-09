export const useAuth = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("token");
  return { user, token };
};

export default useAuth;
