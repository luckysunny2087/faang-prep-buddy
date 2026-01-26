import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { companyCategoryLabels, CompanyCategory, CompanyInfo } from '@/data/technologies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Target, GraduationCap, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCompanies } from '@/hooks/useCompanies';

type FilterCategory = 'all' | CompanyCategory;

const difficultyMap: Record<string, 'Hard' | 'Expert'> = {
  // Big Tech - all Hard/Expert
  amazon: 'Hard', google: 'Expert', meta: 'Hard', apple: 'Hard', netflix: 'Expert', microsoft: 'Hard',
  salesforce: 'Hard', oracle: 'Hard', adobe: 'Hard', intel: 'Expert', cisco: 'Hard', ibm: 'Hard',
  // Consulting - MBB are Expert
  mckinsey: 'Expert', bcg: 'Expert', bain: 'Expert', deloitte: 'Hard', accenture: 'Hard',
  pwc: 'Hard', ey: 'Hard', kpmg: 'Hard', capgemini: 'Hard', cognizant: 'Hard',
  // Finance - top banks are Expert
  'goldman-sachs': 'Expert', jpmorgan: 'Expert', 'morgan-stanley': 'Expert', citi: 'Hard',
  bofa: 'Hard', 'wells-fargo': 'Hard', hsbc: 'Hard', barclays: 'Hard', visa: 'Expert', mastercard: 'Expert',
  // Indian IT - all Hard now
  tcs: 'Hard', infosys: 'Hard', wipro: 'Hard', hcl: 'Hard', 'tech-mahindra': 'Hard', ltimindtree: 'Hard',
  // Enterprise - all Hard/Expert
  sap: 'Hard', servicenow: 'Hard', workday: 'Hard', vmware: 'Hard', splunk: 'Hard',
  snowflake: 'Expert', databricks: 'Expert', palantir: 'Expert',
  // Retail - all Hard/Expert
  walmart: 'Hard', target: 'Hard', shopify: 'Expert', ebay: 'Hard', uber: 'Expert',
  airbnb: 'Expert', doordash: 'Expert', instacart: 'Hard',
  // Automotive - all Hard/Expert
  tesla: 'Expert', toyota: 'Hard', ford: 'Hard', gm: 'Hard', bosch: 'Hard', siemens: 'Hard',
  // Healthcare - all Hard/Expert
  'johnson-johnson': 'Expert', pfizer: 'Expert', unitedhealth: 'Hard', 'cvs-health': 'Hard',
  anthem: 'Hard', abbvie: 'Expert', merck: 'Expert', novartis: 'Expert', roche: 'Expert',
  medtronic: 'Hard', abbott: 'Hard', cigna: 'Hard',
};

const getDifficulty = (companyId: string): 'Hard' | 'Expert' => {
  return difficultyMap[companyId] || 'Hard';
};

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case 'Expert':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: // Hard
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  }
};

const getCompanyColor = (category: CompanyCategory) => {
  const colors: Record<CompanyCategory, string> = {
    'big-tech': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'consulting': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'finance': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    'indian-it': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    'enterprise': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    'retail': 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    'automotive': 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    'healthcare': 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };
  return colors[category] || 'bg-muted text-muted-foreground';
};

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const { allCompanies, isLoading } = useCompanies();

  const filteredCompanies = useMemo(() => {
    let result = allCompanies;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((company) => company.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(lowerQuery) ||
          company.description.toLowerCase().includes(lowerQuery) ||
          (company.interviewFocus && company.interviewFocus.toLowerCase().includes(lowerQuery))
      );
    }

    return result;
  }, [searchQuery, selectedCategory, allCompanies]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allCompanies.length };
    allCompanies.forEach((company) => {
      counts[company.category] = (counts[company.category] || 0) + 1;
    });
    return counts;
  }, [allCompanies]);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Page Hero */}
        <section className="relative py-16 md:py-20 overflow-hidden border-b border-border/50 bg-muted/30">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  {allCompanies.length}+ Companies
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 md:mb-6">
                Explore <span className="gradient-text">Top Companies</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                Master the interview process for the world's leading technology companies. Get insights into their
                culture, interview stages, and what they look for in candidates.
              </p>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="pl-10 h-12 bg-background border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          {/* Background Decorative Blur */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/4" />
        </section>

        {/* Category Tabs */}
        <section className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="container py-4">
            <Tabs
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val as FilterCategory)}
              className="w-full"
            >
              <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0 justify-start">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2"
                >
                  All ({categoryCounts.all})
                </TabsTrigger>
                {(Object.keys(companyCategoryLabels) as CompanyCategory[]).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2"
                  >
                    {companyCategoryLabels[category]} ({categoryCounts[category] || 0})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-10 md:py-16 container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading companies...</span>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredCompanies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-4 text-muted-foreground italic">No companies found matching "{searchQuery}"</div>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 md:mb-6">
              Don't see your target company?
            </h2>
            <p className="text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              No worries! You can enter any company name in the practice setup. Our AI will tailor questions based on
              the company's industry and known interview patterns.
            </p>
            <Button size="lg" onClick={() => navigate('/practice')}>
              Start Custom Practice
              <GraduationCap className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

interface CompanyCardProps {
  company: CompanyInfo;
  index: number;
  navigate: (path: string) => void;
}

const CompanyCard = ({ company, index, navigate }: CompanyCardProps) => {
  const difficulty = getDifficulty(company.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="h-full flex flex-col hover-lift border-border/50 group overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110 ${getCompanyColor(company.category)}`}
            >
              {company.name.charAt(0)}
            </div>
            <Badge variant="outline" className={`text-[10px] ${getDifficultyStyles(difficulty)}`}>
              {difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
            {company.name}
          </CardTitle>
          <CardDescription className="text-xs line-clamp-1">{company.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          {company.interviewFocus && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <Target className="h-3 w-3" />
                Interview Focus
              </div>
              <p className="text-xs text-foreground/80 line-clamp-2">{company.interviewFocus}</p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            onClick={() => navigate(`/practice?company=${company.id}`)}
          >
            Start Prep
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Companies;
