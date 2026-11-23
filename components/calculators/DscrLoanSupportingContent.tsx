import Link from 'next/link';

export function DscrLoanSupportingContent() {
  return <>
    <h2>{"What Is a DSCR Loan Calculator?"}</h2>
    <p>{"A "}<strong>{"DSCR Loan Calculator"}</strong>{" helps real estate investors determine whether a property's income is sufficient to cover its loan payments."}</p>
    <p>{"DSCR stands for "}<strong>{"Debt Service Coverage Ratio"}</strong>{". It compares a property's net operating income with the amount required to repay its debt."}</p>
    <p>{"For example, a rental property generating $60,000 annually after operating expenses, with $48,000 in annual loan payments, has a DSCR of 1.25."}</p>
    <p>{"This means the property generates $1.25 in operating income for every $1 required to service its debt."}</p>
    <p>{"According to "}<a href="https://www.jpmorgan.com/insights/real-estate/commercial-term-lending/what-is-debt-service-coverage-ratio-dscr-in-real-estate">{"JPMorgan Chase"}</a>{", lenders use DSCR to assess the repayment capacity of income-producing properties."}</p>
    <p>{"Our calculator helps investors estimate their ratio before applying for financing."}</p>
    <h2>{"How to Use Our DSCR Loan Calculator"}</h2>
    <p>{"You need information about the property's income, expenses, and financing."}</p>
    <ol><li><strong>{"Annual rental income:"}</strong>{" Enter the property's expected yearly rental revenue."}</li><li><strong>{"Operating expenses:"}</strong>{" Include property taxes, insurance, maintenance, management fees, and other qualifying operating costs."}</li><li><strong>{"Loan amount:"}</strong>{" Enter the amount you want to borrow."}</li><li><strong>{"Interest rate:"}</strong>{" Add the proposed annual loan rate."}</li><li><strong>{"Loan term:"}</strong>{" Enter the repayment or amortization period."}</li></ol>
    <p>{"Depending on the calculator's features, you can either enter annual debt payments directly or calculate them using the loan details."}</p>
    <p>{"The results help you estimate your DSCR and understand whether the property generates sufficient income to cover its debt."}</p>
    <h2>{"DSCR Loan Calculator Formula"}</h2>
    <p>{"The standard debt service coverage ratio formula is:"}</p>
    <p className="finance-formula">{"DSCR = Net Operating Income ÷ Annual Debt Service"}</p>
    <p>{"Where:"}</p>
    <ul><li><strong>{"Net Operating Income (NOI):"}</strong>{" Annual property income after qualifying operating expenses, but before debt payments."}</li><li><strong>{"Annual Debt Service:"}</strong>{" Total principal and interest payments due during the year."}</li></ul>
    <p>{"First, calculate your net operating income:"}</p>
    <p className="finance-formula">{"NOI = Effective Rental Income − Operating Expenses"}</p>
    <p>{"Effective rental income should account for expected vacancies and collection losses."}</p>
    <p>{"Next, calculate your annual debt service:"}</p>
    <p className="finance-formula">{"Annual Debt Service = Monthly Loan Payment × 12"}</p>
    <p>{"This simplified formula assumes equal monthly payments. Include other qualifying debt obligations when applicable."}</p>
    <p>{"The "}<a href="https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf">{"Office of the Comptroller of the Currency (OCC)"}</a>{" uses NOI divided by annual debt service to measure commercial real estate repayment capacity."}</p>
    <h2>{"DSCR Calculation Example"}</h2>
    <p>{"Suppose you're considering purchasing a rental property."}</p>
    <p>{"Your estimated annual finances are:"}</p>
    <div className="finance-table-wrap"><table><thead><tr><th scope="col">{"Property details"}</th><th scope="col">{"Amount"}</th></tr></thead><tbody><tr><td>{"Gross annual rental income"}</td><td>{"$96,000"}</td></tr><tr><td>{"Vacancy and collection allowance"}</td><td>{"$4,800"}</td></tr><tr><td>{"Property operating expenses"}</td><td>{"$19,200"}</td></tr><tr><td><strong>{"Net operating income"}</strong></td><td><strong>{"$72,000"}</strong></td></tr><tr><td>{"Annual principal and interest payments"}</td><td>{"$60,000"}</td></tr></tbody></table></div>
    <p>{"Your DSCR would be:"}</p>
    <p className="finance-formula">{"DSCR = 72,000 ÷ 60,000 = 1.20"}</p>
    <p>{"Your property's DSCR is "}<strong>{"1.20"}</strong>{"."}</p>
    <p>{"This means the property generates approximately $1.20 in net operating income for every $1 of annual debt service."}</p>
    <p>{"After debt payments, the property has $12,000 remaining before income taxes, capital expenditures, and other excluded costs."}</p>
    <p>{"A 1.20 DSCR shows positive coverage, but it doesn't automatically mean a lender will approve the loan."}</p>
    <h2>{"What Is a Good DSCR for a Rental Property?"}</h2>
    <p>{"A higher DSCR generally indicates stronger debt repayment capacity."}</p>
    <p>{"The following table provides a useful interpretation:"}</p>
    <div className="finance-table-wrap"><table><thead><tr><th scope="col">{"DSCR"}</th><th scope="col">{"What it means"}</th></tr></thead><tbody><tr><td>{"Below 1.00"}</td><td>{"Property income doesn't cover debt payments"}</td></tr><tr><td>{"1.00"}</td><td>{"Income exactly covers debt payments"}</td></tr><tr><td>{"1.01–1.19"}</td><td>{"Limited repayment cushion"}</td></tr><tr><td>{"1.20–1.24"}</td><td>{"Positive coverage, but modest flexibility"}</td></tr><tr><td>{"1.25–1.49"}</td><td>{"Stronger debt coverage"}</td></tr><tr><td>{"1.50 or higher"}</td><td>{"Substantial income cushion relative to debt"}</td></tr></tbody></table></div>
    <p>{"These ranges are educational guidelines, not universal lender requirements."}</p>
    <p>{"Many lenders look for approximately 1.25 or higher, although minimum requirements depend on property type, market conditions, and loan structure."}</p>
    <p>{"The "}<a href="https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf">{"OCC's commercial real estate lending guidance"}</a>{" explains that properties with volatile income may require stronger coverage."}</p>
    <h2>{"How Much Can You Borrow Based on DSCR?"}</h2>
    <p>{"Lenders may use a minimum DSCR requirement to estimate the maximum annual debt payment a property can support."}</p>
    <p>{"The formula is:"}</p>
    <p className="finance-formula">{"Maximum Annual Debt Service = NOI ÷ Required DSCR"}</p>
    <p>{"Suppose your property's NOI is $72,000 and the lender requires a DSCR of 1.25."}</p>
    <p>{"Your maximum annual debt service would be:"}</p>
    <p><strong>{"$72,000 ÷ 1.25 = $57,600"}</strong></p>
    <p>{"That equals "}<strong>{"$4,800 per month"}</strong>{"."}</p>
    <p>{"The lender can then use the proposed interest rate and amortization period to estimate a supportable loan amount."}</p>
    <p>{"However, the actual loan may also be limited by loan-to-value requirements, credit considerations, and other underwriting conditions."}</p>
    <h2>{"What Expenses Count Toward Net Operating Income?"}</h2>
    <p>{"Accurate expenses are essential when calculating DSCR."}</p>
    <p>{"Common property operating costs include:"}</p>
    <ul><li>{"Property taxes and insurance."}</li><li>{"Repairs and routine maintenance."}</li><li>{"Property management fees."}</li><li>{"Utilities paid by the owner."}</li><li>{"Landscaping and cleaning."}</li><li>{"Other recurring operating expenses."}</li></ul>
    <p>{"NOI generally excludes mortgage principal and interest, depreciation, and income taxes."}</p>
    <p>{"Major capital improvements are usually treated separately, although lenders may make additional adjustments."}</p>
    <p><a href="https://www.jpmorgan.com/insights/real-estate/commercial-term-lending/what-is-debt-service-coverage-ratio-dscr-in-real-estate">{"JPMorgan Chase's DSCR guide"}</a>{" explains why accurate operating income matters when assessing rental properties."}</p>
    <h2>{"How to Improve Your DSCR"}</h2>
    <p>{"There are several practical ways to strengthen a property's repayment capacity."}</p>
    <p><strong>{"Increase rental income."}</strong>{" Review rents against comparable properties while accounting for local regulations and vacancy risks."}</p>
    <p><strong>{"Reduce unnecessary expenses."}</strong>{" Compare insurance, maintenance, and management costs without neglecting property upkeep."}</p>
    <p><strong>{"Increase your down payment."}</strong>{" Borrowing less can reduce "}<Link href="/business/business-loan-payment-calculator/">{"monthly debt payments"}</Link>{"."}</p>
    <p><strong>{"Compare financing offers."}</strong>{" A lower interest rate may improve debt coverage."}</p>
    <p><strong>{"Improve occupancy."}</strong>{" Reducing vacancies and missed rent payments can increase effective income."}</p>
    <p>{"Be careful about extending the "}<Link href="/calculators/mortgage-calculator/">{"loan term"}</Link>{" solely to improve DSCR. Lower payments can also result in greater lifetime interest costs."}</p>
    <h2>{"Common DSCR Calculation Mistakes"}</h2>
    <p>{"Avoid calculating DSCR using gross rental income without subtracting operating expenses."}</p>
    <p>{"Don't count depreciation as an ordinary cash operating expense when estimating property NOI."}</p>
    <p>{"Make sure income and debt payments cover the same period."}</p>
    <p>{"Also, avoid assuming future rental increases are guaranteed."}</p>
    <p>{"A property with a DSCR slightly above 1.00 may become unable to cover its debt if expenses rise or tenants leave."}</p>
    <h2>{"Frequently Asked Questions"}</h2>
    <h3>{"Is a 1.25 DSCR good?"}</h3>
    <p>{"A DSCR of 1.25 means the property generates $1.25 in net operating income for every $1 of annual debt payments. Many lenders view this as a useful coverage benchmark, but actual requirements vary."}</p>
    <h3>{"Can you get a DSCR loan with a ratio below 1.00?"}</h3>
    <p>{"Some specialized lenders may consider properties with lower ratios, depending on down payment, reserves, property type, and loan conditions. However, a DSCR below 1.00 means property income alone doesn't cover the measured debt payments."}</p>
    <h3>{"Does DSCR include property taxes and insurance?"}</h3>
    <p>{"Yes, property taxes and insurance generally reduce net operating income when calculating DSCR for commercial real estate. They should not be deducted twice if already included in the operating expenses."}</p>
    <h2>{"Final Thoughts"}</h2>
    <p>{"A DSCR calculation helps you determine whether a rental property generates enough operating income to support its financing."}</p>
    <p>{"However, a favorable ratio doesn't guarantee profitability or loan approval."}</p>
    <p>{"Use the "}<strong>{"DSCR Loan Calculator above"}</strong>{" to estimate your debt coverage, compare "}<Link href="/calculators/commercial-mortgage-calculator/">{"financing options"}</Link>{", and evaluate the effect of rental income and expenses."}</p>
    <p>{"A strong investment decision should consider cash flow, vacancies, financing costs, property condition, and long-term financial risks."}</p>
  </>;
}
