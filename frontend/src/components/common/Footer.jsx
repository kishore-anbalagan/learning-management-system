import React, { useState, useEffect } from "react";
import { FooterLink2 } from "../../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import StudyNotionLogo from "../../assets/Logo/Logo-Full-Light.png";

// footer data
const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  // State for newsletter
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Collapsible sections for mobile
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 z-50 bg-yellow-50 text-richblack-900 p-3 rounded-full shadow-lg hover:bg-yellow-100 transition-all duration-300 animate-bounce"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <div className="bg-gradient-to-b from-richblack-800 to-richblack-900 mx-7 rounded-3xl mb-10 shadow-2xl overflow-hidden transform hover:shadow-yellow-50/10 transition-all duration-300">
        {/* Newsletter section */}
        <div className="w-11/12 max-w-maxContent mx-auto pt-14 pb-5">
          <div className="bg-richblack-700/40 p-8 rounded-xl backdrop-blur-sm mb-10 shadow-lg border border-richblack-600 hover:border-yellow-50/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-yellow-50 mb-2">Join Our Newsletter</h3>
                <p className="text-richblack-200">Stay updated with the latest courses, tutorials, and educational content</p>
              </div>
              <div className="md:w-1/3 w-full">
                {!isSubscribed ? (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="px-4 py-2 bg-richblack-600 text-richblack-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-50 flex-grow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-200 transition-all duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                ) : (
                  <div className="text-green-500 bg-richblack-600 p-3 rounded-lg text-center animate-pulse">
                    Thanks for subscribing! 🎉
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex lg:flex-row gap-8 items-start justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-5">
          <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
            {/* Section 1 */}
            <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
              <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                <div className="mb-5 transform hover:scale-105 transition-transform duration-300">
                  <img src={StudyNotionLogo} alt="StudyNotion Logo" className="object-contain h-12" />
                </div>
                <h1 className="text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                  Company
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-20"></span>
                </h1>
                <div className="flex flex-col gap-3">
                  {["About", "Careers", "Affiliates"].map((ele, i) => {
                    return (
                      <div
                        key={i}
                        className="text-[14px] cursor-pointer hover:text-yellow-50 transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 h-0.5 bg-yellow-50 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                        <Link to="/">{ele}</Link>
                      </div>
                    );
                  })}
                </div>
                
                {/* social icons */}
                <div className="flex gap-4 mt-5">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-richblack-700 rounded-full hover:bg-richblack-600 transition-all duration-300 group">
                    <svg className="w-5 group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="facebook">
                      <path fill="#1976D2" d="M14 0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V2c0-1.103-.897-2-2-2z"></path>
                      <path fill="#FAFAFA" fillRule="evenodd" d="M13.5 8H11V6c0-.552.448-.5 1-.5h1V3h-2a3 3 0 0 0-3 3v2H6v2.5h2V16h3v-5.5h1.5l1-2.5z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-richblack-700 rounded-full hover:bg-richblack-600 transition-all duration-300 group">
                    <svg className="w-5 group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.24 102.59" id="twitter">
                      <path fill="#1da1f2" d="M40.58,115.3c47.64,0,73.69-39.47,73.69-73.69,0-1.12,0-2.24-.07-3.35a52.7,52.7,0,0,0,12.92-13.41,51.7,51.7,0,0,1-14.87,4.08A26,26,0,0,0,123.63,14.6a51.9,51.9,0,0,1-16.45,6.29A25.92,25.92,0,0,0,63.05,44.51,73.53,73.53,0,0,1,9.67,17.45a25.92,25.92,0,0,0,8,34.58A25.71,25.71,0,0,1,6,48.78c0,.11,0,.22,0,.33A25.91,25.91,0,0,0,26.73,74.5a25.86,25.86,0,0,1-11.7.44,25.93,25.93,0,0,0,24.2,18A52,52,0,0,1,7.06,104a52.72,52.72,0,0,1-6.18-.36,73.32,73.32,0,0,0,39.7,11.63" transform="translate(-.88 -12.7)"></path>
                    </svg>
                  </a>
                  
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-richblack-700 rounded-full hover:bg-richblack-600 transition-all duration-300 group">
                    <svg className="w-5 group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="youtube">
                      <g fillRule="evenodd" clipRule="evenodd">
                        <path fill="#F44336" d="M15.32 4.06c-.434-.772-.905-.914-1.864-.968C12.498 3.027 10.089 3 8.002 3c-2.091 0-4.501.027-5.458.091-.957.055-1.429.196-1.867.969C.23 4.831 0 6.159 0 8.497v.008c0 2.328.23 3.666.677 4.429.438.772.909.912 1.866.977.958.056 3.368.089 5.459.089 2.087 0 4.496-.033 5.455-.088.959-.065 1.43-.205 1.864-.977.451-.763.679-2.101.679-4.429v-.008c0-2.339-.228-3.667-.68-4.438z"></path>
                        <path fill="#FAFAFA" d="M6 11.5v-6l5 3z"></path>
                      </g>
                    </svg>
                  </a>
                  
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-richblack-700 rounded-full hover:bg-richblack-600 transition-all duration-300 group">
                    <svg className="w-5 group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <linearGradient id="insta-gradient" x1="0%" y1="70%" x2="100%" y2="30%">
                        <stop offset="0%" stopColor="#ffdc80" />
                        <stop offset="50%" stopColor="#fcaf45" />
                        <stop offset="60%" stopColor="#f77737" />
                        <stop offset="70%" stopColor="#f56040" />
                        <stop offset="80%" stopColor="#fd1d1d" />
                        <stop offset="90%" stopColor="#e1306c" />
                        <stop offset="100%" stopColor="#833ab4" />
                      </linearGradient>
                      <path fill="url(#insta-gradient)" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                <div className="lg:hidden flex justify-between items-center cursor-pointer" onClick={() => toggleSection('resources')}>
                  <h1 className="text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                    Resources
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-20"></span>
                  </h1>
                  <span className={`transition-transform duration-300 ${openSections.resources ? 'rotate-180' : ''}`}>▼</span>
                </div>
                <h1 className="hidden lg:block text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                  Resources
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-20"></span>
                </h1>

                <div className={`flex flex-col gap-3 mt-2 lg:block ${openSections.resources ? 'block' : 'hidden lg:block'}`}>
                  {Resources.map((ele, index) => {
                    return (
                      <div
                        key={index}
                        className="text-[14px] cursor-pointer hover:text-yellow-50 transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 h-0.5 bg-yellow-50 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                        <Link to="/">
                          {ele}
                        </Link>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:hidden flex justify-between items-center cursor-pointer mt-5" onClick={() => toggleSection('support')}>
                  <h1 className="text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                    Support
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-16"></span>
                  </h1>
                  <span className={`transition-transform duration-300 ${openSections.support ? 'rotate-180' : ''}`}>▼</span>
                </div>
                <h1 className="hidden lg:block text-richblack-50 font-semibold text-[16px] mt-7 mb-3 relative group">
                  Support
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-16"></span>
                </h1>
                <div className={`text-[14px] cursor-pointer hover:text-yellow-50 transition-all duration-200 mt-2 lg:block ${openSections.support ? 'block' : 'hidden lg:block'} flex items-center group`}>
                  <span className="w-0 h-0.5 bg-yellow-50 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                  <Link to={"/"}>Help Center</Link>
                </div>
              </div>

              <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                <div className="lg:hidden flex justify-between items-center cursor-pointer" onClick={() => toggleSection('plans')}>
                  <h1 className="text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                    Plans
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-12"></span>
                  </h1>
                  <span className={`transition-transform duration-300 ${openSections.plans ? 'rotate-180' : ''}`}>▼</span>
                </div>
                <h1 className="hidden lg:block text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                  Plans
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-12"></span>
                </h1>

                <div className={`flex flex-col gap-3 mt-2 lg:block ${openSections.plans ? 'block' : 'hidden lg:block'}`}>
                  {Plans.map((ele, index) => {
                    return (
                      <div
                        key={index}
                        className="text-[14px] cursor-pointer hover:text-yellow-50 transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 h-0.5 bg-yellow-50 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                        <Link to="/">
                          {ele}
                        </Link>
                      </div>
                    );
                  })}
                </div>
                
                <div className="lg:hidden flex justify-between items-center cursor-pointer mt-5" onClick={() => toggleSection('community')}>
                  <h1 className="text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                    Community
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-24"></span>
                  </h1>
                  <span className={`transition-transform duration-300 ${openSections.community ? 'rotate-180' : ''}`}>▼</span>
                </div>
                <h1 className="hidden lg:block text-richblack-50 font-semibold text-[16px] mt-7 mb-3 relative group">
                  Community
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-24"></span>
                </h1>

                <div className={`flex flex-col gap-3 mt-2 lg:block ${openSections.community ? 'block' : 'hidden lg:block'}`}>
                  {Community.map((ele, index) => {
                    return (
                      <div
                        key={index}
                        className="text-[14px] cursor-pointer hover:text-yellow-50 transition-all duration-200 flex items-center group"
                      >
                        <span className="w-0 h-0.5 bg-yellow-50 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                        <Link to="/">
                          {ele}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
              {FooterLink2.map((ele, i) => {
                return (
                  <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                    <div className="lg:hidden flex justify-between items-center cursor-pointer" onClick={() => toggleSection(ele.title)}>
                      <h1 className="text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                        {ele.title}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-20"></span>
                      </h1>
                      <span className={`transition-transform duration-300 ${openSections[ele.title] ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                    <h1 className="hidden lg:block text-richblack-50 font-semibold text-[16px] mb-3 relative group">
                      {ele.title}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-50 transition-all duration-300 group-hover:w-20"></span>
                    </h1>
                    <div className={`flex flex-col gap-3 mt-2 lg:block ${openSections[ele.title] ? 'block' : 'hidden lg:block'}`}>
                      {ele.links.map((link, index) => {
                        return (
                          <div
                            key={index}
                            className="text-[14px] cursor-pointer hover:text-yellow-50 transition-all duration-200 flex items-center group"
                          >
                            <span className="w-0 h-0.5 bg-yellow-50 mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                            <Link to="/">{link.title}</Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* bottom footer */}
        <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-8 text-sm border-t border-richblack-700 pt-8">
          {/* Section 1 */}
          <div className="flex justify-between lg:items-center items-center flex-col lg:flex-row gap-5 w-full">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {BottomFooter.map((ele, ind) => {
                return (
                  <div
                    key={ind}
                    className={`px-3 cursor-pointer hover:text-yellow-50 transition-all duration-200 ${
                      ind < BottomFooter.length - 1 ? "border-r border-richblack-700" : ""
                    }`}
                  >
                    <Link to="/">
                      {ele}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="text-center flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse text-lg">❤️</span>
              </div>
              <span className="hidden sm:inline">|</span>
              <span>© 2025 Studynotion</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;