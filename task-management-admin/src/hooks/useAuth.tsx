export const useAuth = () => {
    const userString = localStorage.getItem("admin");
    const user = userString ? JSON.parse(userString) : null;
    console.log(user)
    const token = localStorage.getItem("token");
    console.log(token)
    return { user, token };
  };
  
  export default useAuth;
  