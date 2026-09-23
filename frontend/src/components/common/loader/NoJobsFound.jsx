import React,{useState} from "react";
import download from "../../../assets/images/download.png"
import { LoaderCircle, LoaderIcon } from "lucide-react";
const NoJobsFound = ({ message = "No jobs available right now" }) => {
  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
  setLoading(true);
  setTimeout(() => {
    window.location.reload();
  }, 1500); // 1.5 sec delay for loader effect
};
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <img
        src={download}
        alt="No Jobs"
        className="object-contain mb-4"
      />
      <h2 className="text-gray-800 text-xl font-semibold">{message}</h2>
      <p className="text-gray-500 text-sm mt-1 max-w-sm">
        Try adjusting your filters or search terms to discover more opportunities.
      </p>
{loading ? (
  <div className="flex items-center gap-2 mt-6 text-[#20365c] font-medium">
    <LoaderCircle className="animate-spin" size={22} strokeWidth={2.5} />
    Refreshing...
  </div>
) : (
  <button
    onClick={handleRefresh}
    className="mt-6 px-10 py-3 bg-[#20365c] text-white rounded-full hover:bg-[#c7d9ff] hover:text-black cursor-pointer font-bold duration-300 transform ease-in transition-all shadow-sm"
  >
    Refresh Jobs
  </button>
)}

    </div>
  );
};

export default NoJobsFound;
