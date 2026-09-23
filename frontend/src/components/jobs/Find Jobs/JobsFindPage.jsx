import { useState, useEffect, useCallback } from "react";
// import supabase from "../../../services/supabaseClient";
import JobCard from "./JobCard";
import JobDetailsCard from "../Find Jobs/jobDeatilsCard";
import SearchBar from "../SearchBar/searchBar";
import NavBar from "../../common/navbar/Navbar"

import { useLocation, useParams } from "react-router-dom";
import NeoJobLoader from "../../common/loader/NeoJobLoader";
import AnimatedJobPlaceholder from "../../common/loader/AnimatedJobPlaceholder";
import NoJobsFound from "../../common/loader/NoJobsFound";
import BigJobLoader from "../../common/loader/BigJobLoader";
import { CircleArrowLeft } from "lucide-react";
import API from "../../../services/api/api.js";
import { Category } from "@mui/icons-material";
const FindJobsPage = () => {
  const location = useLocation();
  const { id } = useParams();
  // console.log(id, "jobid............");

  // const [allJobs, setAllJobs] = useState([]);
  // const [jobs, setJobs] = useState([]);  
  // const [selectedJob, setSelectedJob] = useState(null);
  // const [loading, setLoading] = useState(false);

  const [allJobs, setAllJobs] = useState([]);
  // console.log(allJobs, "alljobs");

  const [jobs, setJobs] = useState([]);
  // console.log(jobs, "jobs...........filter");

  const [selectedJob, setSelectedJob] = useState(null);
  // console.log(selectedJob,"selectedjob..........");



  const [loading, setLoading] = useState(true);


  const [jobLoading, setJobLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword")||"";
  const locationName=queryParams.get("location")||""  
  const categoryFilter = queryParams.get("category");

  // const rememberedState = useMemo(() => {
  //   return {
  //     keyword: location.state?.keyword ?? "",
  //     location: location.state?.location ?? ""
  //   };
  // }, [location.state]);
  // const [filters, setFilters] = useState({
  //   keyword:keyword || "",
  //   location:locationName || "",
  // });
  /* -----------------------------------------
     1️⃣ Apply filters passed using location.state
     ----------------------------------------- */
  // useEffect(() => {
  //   if (!location.state) return;

  //   const { keyword, location: loc } = location.state;

  //   setFilters((prev) => ({
  //     ...prev,
  //     keyword: keyword || "",
  //     location: loc || "",
  //   }));
  // }, [location.state]);

  /* -----------------------------------------
     2️⃣ Fetch jobs (category-based)
  ----------------------------------------- */
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);

      const res = await API.get(`/v1/jobs/get`)
      let jobsData = res?.data?.job || [];

      if (categoryFilter) {
        jobsData = jobsData.filter((job) => job.jobCategory.toLowerCase() === categoryFilter.toLowerCase())
      }
      setAllJobs(jobsData || []);
      setJobs(jobsData);
      setLoading(false);
    };

    loadJobs();
  }, [categoryFilter]);

  /* -----------------------------------------
     3️⃣ Auto fetch single job when ID exists
  ----------------------------------------- */
  useEffect(() => {
    if (!id) return;

    const fetchSingle = async () => {
      setJobLoading(true);

      const res = await API.get(`/v1/jobs/${id}`)
      // console.log(res,"res.................");
      const data = res.data.job

      setSelectedJob(data || null);
      setJobLoading(false);
    };

    fetchSingle();
  }, [id]);

  /* -----------------------------------------
     4️⃣ Optimized Filtering when filters change
  ----------------------------------------- */
  const handleSearch = useCallback(({ keyword = "", location = "" }) => {
    let filtered = [...allJobs]
    if (keyword?.trim()!=="") {
      const word = keyword.toLowerCase().split(" ")
      filtered = filtered.filter((job) => {
        const title = (job.jobTitle || "").toLowerCase()
        return word.some(word => title.includes(word))
      })
    }
    if (location?.trim()!=="") {
      const locWord = location.toLowerCase().split(" ")
      filtered = filtered.filter((job) => {
        const jobLoc = (job.location || "").toLowerCase();
      return locWord.every(word => jobLoc.includes(word))
    });
  }
  setJobs(filtered)


}, [allJobs]);

  useEffect(() => {




    handleSearch({
      keyword:keyword,
      location:locationName,
    })
  }, [handleSearch, keyword, locationName])

  // useEffect(() => {
  //   let filtered = [...allJobs];

  //   // location filter
  //   if (filters?.location?.trim() !== "") {
  //     const loc = filters?.location?.toLowerCase();
  //     filtered = filtered.filter((job) =>
  //       job.location?.toLowerCase().includes(loc)
  //     );
  //     console.log(filtered);

  //   }

  //   // keyword filter
  //   if (filters?.keyword?.trim() !== "") {
  //     const k = filters.keyword.toLowerCase().split(" ");

  //     filtered = filtered.filter((job) => {
  //       const text = `
  //     ${job.title || ""} 
  //     ${job.company || ""} 
  //     ${job.description || ""}
  //   `.toLowerCase();

  //       return k.every((word) => text.includes(word));
  //     });
  //   }

  //   setJobs(filtered);
  // }, [filters, allJobs]);

  /* -----------------------------------------
     5️⃣ Handle job click with delay animation
  ----------------------------------------- */
  
  const handleSelectedJob = (job) => {
    setJobLoading(true);
    setSelectedJob(null);

    setTimeout(() => {
      setSelectedJob(job);
      setJobLoading(false);
    }, 3);
  };

  /* -----------------------------------------
     6️⃣ Debounced location suggestion search
  ----------------------------------------- */
  // const fetchLocationSuggestion = async (query) => {
  //   if (!query || query.length < 2) {
  //     setLocationSuggestions([]);
  //     return;
  //   }

  //   const { data } = await supabase
  //     .from("Jobs")
  //     .select("location")
  //     .ilike("location", `%${query}%`)
  //     .limit(10);

  //   if (data) {
  //     const unique = [...new Set(data.map((i) => i.location).filter(Boolean))];
  //     setLocationSuggestions(unique);
  //   }
  // };

  // const debouncedFetch = useMemo(
  //   () => debounce(fetchLocationSuggestion, 300),
  //   []
  // );

  // useEffect(() => {
  //   return () => debouncedFetch.cancel();
  // }, [debouncedFetch]);

  /* -----------------------------------------
     7️⃣ SearchBar → sets filters here
  ----------------------------------------- */

