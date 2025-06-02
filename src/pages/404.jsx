import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <h1 className="text-3xl font-bold">Opps!</h1>
      <p className="my-5 text-xl">Sorry, an unexpected error has occurred.</p>
      <p>
        {error.statusText || error.message}
      </p>
    </div>
  );
};

export default ErrorPage;