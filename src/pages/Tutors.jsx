import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "../components/Shared/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Tutors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["tutorsList", searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({ role: "tutor" });
      if (searchTerm) params.append("search", searchTerm);
      const res = await axios.get(`${API_URL}/users?${params.toString()}`);
      return res.data?.data || res.data?.users || [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-base-content tracking-tight">
            Verified Tutors Directory
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Explore certified educators with verified university backgrounds and track records.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="card bg-base-100 border border-base-200 p-4 rounded-2xl shadow-sm max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search tutor name, degree or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Tutors Grid */}
      {isLoading ? (
        <LoadingSpinner text="Fetching verified tutor listings..." />
      ) : tutors.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl">
          <p className="text-sm text-base-content/60">
            {searchTerm ? "No tutors found matching your search." : "No verified tutors registered yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor._id}
              className="card bg-base-100 border border-base-200 rounded-3xl p-6 text-center space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="avatar mx-auto">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/20 shadow-sm overflow-hidden">
                    <img
                      src={
                        tutor.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          tutor.name || "Tutor"
                        )}&background=0284c7&color=fff`
                      }
                      alt={tutor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-base-content">{tutor.name}</h3>
                  <div className="inline-flex items-center gap-1 text-[11px] text-primary font-bold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Tutor</span>
                  </div>
                </div>

                <p className="text-xs text-base-content/70 line-clamp-2">
                  {tutor.qualifications || tutor.experience || "Master of Science in Education"}
                </p>

                <div className="flex items-center justify-center gap-1 text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-base-content/60 font-semibold ml-1">5.0</span>
                </div>
              </div>

              <div className="pt-4 border-t border-base-200">
                <Link
                  to={`/tutors/${tutor._id}`}
                  className="btn btn-primary btn-outline btn-block btn-sm rounded-xl font-bold text-xs gap-1"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
