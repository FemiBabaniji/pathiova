"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import SignInButton from "@/components/SignInButton";

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const minScore = parseInt(searchParams.get('minScore') || '0', 10);
  const maxScore = parseInt(searchParams.get('maxScore') || '0', 10);

  let visaType = '';
  let visaRecommendation = '';

  // Determine visa type based on score
  if (maxScore >= 600) {
    visaType = 'Provincial Nominee Program (PNP)';
    visaRecommendation = 'You may qualify for a Provincial Nominee Program (PNP), which can significantly boost your chances of obtaining permanent residency.';
  } else if (maxScore >= 450 && maxScore < 600) {
    visaType = 'Federal Skilled Worker Program or Canadian Experience Class';
    visaRecommendation = 'You have a competitive CRS score. Consider applying through the Federal Skilled Worker Program or the Canadian Experience Class.';
  } else if (maxScore >= 300 && maxScore < 450) {
    visaType = 'Improvement Needed';
    visaRecommendation = 'Your score suggests you may need to improve your profile. Consider improving your language proficiency, gaining more work experience, or pursuing further education.';
  } else {
    visaType = 'Explore Other Options';
    visaRecommendation = 'Your score is currently low. You may want to explore other immigration options or work on significantly improving your profile.';
  }

  // Redirect logic after displaying the results
  useEffect(() => {
    // Example: Redirect to the specific dashboard path
    const timer = setTimeout(() => {
      redirect("/app/dashboard"); // Ensure this path matches the desired location
    }, 5000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Section - Full Width */}
      <div className="w-full bg-white py-32 text-center shadow-md mb-4"> 
        <h1 className="mb-4 text-4xl font-bold text-orange-600">{visaType}</h1>
        <p className="text-xl mb-6">{visaRecommendation}</p>
        {/* CTA Button with Custom Phrase */}
        <SignInButton
          text="Optimize Your Score and Simplify Your Application"
          className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700 transition duration-300"
        >
          <span className="ml-2">→</span>
        </SignInButton>
      </div>

      {/* Core Factors Section - Light Orange Background */}
      <div className="w-full max-w-2xl mx-auto px-8 py-10 bg-orange-50 shadow-md rounded-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">Core Factors</h2>
        <p className="mb-6">These are the primary factors that influence your CRS score. Understanding and optimizing these can greatly enhance your chances of success.</p>

        <h3 className="text-xl font-semibold mb-2">Age</h3>
        <p className="mb-4">Age plays a significant role in your CRS score. Younger applicants tend to receive higher points, with the highest scores awarded to those between 20-29 years old.</p>

        <h3 className="text-xl font-semibold mb-2">Education</h3>
        <p className="mb-4">Higher educational qualifications can increase your score. For example, a doctorate earns the most points, while a secondary diploma earns fewer points.</p>

        <h3 className="text-xl font-semibold mb-2">Language Proficiency</h3>
        <p className="mb-4">Proficiency in English and/or French is crucial. Achieving high scores in language tests like IELTS or TEF can significantly boost your CRS score.</p>

        <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
        <p className="mb-4">Both Canadian and foreign work experience are valued. More years of relevant work experience will result in a higher score.</p>
      </div>

      {/* Additional Points Section - Light Orange Background */}
      <div className="w-full max-w-2xl mx-auto px-8 py-10 bg-orange-50 shadow-md rounded-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">Potential Additional Points</h2>
        <p className="mb-6">These are the extra points you could gain beyond the core factors. Maximizing these can elevate your CRS score significantly.</p>

        <h3 className="text-xl font-semibold mb-2">Spousal Factors</h3>
        <p className="mb-4">If you have a spouse or common-law partner, their education, language proficiency, and work experience can contribute additional points to your score.</p>

        <h3 className="text-xl font-semibold mb-2">Skill Transferability</h3>
        <p className="mb-4">This combines education, work experience, and language proficiency. High levels in these areas can generate extra points through skill transferability combinations.</p>

        <h3 className="text-xl font-semibold mb-2">Provincial Nomination</h3>
        <p className="mb-4">A nomination from a Canadian province or territory can add 600 points to your CRS score, almost guaranteeing an invitation to apply for permanent residency.</p>
      </div>

      {/* Bottom Section - Selling Points and CTA */}
      <div className="w-full max-w-2xl mx-auto px-8 py-6 bg-orange-50 shadow-md rounded-lg text-center">
        <p className="text-lg mb-6">We offer a comprehensive package to help you succeed, including:</p>
        <ul className="list-disc pl-6 mb-6 text-left">
          <li>Step-by-step eBook to guide you through the entire process</li>
          <li>Customized templates for each required form and letter</li>
          <li>Study guides and practice questions for all required language and skills tests</li>
        </ul>
        <SignInButton
          text="Get Started Now"
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700"
        >
          <span className="ml-2">→</span>
        </SignInButton>
      </div>
    </div>
  );
};

export default ResultsPage;
