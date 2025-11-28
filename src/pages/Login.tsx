import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import type { LoginPayload } from "../hooks/useLogin";
import { useUser } from "../contexts/UserContext";

function Login() {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const { setUser } = useUser(); // Step 2: Use the hook instead of useContext directly
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    const response = await login(data);
    // Step 3: Update user context with full response data
    if (response?.access_token) {
      // Store complete user object in context (not just username)
      setUser({
        user_id: response.user_id,
        user: response.user,
        name: response.name,
        email: response.email,
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <input
              {...register("username", { required: "Username is required" })}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Click here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
