'use client';

import React from 'react';
import { BarChart3, DollarSign, Users, ShoppingCart, TrendingUp, Clock, Package, Phone } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Website Analytics Card */}
                <div className="bg-indigo-500 text-white rounded-xl p-6 col-span-1 relative overflow-hidden shadow-md">
                    <div className="flex flex-col h-full">
                        <div className="absolute top-4 right-4 flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                            <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                            <div className="w-2 h-2 bg-white rounded-full opacity-90"></div>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-1">Website Analytics</h2>
                        <p className="text-indigo-100 text-sm mb-6">Total 28.5% Conversion Rate</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-2xl font-bold">28%</div>
                                <div className="text-indigo-100 text-sm">Sessions</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">3.1k</div>
                                <div className="text-indigo-100 text-sm">Page Views</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-bold">1.2k</div>
                                <div className="text-indigo-100 text-sm">Leads</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">12%</div>
                                <div className="text-indigo-100 text-sm">Conversions</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative graphic */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-30">
                        <div className="w-full h-full rounded-full bg-indigo-400 transform rotate-45"></div>
                    </div>
                </div>

                {/* Average Daily Sales Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Average Daily Sales</h2>
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Sales This Month</h3>
                        <p className="text-2xl font-bold text-gray-800">$28,450</p>
                    </div>
                    
                    {/* Graph placeholder */}
                    <div className="h-24 w-full bg-gradient-to-r from-green-100 to-green-50 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-12">
                            <svg viewBox="0 0 200 50" className="w-full h-full">
                                <path 
                                    d="M0,40 C20,35 40,20 60,30 C80,40 100,10 120,20 C140,30 160,35 180,25 C200,15 220,20 240,30 L240,50 L0,50 Z" 
                                    fill="rgba(74, 222, 128, 0.3)" 
                                />
                                <path 
                                    d="M0,40 C20,35 40,20 60,30 C80,40 100,10 120,20 C140,30 160,35 180,25 C200,15 220,20 240,30" 
                                    fill="none" 
                                    stroke="#22c55e" 
                                    strokeWidth="2" 
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Sales Overview Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Sales Overview</h2>
                        <span className="text-green-500 font-medium text-sm">+18.2%</span>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-2xl font-bold text-gray-800">$42.5k</p>
                    </div>
                    
                    <div className="flex items-center mb-2">
                        <div className="flex-1">
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded bg-cyan-100 flex items-center justify-center mr-2">
                                    <ShoppingCart size={14} className="text-cyan-600" />
                                </div>
                                <span className="text-sm text-gray-600">Order</span>
                            </div>
                            <p className="text-lg font-semibold mt-1">62.2%</p>
                            <p className="text-xs text-gray-500">6,440</p>
                        </div>
                        
                        <div className="text-sm text-gray-400 px-4">VS</div>
                        
                        <div className="flex-1 text-right">
                            <div className="flex items-center justify-end">
                                <span className="text-sm text-gray-600">Visits</span>
                                <div className="ml-2 w-5 h-5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-lg font-semibold mt-1">25.5%</p>
                            <p className="text-xs text-gray-500">12,749</p>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                </div>
            </div>
            
            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earning Reports Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Earning Reports</h2>
                            <p className="text-sm text-gray-500">Weekly Earnings Overview</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <h3 className="text-3xl font-bold text-gray-800">$468</h3>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">+4.2%</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-6">You informed of this week compared to last week</p>
                    
                    {/* Chart placeholder */}
                    <div className="h-32 flex items-end space-x-2">
                        {[
                            { day: 'Mo', height: 45 },
                            { day: 'Tu', height: 60 },
                            { day: 'We', height: 30 },
                            { day: 'Th', height: 70 },
                            { day: 'Fr', height: 50 },
                            { day: 'Sa', height: 80 },
                            { day: 'Su', height: 40 }
                        ].map((item, i) => (
                            <div key={item.day} className="flex-1 flex flex-col items-center">
                                <div 
                                    className={`w-full rounded-t-md ${i === 5 ? 'bg-indigo-500' : 'bg-indigo-100'}`} 
                                    style={{ height: `${item.height}px` }}
                                ></div>
                                <span className="text-xs text-gray-500 mt-1">{item.day}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <DollarSign size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Earnings</p>
                                <p className="font-semibold">$545.69</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                                <TrendingUp size={16} className="text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Profit</p>
                                <p className="font-semibold">$256.34</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                <ShoppingCart size={16} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Expense</p>
                                <p className="font-semibold">$74.19</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Support Tracker Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Support Tracker</h2>
                            <p className="text-sm text-gray-500">Last 7 Days</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold mb-1">164</h3>
                        <p className="text-gray-600">Total Tickets</p>
                    </div>
                    
                    <div className="flex justify-center mb-6">
                        {/* Circular progress indicator */}
                        <div className="relative w-44 h-44">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle 
                                    cx="50" cy="50" r="40" 
                                    fill="none" 
                                    stroke="#f3f4f6" 
                                    strokeWidth="10"
                                />
                                <circle 
                                    cx="50" cy="50" r="40" 
                                    fill="none" 
                                    stroke="#818cf8" 
                                    strokeWidth="10"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="37.68"
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                                <text 
                                    x="50" y="50" 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    fill="#4f46e5"
                                    fontSize="24"
                                    fontWeight="bold"
                                >
                                    85%
                                </text>
                                <text 
                                    x="50" y="65" 
                                    textAnchor="middle" 
                                    dominantBaseline="middle"
                                    fill="#6b7280"
                                    fontSize="10"
                                >
                                    Completed Task
                                </text>
                            </svg>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                                <Phone size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium">New Tickets</p>
                                    <p className="text-sm text-gray-500">142</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                                <Package size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium">Open Tickets</p>
                                    <p className="text-sm text-gray-500">28</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center mr-3">
                                <Clock size={16} className="text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium">Response Time</p>
                                    <p className="text-sm text-gray-500">1 Day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 