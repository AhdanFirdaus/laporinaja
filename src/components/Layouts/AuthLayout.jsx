import { Link } from "react-router";

const AuthLayout = ({ title, children, bottomText, bottomLink, bottomHref }) => {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold font-second tracking-tight text-soft-orange">
            {title}
          </h2>
        </div>

        <div className="mt-6">
          {children}
          <p className="mt-6 text-center text-sm text-gray-500">
            {bottomText}{' '}
            <Link to={bottomHref} className="font-semibold text-soft-orange hover:text-soft-orange/80">
              {bottomLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;