return (
  <>
    <div className="h-20">
      <NavBar></NavBar>
    </div>
    <SearchBar onSearch={handleSearch}
    //  k={location?.state?.keyword || filters?.keyword} l={location?.state?.location || filters?.location}
    />
    {categoryFilter && (
      <div className="text-center mt-6 mb-10 p-4">
        <h2 className="text-xl font-semibold text-[#20365c]">
          Showing jobs for category:{" "}
          <span className="font-bold">{categoryFilter}</span>
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 text-lg">Refreshing....</div>
        ) : (
          <button
            onClick={() => (window.location.href = "/jobs")}
            className="mt-3 px-7 py-3 bg-[#20365c] text-white rounded-full transition-all cursor-pointer hover:bg-[#c7d9ff] hover:text-black duration-300 ease-in font-bold"
          >
            Show All Jobs
          </button>
        )}
      </div>
    )}
    {loading ? (<NeoJobLoader></NeoJobLoader>) : jobs.length === 0 ? (
      <div className="flex  items-center justify-center min-h-full">
        <NoJobsFound message="No jobs available right now" />
      </div>
    ) : (
      <div className="h-screen flex flex-col lg:flex-row overflow-hidden p-4 sm:p-6 md:p-8 gap-4 items-stretch">
        <div className={`${selectedJob ? "hidden lg:flex" : "flex"
          } flex-col w-full lg:w-[30%] overflow-y-auto pr-2`}>
          <div className="w-full flex flex-col gap-4 overflow-y-auto h-full pr-2" style={{ maxHeight: "calc(100vh - 150px)" }}>
            {jobs?.map((job) => (
              <div
                key={job._id}
                className="cursor-pointer flex justify-center"
                onClick={() => handleSelectedJob(job)}

              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        </div>

        <div className={`${selectedJob ? "flex" : "hidden lg:flex"
          } flex-col lg:w-[70%]`}>
          <button
            onClick={() => setSelectedJob(null)}
            className="text-[#20365c] underline hover:text-[#20365c] mb-3 lg:hidden"
          >
            <CircleArrowLeft className="w-10 h-10" />
          </button>
          {jobLoading ? (<BigJobLoader></BigJobLoader>) : selectedJob ? (
            <div className="animate-fadeIn"><JobDetailsCard job={selectedJob} /></div>
          ) : (
            <AnimatedJobPlaceholder></AnimatedJobPlaceholder>
          )}
        </div>
      </div>
    )}
  </>
);
};

export default FindJobsPage;