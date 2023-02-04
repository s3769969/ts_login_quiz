const loginAction = async (creds: {
    username: string;
    password: string;
}): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        if (creds.username === "test" && creds.password === "test") {
            resolve();
        } else {
            reject();
        }
        }, 1000);
    });
};

const authService = {
    loginAction,
  };
  
  export default authService;