import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuildCorpusPage = () => {
  const navigate = useNavigate();

  const earningOpportunities = [
    {
      title: "Teaching Assistant (TA) Positions",
      description: "Help professors with grading, tutoring, or lab sessions.",
      earnings: "₹5,000 - ₹15,000 per month",
      links: [
        { text: "Your College Department Website", url: "https://www.bits-pilani.ac.in/goa/" },
        { text: "Unacademy Teaching", url: "https://unacademy.com/teach" },
        { text: "BYJU'S Teaching", url: "https://byjus.com/teach-at-byjus/" }
      ]
    },
    {
      title: "Online Tutoring",
      description: "Answer academic questions and help students on platforms like Chegg.",
      earnings: "₹100 per question, ₹500-1000 per hour",
      links: [
        { text: "Chegg", url: "https://www.chegg.com/tutors/become-a-tutor/" },
        { text: "Vedantu", url: "https://www.vedantu.com/teach" },
        { text: "DoubtNut", url: "https://doubtnut.com/tutor" }
      ]
    },
    {
      title: "Content Writing & Blogging",
      description: "Write articles, blog posts, or technical content.",
      earnings: "₹500 - ₹2,000 per article",
      links: [
        { text: "Internshala Content Writing", url: "https://internshala.com/content-writing-jobs" },
        { text: "Freelancer.com", url: "https://www.freelancer.com/writing-jobs" },
        { text: "Upwork", url: "https://www.upwork.com/freelance-jobs/writing/" }
      ]
    },
    {
      title: "Social Media Management",
      description: "Manage social media accounts for small businesses.",
      earnings: "₹5,000 - ₹20,000 per month",
      links: [
        { text: "Internshala Social Media", url: "https://internshala.com/social-media-marketing-jobs" },
        { text: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/social-media-intern-jobs" }
      ]
    },
    {
      title: "Online Surveys & Reviews",
      description: "Participate in market research surveys and write product reviews.",
      earnings: "₹50 - ₹500 per survey",
      links: [
        { text: "Swagbucks", url: "https://www.swagbucks.com" },
        { text: "Google Opinion Rewards", url: "https://surveys.google.com/google-opinion-rewards/" }
      ]
    },
    {
      title: "Freelance Writing",
      description: "Write articles, blog posts, or technical documentation.",
      earnings: "₹1,000 - ₹5,000 per article",
      links: [
        { text: "Contena", url: "https://www.contena.co" },
        { text: "ProBlogger Jobs", url: "https://problogger.com/jobs/" },
        { text: "Fiverr Writing", url: "https://www.fiverr.com/categories/writing-translation" }
      ]
    },
    {
      title: "Virtual Research Assistant",
      description: "Help with online research, data collection, and analysis.",
      earnings: "₹200 - ₹500 per hour",
      links: [
        { text: "Upwork Research Jobs", url: "https://www.upwork.com/freelance-jobs/research/" },
        { text: "Indeed Remote Research", url: "https://in.indeed.com/Remote-Research-Assistant-jobs" }
      ]
    },
    {
      title: "Report Writing",
      description: "Write business reports, academic papers, or research summaries.",
      earnings: "₹2,000 - ₹10,000 per report",
      links: [
        { text: "Freelancer Report Writing", url: "https://www.freelancer.com/jobs/report-writing/" },
        { text: "Academia-Research", url: "https://academia-research.com" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/learn')}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Learn</span>
            </button>
            <h1 className="text-4xl font-bold">Build Your Corpus</h1>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] mb-8">
          <h2 className="text-2xl font-bold mb-4">Earn While You Learn! 💰</h2>
          <p className="text-gray-600">
            Here are some great opportunities for college students to earn money from the comfort of their room. 
            These options are flexible and can work around your study schedule.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {earningOpportunities.map((opportunity, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
              <p className="text-gray-600 mb-3">{opportunity.description}</p>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block mb-4">
                {opportunity.earnings}
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Useful Links:</h4>
                {opportunity.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
          <h2 className="text-2xl font-bold mb-4">Pro Tips 🌟</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Start with one opportunity and gradually expand as you get comfortable managing your time.</li>
            <li>• Create a professional profile on LinkedIn and other platforms to attract better opportunities.</li>
            <li>• Always read reviews and research platforms before committing your time.</li>
            <li>• Keep track of your earnings and set aside some for investments.</li>
            <li>• Don't compromise your studies - choose flexible options that work with your schedule.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuildCorpusPage; 