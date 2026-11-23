import Link from 'next/link';

export function MortgageExtraSupportingContent() {
  return <>
    <h2>{"What Is a Mortgage Extra Payment Calculator?"}</h2>
    <p>{"A "}<strong>{"Mortgage Extra Payment Calculator"}</strong>{" estimates how additional principal payments could reduce mortgage interest and shorten the time needed to pay off a home loan."}</p>
    <p>{"Most conventional mortgages require "}<Link href="/calculators/mortgage-calculator/">{"regular monthly payments"}</Link>{" covering "}<a href="https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-interest-and-principal-en-197/">{"principal and interest"}</a>{"."}</p>
    <p>{"During the early years of a typical fixed-rate mortgage, a relatively large portion of each payment goes toward interest."}</p>
    <p>{"Making "}<a href="https://yourhome.fanniemae.com/own/mortgage-payments">{"extra principal payments"}</a>{" can reduce the "}<Link href="/calculators/home-equity-loan-calculator/">{"outstanding balance"}</Link>{" faster."}</p>
    <p>{"When the balance falls, less interest accumulates in subsequent periods."}</p>
    <p>{"Our calculator helps homeowners compare their existing repayment schedule against a scenario with additional payments."}</p>
    <p>{"It is particularly useful when evaluating whether to make extra payments or direct spare cash toward other "}<Link href="/calculators/home-affordability-calculator/">{"financial goals"}</Link>{"."}</p>
    <h2>{"How to Use the Mortgage Extra Payment Calculator"}</h2>
    <p>{"Enter:"}</p>
    <ol><li><strong>{"Outstanding mortgage balance:"}</strong>{" The amount you currently owe."}</li><li><strong>{"Annual interest rate:"}</strong>{" Your mortgage interest rate."}</li><li><strong>{"Remaining loan term:"}</strong>{" The number of years or months left."}</li><li><strong>{"Regular monthly payment:"}</strong>{" The scheduled principal-and-interest payment, if available."}</li><li><strong>{"Extra monthly payment:"}</strong>{" The additional amount you want applied to principal."}</li><li><strong>{"One-time payment:"}</strong>{" An optional lump-sum principal payment."}</li></ol>
    <p>{"The calculator estimates your original payoff date, accelerated payoff date, total interest savings, and months saved."}</p>
    <p>{"You can compare several extra-payment amounts to determine which fits your budget."}</p>
    <h2>{"Mortgage Extra Payment Formula"}</h2>
    <p>{"For a conventional fixed-rate, fully amortizing mortgage:"}</p>
    <p><strong>{"Monthly Payment = P × r ÷ (1 − (1 + r)^−n)"}</strong></p>
    <p>{"Where:"}</p>
    <ul><li><strong>{"P:"}</strong>{" Current loan principal or outstanding balance."}</li><li><strong>{"r:"}</strong>{" Monthly interest rate."}</li><li><strong>{"n:"}</strong>{" Number of remaining monthly payments."}</li></ul>
    <p>{"To calculate interest during each monthly period:"}</p>
    <p><strong>{"Monthly Interest = Outstanding Balance × Monthly Interest Rate"}</strong></p>
    <p>{"The principal portion of a regular payment is:"}</p>
    <p><strong>{"Principal Paid = Monthly Payment − Monthly Interest"}</strong></p>
    <p>{"When making an extra principal payment:"}</p>
    <p><strong>{"New Balance = Previous Balance + Monthly Interest − Regular Payment − Extra Payment"}</strong></p>
    <p>{"The final payment should be adjusted so the balance never becomes negative."}</p>
    <p>{"Repeat the calculation until the mortgage balance reaches zero."}</p>
    <h2>{"Mortgage Extra Payment Example"}</h2>
    <p>{"Suppose you have a $200,000 mortgage at a fixed annual interest rate of 6%."}</p>
    <p>{"The remaining term is 30 years."}</p>
    <p>{"Your regular monthly principal-and-interest payment is approximately $1,199.10."}</p>
    <p>{"You decide to pay an additional $200 toward principal every month."}</p>
    <div className="finance-table-wrap"><table><thead><tr><th scope="col">{"Mortgage details"}</th><th scope="col">{"Value"}</th></tr></thead><tbody><tr><td>{"Starting balance"}</td><td>{"$200,000"}</td></tr><tr><td>{"Annual interest rate"}</td><td>{"6%"}</td></tr><tr><td>{"Original remaining term"}</td><td>{"30 years"}</td></tr><tr><td>{"Regular monthly payment"}</td><td>{"$1,199.10"}</td></tr><tr><td>{"Extra monthly principal"}</td><td>{"$200"}</td></tr></tbody></table></div>
    <p>{"Using a conventional monthly amortization model with full internal precision:"}</p>
    <div className="finance-table-wrap"><table><thead><tr><th scope="col">{"Result"}</th><th scope="col">{"Without extra payments"}</th><th scope="col">{"With $200 extra"}</th></tr></thead><tbody><tr><td>{"Payoff time"}</td><td>{"360 months"}</td><td>{"252 months"}</td></tr><tr><td>{"Total interest"}</td><td>{"$231,676"}</td><td>{"$151,876"}</td></tr><tr><td>{"Time saved"}</td><td>{"—"}</td><td>{"108 months"}</td></tr><tr><td><strong>{"Interest saved"}</strong></td><td>{"—"}</td><td><strong>{"Approximately $79,801"}</strong></td></tr></tbody></table></div>
    <p>{"These figures are illustrative and assume a fixed interest rate, no fees, and consistent payments."}</p>
    <p>{"Actual mortgage statements may differ due to payment dates, servicing rules, and rounding."}</p>
    <h2>{"Why Do Extra Mortgage Payments Save Interest?"}</h2>
    <p>{"Mortgage interest is generally calculated based on the outstanding principal."}</p>
    <p>{"When you reduce principal faster, you reduce the balance used for future interest calculations."}</p>
    <p>{"This can create substantial savings over a long repayment period."}</p>
    <p>{"However, the savings depend on the mortgage rate, timing of additional payments, remaining loan term, and how your servicer applies payments."}</p>
    <p>{"Making an extra payment early in the mortgage generally has more time to reduce future interest than making the same payment close to the payoff date."}</p>
    <h2>{"Should You Pay Extra Every Month or Make One Lump Sum?"}</h2>
    <p>{"Both approaches can reduce the principal balance."}</p>
    <p>{"Monthly extra payments allow you to make steady progress without committing a large amount at once."}</p>
    <p>{"A lump-sum payment may reduce principal immediately, potentially decreasing interest over subsequent periods."}</p>
    <p>{"The best option depends on your available cash, financial reserves, and mortgage terms."}</p>
    <p>{"Before using a large amount of savings to reduce debt, consider your emergency fund and other upcoming expenses."}</p>
    <p>{"Use our "}<Link href="/savings/emergency-fund-calculator/">{"Emergency Fund Calculator"}</Link>{" to evaluate your financial cushion."}</p>
    <h2>{"Does Paying Extra Reduce Your Regular Mortgage Payment?"}</h2>
    <p>{"Not necessarily."}</p>
    <p>{"On a typical fixed-rate mortgage, extra principal payments generally shorten the repayment period rather than automatically lowering the required monthly principal-and-interest payment."}</p>
    <p>{"Some lenders offer mortgage recasting, which can recalculate required payments after a substantial principal reduction."}</p>
    <p>{"Recasting depends on lender rules and loan eligibility."}</p>
    <p>{"A calculator should not assume that extra payments automatically trigger a recast."}</p>
    <h2>{"Are There Penalties for Paying Your Mortgage Early?"}</h2>
    <p>{"Some mortgages include prepayment penalties."}</p>
    <p>{"However, these do not apply to every mortgage, and the circumstances triggering them vary."}</p>
    <p>{"The "}<a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/">{"Consumer Financial Protection Bureau"}</a>{" explains that borrowers should review their loan agreements to determine whether penalties apply."}</p>
    <p>{"Also confirm that extra money is applied to principal rather than simply advancing the next payment due date."}</p>
    <h2>{"Extra Payments vs. Investing"}</h2>
    <p>{"Paying additional mortgage principal can reduce future interest costs."}</p>
    <p><Link href="/calculators/roi-calculator/">{"Investing the same money"}</Link>{" may generate returns, but those returns are uncertain."}</p>
    <p>{"For example, someone with a low fixed mortgage rate may prefer to preserve savings or invest, while someone with a higher mortgage rate may prioritize debt reduction."}</p>
    <p>{"Taxes, "}<a href="https://www.investor.gov/introduction-investing/investing-basics/what-risk">{"investment risk"}</a>{", liquidity, and personal goals all influence the decision."}</p>
    <p>{"A calculator can estimate mortgage savings, but it cannot determine the best financial decision for everyone."}</p>
    <h2>{"Frequently Asked Questions"}</h2>
    <h3>{"How much interest can I save by paying an extra $100 monthly?"}</h3>
    <p>{"It depends on your outstanding balance, mortgage rate, and remaining term. Enter an extra $100 monthly payment into the calculator to compare your original and accelerated amortization schedules."}</p>
    <h3>{"Will an extra mortgage payment lower my monthly payment?"}</h3>
    <p>{"Usually not automatically. Extra principal payments generally shorten the loan term unless the lender agrees to recast or otherwise change the repayment schedule."}</p>
    <h3>{"Is it better to make extra mortgage payments early?"}</h3>
    <p>{"For a typical fixed-rate mortgage, earlier principal reductions usually have more time to decrease future interest, assuming the same payment amount and loan terms."}</p>
    <h2>{"Final Thoughts"}</h2>
    <p>{"Extra mortgage payments can potentially save thousands of dollars in interest and shorten your repayment period."}</p>
    <p>{"Use the "}<strong>{"Mortgage Extra Payment Calculator above"}</strong>{" to explore different payment strategies."}</p>
    <p>{"Before making additional payments, review your mortgage agreement, emergency savings, and other financial priorities."}</p>
  </>;
}
