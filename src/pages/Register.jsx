import { useState } from "react";
import Input from "../components/Elements/Input";
import Button from "../components/Elements/Button";
import InputUpload from "../components/Elements/InputUpload";
import AuthLayout from "../components/Layouts/AuthLayout";

function Register() {
  const [formData, setFormData] = useState({
    photo: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleClearFile = () => {
    setFormData({ ...formData, photo: null });
  };

  return (
    <AuthLayout
      title="Daftar untuk akun Anda"
      bottomText="Sudah punya akun?"
      bottomLink="Masuk"
      bottomHref="/login"
    >
      <form className="space-y-6">
        <Input
          label="Username"
          id="username"
          name="username"
          type="text"
          autoComplete="username"
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        <InputUpload
          label="Foto"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          onClear={handleClearFile}
        />

        <Button type="submit" className="w-full">
          Daftar
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Register;
