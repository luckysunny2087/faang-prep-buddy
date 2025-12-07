import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { companies } from '@/data/technologies';

const companyLogos: Record<string, string> = {
  amazon: 'A',
  google: 'G',
  meta: 'M',
  apple: '',
  netflix: 'N',
  microsoft: 'M',
};

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
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Prepare for Top Companies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Company-specific interview tracks with tailored questions and strategies
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="hover-lift cursor-pointer group"
                onClick={() => navigate(`/practice?company=${company.id}`)}
              >
                <CardContent className="p-6 text-center">
                  <div 
                    className={`h-16 w-16 mx-auto rounded-xl flex items-center justify-center mb-3 text-2xl font-bold transition-transform group-hover:scale-110 ${
                      company.id === 'amazon' ? 'bg-orange-500/10 text-orange-500' :
                      company.id === 'google' ? 'bg-blue-500/10 text-blue-500' :
                      company.id === 'meta' ? 'bg-blue-600/10 text-blue-600' :
                      company.id === 'apple' ? 'bg-gray-500/10 text-gray-700 dark:text-gray-300' :
                      company.id === 'netflix' ? 'bg-red-600/10 text-red-600' :
                      'bg-sky-500/10 text-sky-500'
                    }`}
                  >
                    {companyLogos[company.id]}
                  </div>
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{company.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="outline" onClick={() => navigate('/companies')}>
            View All Companies
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
