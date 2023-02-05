//normally use API endpoint to validate user creds
const loginAction = async (creds: {
    username: string;
    password: string;
}): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        if (creds.username === "test" && creds.password === "test") {
            resolve("Login Success");
        } else {
            reject("Incorrect Credentials");
        }
        }, 1000);
    });
};

const authService = {
    loginAction,
  };
  
  export default authService;