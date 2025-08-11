import { ClipLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const LoadingSpinner = ({ loading = true }) => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <ClipLoader
        color="#11d8c1ff"
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingSpinner;
