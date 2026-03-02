import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';

export const About = () => {
    return (
        <PageTransition className="min-h-screen bg-elegant-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-soft p-8 md:p-12 border border-gray-100"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-elegant-navy mb-8">
                        About WakeGuard
                    </h1>

                    <div className="space-y-8 text-gray-600 font-sans leading-relaxed text-lg">
                        <p>
                            <span className="font-bold text-elegant-navy">WakeGuard</span> is a next-generation safety system designed to prevent drowsiness-related accidents. By leveraging advanced computer vision and on-device machine learning, we provide real-time vigilance monitoring without compromising your privacy.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                            <div className="bg-elegant-gray p-6 rounded-2xl">
                                <h3 className="font-serif font-bold text-elegant-navy text-xl mb-2">Privacy First</h3>
                                <p className="text-sm">No video data is ever sent to the cloud. All processing happens locally in your browser using WebAssembly.</p>
                            </div>
                            <div className="bg-elegant-gray p-6 rounded-2xl">
                                <h3 className="font-serif font-bold text-elegant-navy text-xl mb-2">Precision AI</h3>
                                <p className="text-sm">Powered by MediaPipe's Face Mesh technology, tracking 468 facial landmarks for accurate fatigue detection.</p>
                            </div>
                        </div>

                        <p>
                            This project was built to demonstrate the potential of client-side AI in enhancing everyday safety. It is open-source and available for educational purposes.
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-elegant-navy hover:text-white transition-all duration-300">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-elegant-navy hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-elegant-navy hover:text-white transition-all duration-300">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <span>v2.1.0 (Stable)</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                MIT License <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="font-serif italic text-gray-400">
                        "Eternal vigilance is the price of safety."
                    </p>
                </div>
            </div>
        </PageTransition>
    );
};
