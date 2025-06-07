import { useState } from "react";
import Input from "../components/Elements/Input";
import Button from "../components/Elements/Button";
import InputUpload from "../components/Elements/InputUpload";
import AuthLayout from "../components/Layouts/AuthLayout";
import Tesseract from "tesseract.js";
import supabase from "../../supabaseClient";
import {parseKtpText} from '../helper/parseKtpParser'
import { isKecamatanValid } from "../helper/isKecamatanValid";

function Register() {
  const [formData, setFormData] = useState({
    photo: null,
  });

  const MAX_SIZE_MB = 1;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleClearFile = () => {
    setFormData({ ...formData, photo: null });
  };

  // fungsi yang dipanggil ketika click submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = formData.photo;

    if (!file) {
      alert("Mohon upload foto KTP terlebih dahulu.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert("Ukuran gambar melebihi 1MB!");
      return;
    }

    try {
      // Run OCR on the uploaded image
      const { data } = await Tesseract.recognize(file, "eng+ind", {
        logger: (m) => console.log(m),
      });

      const extractedText = data.text;
      console.log("Extracted Text:", extractedText);
      const parsedData = parseKtpText(extractedText);
      console.log("Parsed KTP Data:", parsedData);
      const valid = isKecamatanValid(parsedData.kecamatan);

      // if (!valid) {
      //   alert("Kecamatan tidak valid!");
      //   return; // stop submission
      // }

      if (!extractedText.includes("NIK")) {
        alert("Gagal mengenali KTP. Pastikan foto jelas dan sesuai.");
        return;
      }

      // TODO: proceed with submission, e.g. save to supabase
      // LOGIC SUPABASE SIGNUP / MEMBUAT AKUN
      const { data: authData, error: authError } = await supabase.auth.signUp({
      email : e.target.email.value,
      password : e.target.password.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/profile' 
      }
    });

    if (authError) {
      setRegisterError('Registration failed: ' + authError.message);
      console.log(authError);
      return;
    }

    if (authData.user) {
      // Insert user data into the 'user' table
      const { data, error } = await supabase
        .from('user')
        .insert([{ id: authData.user.id, username : parsedData.nama, email : e.target.email.value, password : e.target.password.value }]);

      if (error) {
        console.error('Failed to save user data: ' + error.message);
        console.log(error);
      } else {
        console.log(data);
      }
    }
      alert("Form siap dikirim! Silahkan check email untuk verifikasi");
      
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Terjadi kesalahan saat membaca gambar.");
    }
  };

  return (
    <AuthLayout
      title="Daftar untuk akun Anda"
      bottomText="Sudah punya akun?"
      bottomLink="Masuk"
      bottomHref="/login"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
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
          label="Foto KTP"
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
