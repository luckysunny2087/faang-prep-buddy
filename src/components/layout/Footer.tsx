import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg">
                IP
              </div>
              <span className="font-display font-semibold text-lg">
                InterviewPrep
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered interview preparation for FAANG and top tech companies. Practice smarter, land your dream job.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Practice</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/practice" className="hover:text-foreground transition-colors">Start Practice</Link></li>
              <li><Link to="/companies" className="hover:text-foreground transition-colors">Companies</Link></li>
              <li><Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InterviewPrep. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
