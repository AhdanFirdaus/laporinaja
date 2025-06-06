import Input from "../components/Elements/Input";
import Button from "../components/Elements/Button";
import AuthLayout from "../components/Layouts/AuthLayout";

function Login() {
  return (
    <AuthLayout
      title="Masuk ke akun Anda"
      bottomText="Belum punya akun?"
      bottomLink="Daftar"
      bottomHref="/register"
    >
      <form className="space-y-6">
        <Input
          label="Email"
          id="email"
          name="email"
          type="text"
          autoComplete="email"
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full">
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;
