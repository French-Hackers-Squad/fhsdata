import React from 'react';
import RetroLayout from "@/components/RetroLayout";
import AboutHeader from "@/components/about/AboutHeader";
import MissionSection from "@/components/about/MissionSection";
import TeamSection from "@/components/about/TeamSection";
import ApproachSection from "@/components/about/ApproachSection";
import GlobalImpactSection from "@/components/about/GlobalImpactSection";

const About = () => {
  return (
    <RetroLayout>
      <div className="w-full">
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="space-y-6 md:space-y-8">
              <AboutHeader />
              <MissionSection />
              <TeamSection />
              <ApproachSection />
              <GlobalImpactSection />
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default About;
