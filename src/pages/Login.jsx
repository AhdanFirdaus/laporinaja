import { useState } from "react";
import { useNavigate } from "react-router";
import Input from "../components/Elements/Input";
import Button from "../components/Elements/Button";
import AuthLayout from "../components/Layouts/AuthLayout";
import supabase from "../../supabaseClient";

function Login() {
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      // Redirect to profile after successful login
      navigate("/profile");
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <AuthLayout
      title="Masuk ke akun Anda"
      bottomText="Belum punya akun?"
      bottomLink="Daftar"
      bottomHref="/register"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email"
          id="email"
          name="email"
          type="email" // Changed to type="email" for better validation
          autoComplete="email"
          required // Added for form validation
        />
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required // Added for form validation
        />
        {loginError && <p className="text-red-500">{loginError}</p>}
        <Button type="submit" className="w-full">
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;