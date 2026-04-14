'use client';
import React from 'react';
import Link from 'next/link';
import { FileText, Users, BookOpen, Building, Scale, Globe, BarChart2, MessageSquare } from 'lucide-react';

const programs = [
    { icon: FileText, label: "Renstra DPRD", href: "/renstra", color: "#1a6bb5" },
    { icon: BarChart2, label: "Prolegda", href: "/prolegda", color: "#0a2744" },
    { icon: Users, label: "Delegasi Masyarakat", href: "/delegasi", color: "#c0392b" },
    { icon: BookOpen, label: "PPID", href: "/ppid", color: "#16a085" },
    { icon: Building, label: "eReses", href: "/ereses", color: "#27ae60" },
    { icon: Scale, label: "JDIH", href: "/jdih", color: "#8e44ad" },
    { icon: Globe, label: "Portal KSB", href: "/portal", color: "#2980b9" },
    { icon: MessageSquare, label: "Forum Warga", href: "/forum", color: "#e67e22" },
];

const ProgramsSection: React.FC = () => {
    return (
        <section className="py-5 bg-white border-t border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-0 divide-x divide-gray-100">
                    {programs.map((prog) => {
                        const Icon = prog.icon;
                        return (
                            <Link
                                key={prog.label}
                                href={prog.href}
                                className="flex flex-col items-center text-center py-4 px-2 group hover:bg-gray-50 transition-colors"
                            >
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-md"
                                    style={{ backgroundColor: prog.color }}
                                >
                                    <Icon size={20} className="text-white" />
                                </div>
                                <span className="text-gray-700 group-hover:text-[#0a2744] font-semibold text-xs text-center leading-tight">
                                    {prog.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProgramsSection;
