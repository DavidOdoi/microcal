type PlannedArticle = { title: string; keywords: string[] };

export const plannedCategoryArticles: Partial<Record<string, PlannedArticle[]>> = {
  savings: [
    { title: 'Best online bank accounts', keywords: ['best online bank account'] },
    { title: 'Best money market account rates', keywords: ['best interest money market accounts'] },
    { title: 'Best checking account bonuses', keywords: ['best bonus for opening checking account'] },
    { title: 'Best CD rates in Alabama', keywords: ['best cd rates in alabama'] },
    { title: 'Best CD rates in Pennsylvania', keywords: ['best cd rates in pa'] },
    { title: 'Best credit unions in California', keywords: ['best credit unions in california'] },
    { title: 'Credit unions with the best savings rates', keywords: ['credit unions with the best savings rates'] },
  ],
  debt: [
    { title: 'Best credit cards for building credit', keywords: ['best credit card to build credit'] },
    { title: 'Best rewards credit cards', keywords: ['credit cards with best rewards', 'best reward credit card'] },
    { title: 'Best credit monitoring services', keywords: ['best credit monitoring service'] },
    { title: 'Best travel credit cards with no annual fee', keywords: ['best travel credit cards with no annual fee'] },
    { title: 'Current balance vs. statement balance', keywords: ['current balance vs statement balance'] },
  ],
  'auto-loans': [
    { title: 'Best auto loans', keywords: ['best auto loans'] },
  ],
  investments: [
    { title: 'Best robo-advisors', keywords: ['best robo advisor'] },
  ],
  business: [
    { title: 'Best banks for business accounts', keywords: ['best business account bank'] },
  ],
  loans: [
    { title: 'Best personal loan lenders', keywords: ['best lenders for personal loans'] },
  ],
  mortgages: [
    { title: 'Best VA loan rates', keywords: ['best va loan rates'] },
    { title: 'Best online mortgage lenders', keywords: ['best online mortgage lenders'] },
  ],
  'student-loans': [
    { title: 'Best student loan servicers', keywords: ['best student loan servicer'] },
  ],
  taxes: [
    { title: 'Best professional tax preparation software', keywords: ['best professional tax preparation software'] },
  ],
  retirement: [
    { title: 'Traditional IRA vs. Roth IRA', keywords: ['traditional ira vs roth ira', 'ira account vs roth', 'trad ira vs roth'] },
    { title: 'IRA vs. 401(k)', keywords: ['ira vs 401k'] },
  ],
  budgeting: [
    { title: 'Venmo vs. Zelle', keywords: ['venmo vs zelle'] },
  ],
};
