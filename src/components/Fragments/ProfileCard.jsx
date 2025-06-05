import Button from "../Elements/Button";

const ProfileCard = ({ user }) => {
  return (
    <div className="flex flex-col gap-6 md:gap-8 p-6 md:p-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row mx-auto md:mx-0">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-16 h-16 md:w-24 md:h-24 rounded-full md:rounded-md"
          />
          <div>
            <p className="text-lg md:text-xl text-center md:text-start font-bold">
              {user.fullName}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mx-auto md:mx-0 flex-col sm:flex-row">
          <Button>Edit profile</Button>
          <Button>Change password</Button>
        </div>
      </div>

      {/* Detail Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-700">
        <div>
          <p className="font-semibold uppercase">NIK</p>
          <p>{user.nik}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Tanggal Lahir</p>
          <p>{user.birthDate}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Jenis Kelamin</p>
          <p>{user.gender}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Alamat</p>
          <p>
            {user.address.rtRw}, {user.address.kelurahan},{" "}
            {user.address.kecamatan}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;