import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SUBJECT_OPTIONS = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Computer Science',
  'Bangla',
  'Accounting',
  'Economics',
  'Higher Math',
];

const CLASS_OPTIONS = [
  'All Classes',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10 (SSC)',
  'Class 11 (HSC)',
  'Class 12 (HSC)',
  'O Level',
  'A Level',
  'University / College',
];

export const Tuitions = () => {
  // 1. Search, Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // 'budget_asc' | 'budget_desc' | 'newest' | 'oldest'

  // 2. Pagination State
  const [page, setPage] = useState(1);
  const limit = 6;

  // Derive sort parameters for backend
  const getSortParams = (opt) => {
    switch (opt) {
      case 'budget_asc':
        return { sort: 'budget_asc', sortBy: 'budget', sortOrder: 'asc' };
      case 'budget_desc':
        return { sort: 'budget_desc', sortBy: 'budget', sortOrder: 'desc' };
      case 'oldest':
        return { sort: 'oldest', sortBy: 'createdAt', sortOrder: 'asc' };
      case 'newest':
      default:
        return { sort: 'newest', sortBy: 'createdAt', sortOrder: 'desc' };
    }
  };

  const { sortBy, sortOrder, sort } = getSortParams(sortOption);

  // 3. TanStack Query with Synchronized Query Parameters
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'tuitionsListing',
      page,
      limit,
      searchTerm,
      selectedSubject,
      selectedClass,
      locationTerm,
      sortOption,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedSubject && selectedSubject !== 'All Subjects') params.append('subject', selectedSubject);
      if (selectedClass && selectedClass !== 'All Classes') params.append('class', selectedClass);
      if (locationTerm) params.append('location', locationTerm);

      const res = await axios.get(`${API_URL}/tuitions?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const tuitions = data?.data || [];
  const totalPages = Math.max(1, data?.totalPages || Math.ceil((data?.total || 0) / limit) || 1);
  const totalCount = data?.total || tuitions.length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedClass('');
    setLocationTerm('');
    setSortOption('newest');
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedSubject && selectedSubject !== 'All Subjects') ||
    Boolean(selectedClass && selectedClass !== 'All Classes') ||
    Boolean(locationTerm) ||
    sortOption !== 'newest';

  // Generate page button numbers array
  const generatePageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-200 pb-6">
        <div>
          <div className="badge badge-primary badge-outline text-[10px] font-bold uppercase mb-1">
            Tuition Exchange
          </div>
          <h1 className="text-3xl font-black text-base-content tracking-tight">Available Tuitions</h1>
          <p className="text-xs text-base-content/60 mt-1">
            Browse verified academic tuition requirements posted by students and parents.
          </p>
        </div>

        <div className="text-xs text-base-content/60 font-medium">
          Showing <span className="font-bold text-primary">{tuitions.length}</span> of{' '}
          <span className="font-bold text-base-content">{totalCount}</span> tuition posts
        </div>
      </div>

      {/* SEARCH, ADVANCED FILTER & SORT CONTROLS */}
      <div className="card bg-base-100 border border-base-200 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-base-content">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Search & Advanced Filters</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-xl gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Row 1: Search & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search (Subject / Keyword) */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search subject or keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="input input-bordered input-sm w-full pl-9 rounded-xl text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Filter location (e.g. Dhaka, Online)..."
              value={locationTerm}
              onChange={(e) => {
                setLocationTerm(e.target.value);
                setPage(1);
              }}
              className="input input-bordered input-sm w-full pl-9 rounded-xl text-xs"
            />
            {locationTerm && (
              <button
                onClick={() => setLocationTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setPage(1);
            }}
            className="select select-bordered select-sm w-full rounded-xl text-xs"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub === 'All Subjects' ? '' : sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setPage(1);
            }}
            className="select select-bordered select-sm w-full rounded-xl text-xs"
          >
            {CLASS_OPTIONS.map((cls) => (
              <option key={cls} value={cls === 'All Classes' ? '' : cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: Sort by Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-base-200 text-xs">
          <div className="flex items-center gap-2 text-base-content/60 font-medium">
            <span>Sort results by:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              className="select select-bordered select-sm rounded-xl text-xs font-semibold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget_asc">Budget: Low to High</option>
              <option value="budget_desc">Budget: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* TUITION LISTINGS / LOADING / EMPTY STATE */}
      {isLoading ? (
        <LoadingSpinner text="Fetching synchronized tuition listings..." />
      ) : tuitions.length === 0 ? (
        /* Empty State */
        <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mx-auto text-base-content/40">
            <Filter className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-base-content">No Tuitions Matched</h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto">
              We couldn't find any approved tuition postings matching your search, subject, class, or location filters.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      ) : (
        /* Tuitions Grid */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuitions.map((t) => (
              <div
                key={t._id}
                className="card bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="badge badge-primary badge-sm font-semibold text-[10px] mb-2">
                        Class: {t.class}
                      </span>
                      <h3 className="font-extrabold text-lg text-base-content leading-snug">
                        {t.subject}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-base-content/50 block">Budget</span>
                      <span className="font-black text-primary text-lg">${t.budget}/mo</span>
                    </div>
                  </div>

                  <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                    {t.description || 'Student seeking an experienced tutor for comprehensive subject mentorship.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-base-200 text-xs text-base-content/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{t.schedule || '3 Days/Week'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-base-200 flex items-center justify-between">
                  <span className="text-[11px] text-base-content/50">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/tuitions/${t._id}`}
                    className="btn btn-primary btn-sm rounded-xl gap-1.5 font-bold text-xs shadow-sm"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-200">
              <div className="text-xs text-base-content/60">
                Page <strong className="text-base-content">{page}</strong> of{' '}
                <strong className="text-base-content">{totalPages}</strong> ({totalCount} total tuitions)
              </div>

              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="btn btn-outline btn-sm rounded-xl text-xs gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {generatePageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      disabled={isFetching}
                      className={`btn btn-sm btn-square rounded-xl text-xs font-bold transition-all ${
                        page === num
                          ? 'btn-primary text-primary-content shadow-sm'
                          : 'btn-ghost text-base-content/70 hover:bg-base-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  className="btn btn-outline btn-sm rounded-xl text-xs gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
