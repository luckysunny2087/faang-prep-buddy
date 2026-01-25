import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { featuredCompanies, companyCategoryLabels, CompanyCategory } from '@/data/technologies';

// Show a curated selection of companies across categories
const featuredCompanyIds = [
  'amazon', 'google', 'meta', 'microsoft', 'apple', 'netflix',
  'jpmorgan', 'goldman-sachs', 'deloitte', 'accenture', 'tcs', 'infosys'
];

const displayCompanies = featuredCompanies.filter(c => featuredCompanyIds.includes(c.id));

export function CompaniesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="h-4 w-4" />
            70+ Companies & Growing
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Prepare for Any Company, Anywhere
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From FAANG to consulting, finance to Indian IT — tailored interview prep for your target company
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="hover-lift cursor-pointer group"
                onClick={() => navigate(`/practice?company=${company.id}`)}
              >
                <CardContent className="p-4 text-center">
                  <div 
                    className={`h-12 w-12 mx-auto rounded-xl flex items-center justify-center mb-2 text-lg font-bold transition-transform group-hover:scale-110 ${
                      company.id === 'amazon' ? 'bg-orange-500/10 text-orange-500' :
                      company.id === 'google' ? 'bg-blue-500/10 text-blue-500' :
                      company.id === 'meta' ? 'bg-blue-600/10 text-blue-600' :
                      company.id === 'apple' ? 'bg-gray-500/10 text-gray-700 dark:text-gray-300' :
                      company.id === 'netflix' ? 'bg-red-600/10 text-red-600' :
                      company.id === 'microsoft' ? 'bg-sky-500/10 text-sky-500' :
                      company.category === 'finance' ? 'bg-emerald-500/10 text-emerald-500' :
                      company.category === 'consulting' ? 'bg-purple-500/10 text-purple-500' :
                      company.category === 'indian-it' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-primary/10 text-primary'
                    }`}
                  >
                    {company.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-sm">{company.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {companyCategoryLabels[company.category]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 space-y-4"
        >
          <p className="text-muted-foreground">
            ...and <span className="font-semibold text-foreground">60+ more companies</span> across Big Tech, Consulting, Finance, and more
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => navigate('/practice')}>
              Start Practicing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/companies')}>
              View All Companies
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
