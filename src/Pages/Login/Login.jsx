import { useAuth } from "../../Providers/AuthProvider";

const Login = () => {
  const auth = useAuth();
  console.log(auth);

  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};

export default Login;
