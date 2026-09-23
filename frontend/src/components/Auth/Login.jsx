import { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { Link } from "react-router-dom";
import images from "../../assets/images/hirelo-logo.svg";
import toast, { Toaster } from "react-hot-toast";
import { loginSchema } from "../../utils/schemas/LoginSchema"
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
  const { signInUser } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = (message, type = "success") => {
    if (type === "error") {
      toast.error(message, { position: "top-center" });
    } else {
      toast.success(message, { position: "top-center" });
    }
  };
  const [searchParams] = useSearchParams();

useEffect(() => {
  if (searchParams.get("verified") === "true") {
    toast.success("Email verified successfully! Please login now. 🎉", {
      position: "top-center",
    });
  }
}, [searchParams]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      setErrors({})
      await loginSchema.validate({ email, password }, { abortEarly: false });
      const result = await signInUser({ email, password });
      console.log(result, "result");

      if (!result) return;
      // await signInUser({email, password});
      // showToast("Login successful!", "success");
      // setTimeout(() => {
      //   toast.dismiss()
      //   // navigate("/");
      // }, 1000);
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((error) => {
          fieldErrors[error.path] = error.message
        });
        setErrors(fieldErrors);
        showToast("Please fix the highlighted errors", "error");
      } else {
        // showToast(err.message, "error");
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div className="auth-surface">
        

        <div className="auth-card">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-44 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold  text-[#20365c]">
                <img src={images} alt="Hirelo" className="" />
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 text-white/90">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              type="email"
              placeholder="Email"
              className="p-3 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-[#cbdcfc]"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            <div className="relative">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 pr-10 rounded-md bg-white/20 border border-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-[#cbdcfc]"
              />
              {/* Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 bg-gradient-to-r from-mint-300 to-white text-[#20365c] font-semibold rounded-md p-3 hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2 cursor-pointer ${loading
                ? "opacity-60 cursor-not-allowed pointer-events-none"
                : ""
                }`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-[#20365c] border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Signing in?" : "Login"}

            </button>
          </form>

          {/* Create Account Link */}
          <p className="mt-4 text-center text-white/80">
            Don't have an account?{" "}
            <Link
              to="/Signup"
              className="text-[#cbdcfc] font-semibold hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
