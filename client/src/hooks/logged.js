export const isLoggedIn = () => {
    const token = localStorage.getItem('myToken'); 
    return!!token;
  };