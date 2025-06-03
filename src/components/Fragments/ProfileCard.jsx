import Button from "../Elements/Button";

const ProfileCard = ({ user }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md">
      {/* Header: Foto + Nama + Email */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded" />
          <div>
            <p className="text-xl font-bold">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit profile</Button>
          <Button variant="outline">Change password</Button>
        </div>
      </div>

      {/* Detail Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold">NIK</p>
          <p>{user.nik}</p>
        </div>
        <div>
          <p className="font-semibold">Tanggal Lahir</p>
          <p>{user.birthDate}</p>
        </div>
        <div>
          <p className="font-semibold">Jenis Kelamin</p>
          <p>{user.gender}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-semibold">Alamat</p>
          <p>
            {user.address.rtRw}, {user.address.kelurahan}, {user.address.kecamatan}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;