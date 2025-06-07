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

    if (e.target.password.value < 6) {
      alert('password harus lebih dari 6 !')
      return 
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
      alert('Registration failed: ' + authError.message);
      console.log(authError);
      return;
    }

    if (authData.user) {
      // Insert user data into the 'user' table
      const [day, month, year] = parsedData.tanggalLahir.split("-");
      const formated_tanggal = `${year}-${month}-${day}`;
      const { data, error } = await supabase
        .from('user')
        .insert([{
        id: authData.user.id,
        email: e.target.email.value,
        username: parsedData.nama,
        nik: parsedData.nik,
        gender: parsedData.jenisKelamin,
        kelurahan: parsedData.kelurahan,
        tanggal_lahir: formated_tanggal,
        rt: parsedData.rtRw.split("/")[0]?.trim(),
        rw: parsedData.rtRw.split("/")[1]?.trim(),
        kecamatan: parsedData.kecamatan,
        role: "user" // or any default role you prefer
      }])
      // UPLOAD FILE
      const fileExt = file.name.split('.').pop(); // jpg, png, etc
      const fileName = `${authData.user.id}.${fileExt}`; // e.g., 3a1c2b-... .jpg
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('fotoktp')
        .upload(filePath, file);

      if (uploadError) {
        alert('Upload gagal: ' + uploadError.message);
        return;
      }
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
