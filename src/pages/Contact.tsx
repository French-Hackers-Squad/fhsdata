import React from 'react';
import RetroLayout from "@/components/RetroLayout";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import SecurityInfo from "@/components/contact/SecurityInfo";
import CollaborationInfo from "@/components/contact/CollaborationInfo";
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <RetroLayout>
      <div className="w-full">
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
              <div className="france-card p-4 sm:p-6 md:p-8">
                <ContactHeader />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <ContactInfo />
                    <SecurityInfo />
                    <CollaborationInfo />
                  </div>
                  <ContactForm />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 sm:mt-8">
                  <div className="hidden sm:block h-px w-10 bg-france-blue/30"></div>
                  <p className="text-france-white/70 text-xs sm:text-sm text-center">SÉCURITÉ • DISCRÉTION • EXCELLENCE</p>
                  <div className="hidden sm:block h-px w-10 bg-france-blue/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RetroLayout>
  );
};

export default Contact;
