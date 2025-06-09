'use client'
import { motion } from "framer-motion";
import { useAppDispatch } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { filteredTask } from "@/redux/actions/taskAction";
import type { searchTerm } from "@/types";  

const SearchBar = () => {
    const [filters, setFilters] = useState<searchTerm>({
        searchType:'',
        status: '',
        priority: '',
        dueDate: ''
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(filteredTask(filters));
        }, 300);  

        return () => clearTimeout(timer);
    }, [filters, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFilters(prev => ({ ...prev, [name]: value }));

    };


    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-6 space-y-6"
        >
            {/* Search Section */}
            <div className="space-y-2">
                <motion.h2 
                    className="text-xl font-semibold text-gray-800"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                >
                    Search Tasks
                </motion.h2>
                
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            name="searchType"
                            value={filters.searchType}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="space-y-2">
                <motion.h2 
                    className="text-xl font-semibold text-gray-800"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Filter Tasks
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            name="status" 
                            value={filters.status}
                            onChange={handleChange}
                            className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="not-started">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select 
                            name="priority" 
                            value={filters.priority}
                            onChange={handleChange}
                            className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Due Date Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input 
                            type="date" 
                            name="dueDate"
                            value={filters.dueDate}
                            onChange={handleChange}
                            className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

           
        </motion.div>
    );
};

export default SearchBar;