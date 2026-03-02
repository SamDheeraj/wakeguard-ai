import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Activity, Database, Share2 } from 'lucide-react';
import { generateResearchTitle, generateAbstract } from '../utils/contentGenerator';

export const InfiniteFeed = () => {
    const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);
    const loaderRef = useRef(null);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [items]);

    const loadMore = () => {
        // Simulate network delay for realism
        setTimeout(() => {
            const newItems = Array.from({ length: 5 }, (_, i) => items.length + i + 1);
            setItems(prev => [...prev, ...newItems]);
        }, 500);
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <div className="space-y-12">
                {items.map((id) => (
                    <FeedItem key={id} id={id} />
                ))}
            </div>

            {/* Loader / Trigger */}
            <div ref={loaderRef} className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-400 text-sm font-mono">FETCHING DATA STREAM...</p>
            </div>
        </div>
    );
};

const FeedItem = ({ id }: { id: number }) => {
    const isSystemLog = id % 3 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`p-8 rounded-3xl border ${isSystemLog ? 'bg-black border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSystemLog ? 'bg-gray-900 text-green-400' : 'bg-blue-50 text-blue-600'}`}>
                        {isSystemLog ? <Database className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className={`text-xl font-semibold ${isSystemLog ? 'text-white font-mono' : 'text-gray-900'}`}>
                            {isSystemLog ? `SYS_LOG_SEQ_${id * 8492}` : generateResearchTitle(id)}
                        </h3>
                        <p className={`text-sm ${isSystemLog ? 'text-gray-500' : 'text-gray-400'}`}>
                            {isSystemLog ? `TIMESTAMP: ${new Date().toISOString()}` : `Published: Vol. ${id}`}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className={`prose ${isSystemLog ? 'prose-invert' : ''} max-w-none`}>
                {isSystemLog ? (
                    <div className="font-mono text-sm text-green-400/80 bg-gray-900/50 p-4 rounded-xl overflow-x-auto">
                        {`> INITIATING SEQUENCE ${id}\n> ANALYZING NEURAL PATHWAYS...\n> LATENCY: ${Math.random() * 10}ms\n> STATUS: OPTIMAL`}
                    </div>
                ) : (
                    <p className="text-gray-600 leading-relaxed">
                        {generateAbstract(id)}
                    </p>
                )}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Activity className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 5000) + 1000} reads</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <span className="text-sm text-[#0071E3] font-medium cursor-pointer hover:underline">
                    Read full paper
                </span>
            </div>
        </motion.div>
    );
};
