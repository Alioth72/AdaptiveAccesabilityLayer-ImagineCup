import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-300/40 text-black mt-100">
            <div className="max-w-7xl px-16 py-16 mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-14">

                    {/* Identity */}
                    <div>
                        <h3 className="text-lg font-semibold tracking-wide text-[#247BA0] mb-4">
                            Technocast
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-800 max-w-sm">
                            Technocast is a technology intelligence and foresight initiative
                            enabling structured analysis of emerging technologies for policy,
                            industry, and strategic decision-making.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-base font-semibold tracking-wide text-[#247BA0] mb-4">
                            Contact
                        </h4>

                        <div className="space-y-3 text-sm text-gray-800">
                            <p>
                                <span className="text-gray-800 font-medium">Phone:</span>{" "}
                                +91 98765 43210
                            </p>
                            <p>
                                <span className="text-gray-800 font-medium">Email:</span>{" "}
                                contact@technocast.ai
                            </p>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h4 className="text-base font-semibold tracking-wide text-[#247BA0] mb-4">
                            Address
                        </h4>

                        <div className="rounded-xl border border-white/15 bg-white/5 p-5">
                            <p className="text-sm leading-relaxed text-gray-800 mb-4">
                                Delhi Technological University (DTU)<br />
                                Shahbad Daulatpur,<br />
                                Main Bawana Road,<br />
                                Delhi – 110042, India
                            </p>

                            <a
                                href="https://www.google.com/maps?q=Delhi+Technological+University"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#247BA0]/70 hover:text-white transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8c0 7-7.5 13-7.5 13S4.5 15 4.5 8a7.5 7.5 0 1115 0z"
                                    />
                                </svg>
                                View on Google Maps
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="mt-14 border-t border-white/15 pt-6 text-center text-xs text-neutral-400 tracking-wide">
                    © {new Date().getFullYear()} Technocast · All rights reserved
                </div>

            </div>
        </footer>
    );
};

export default Footer;
