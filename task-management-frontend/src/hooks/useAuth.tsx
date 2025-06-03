
export const useAuth = () => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    return {user,token}
  
}

export default useAuth