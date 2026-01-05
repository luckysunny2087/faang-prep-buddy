import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CompaniesSection } from '@/components/landing/CompaniesSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CompaniesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
