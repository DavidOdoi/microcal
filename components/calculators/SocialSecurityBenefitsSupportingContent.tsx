import Link from 'next/link';

export function SocialSecurityBenefitsSupportingContent() {
  return <>
    <h2>{"What Is a Social Security Benefits Calculator?"}</h2>
    <p>{"A "}<strong>{"Social Security Benefits Calculator"}</strong>{" helps you estimate how much monthly retirement income you may receive from the US Social Security program."}</p>
    <p>{"Your benefit depends on several factors, including your lifetime earnings, the age you begin collecting benefits, and the year you become eligible."}</p>
    <p>{"For example, someone who starts receiving benefits at 62 will generally receive less each month than someone with the same earnings history who waits until full retirement age."}</p>
    <p>{"According to the "}<a href="https://www.ssa.gov/prepare/get-benefits-estimate">{"Social Security Administration (SSA)"}</a>{", retirement benefits are based primarily on your covered earnings and when you claim."}</p>
    <p>{"Our calculator helps you explore different retirement ages and estimate how Social Security could contribute to your retirement income."}</p>
    <h2>{"How to Use Our Social Security Benefits Calculator"}</h2>
    <p>{"The most useful estimate starts with your actual Social Security earnings record."}</p>
    <p>{"Depending on the calculator's available inputs, enter:"}</p>
    <ol><li><strong>{"Year of birth:"}</strong>{" Determines your full retirement age."}</li><li><strong>{"Retirement age:"}</strong>{" Select when you expect to claim benefits."}</li><li><strong>{"Average earnings:"}</strong>{" Enter earnings information if supported."}</li><li><strong>{"Estimated full retirement benefit:"}</strong>{" Use the amount from your Social Security Statement if available."}</li><li><strong>{"Future earnings:"}</strong>{" Include expected earnings before retirement if supported."}</li></ol>
    <p>{"The calculator can compare estimated monthly benefits at different claiming ages."}</p>
    <p>{"For a personalized estimate, sign in to your "}<a href="https://www.ssa.gov/myaccount/">{"my Social Security account"}</a>{"."}</p>
    <h2>{"How Are Social Security Retirement Benefits Calculated?"}</h2>
    <p>{"Social Security generally bases retirement benefits on your highest 35 years of earnings covered by the program."}</p>
    <p>{"Past earnings are adjusted using wage indexing before calculating your "}<strong>{"Average Indexed Monthly Earnings (AIME)"}</strong>{"."}</p>
    <p>{"The simplified formula is:"}</p>
    <p><strong>{"AIME = Sum of Highest 35 Years of Indexed Earnings ÷ 420"}</strong></p>
    <p>{"The SSA then applies a formula to calculate your "}<strong>{"Primary Insurance Amount (PIA)"}</strong>{"."}</p>
    <p>{"PIA is generally your monthly retirement benefit at full retirement age, before any additional adjustments or deductions."}</p>
    <p>{"The "}<a href="https://www.ssa.gov/oact/progdata/retirebenefit1.html">{"SSA explains this calculation process"}</a>{"."}</p>
    <p>{"If you worked fewer than 35 years, years without covered earnings generally count as zeros."}</p>
    <h2>{"Social Security Benefits Formula for 2026"}</h2>
    <p>{"For workers first eligible for retirement benefits in 2026, the SSA uses the following PIA formula:"}</p>
    <p><strong>{"PIA = 90% of the first $1,286 of AIME + 32% of AIME between $1,286 and $7,749 + 15% of AIME above $7,749"}</strong></p>
    <p>{"These income thresholds are called "}<em>{"bend points"}</em>{"."}</p>
    <p>{"For an AIME of $4,000:"}</p>
    <div className="finance-table-wrap"><table><thead><tr><th scope="col">{"Calculation"}</th><th scope="col">{"Amount"}</th></tr></thead><tbody><tr><td>{"90% × $1,286"}</td><td>{"$1,157.40"}</td></tr><tr><td>{"32% × ($4,000 − $1,286)"}</td><td>{"$868.48"}</td></tr><tr><td><strong>{"Total before rounding"}</strong></td><td><strong>{"$2,025.88"}</strong></td></tr><tr><td><strong>{"PIA rounded down to the nearest dime"}</strong></td><td><strong>{"$2,025.80"}</strong></td></tr></tbody></table></div>
    <p>{"This is a simplified illustration for someone first eligible in 2026."}</p>
    <p>{"It does not include other possible benefit adjustments."}</p>
    <p>{"Importantly, bend points depend on the year you first become eligible, not simply the year you're using the calculator."}</p>
    <p>{"See the "}<a href="https://www.ssa.gov/oact/cola/piaformula.html">{"SSA's official PIA formula"}</a>{" for annual figures."}</p>
    <h2>{"How Does Retirement Age Affect Your Benefits?"}</h2>
    <p>{"You can generally begin receiving Social Security retirement benefits as early as age 62."}</p>
    <p>{"However, claiming before full retirement age permanently reduces your monthly benefit, subject to future adjustments."}</p>
    <p>{"Your full retirement age depends on your birth year."}</p>
    <p>{"For people born in 1960 or later, it is 67."}</p>
    <p>{"Consider someone with a hypothetical $2,000 monthly benefit at full retirement age:"}</p>
    <div className="finance-table-wrap"><table><thead><tr><th scope="col">{"Claiming age"}</th><th scope="col">{"Percentage of full benefit"}</th><th scope="col">{"Monthly estimate"}</th></tr></thead><tbody><tr><td>{"62"}</td><td>{"70%"}</td><td>{"$1,400"}</td></tr><tr><td>{"67"}</td><td>{"100%"}</td><td>{"$2,000"}</td></tr><tr><td>{"70"}</td><td>{"124%"}</td><td>{"$2,480"}</td></tr></tbody></table></div>
    <p>{"These percentages apply to a worker with full retirement age 67."}</p>
    <p>{"The example excludes future cost-of-living adjustments and changes in earnings."}</p>
    <p>{"The "}<a href="https://www.ssa.gov/benefits/retirement/planner/1960.html">{"SSA's retirement-age guidance"}</a>{" explains early claiming reductions."}</p>
    <p>{"You can also review its "}<a href="https://www.ssa.gov/benefits/retirement/planner/1960-delay.html">{"delayed retirement credit rules"}</a>{"."}</p>
    <h2>{"How Much Is the Average Social Security Benefit?"}</h2>
    <p>{"For January 2026, the SSA estimated the average monthly benefit for retired workers at approximately "}<strong>{"$2,071"}</strong>{", following the year's 2.8% cost-of-living adjustment."}</p>
    <p>{"However, this is an average, not the benefit every retiree receives."}</p>
    <p>{"Your actual amount could be considerably higher or lower depending on your earnings history and claiming age."}</p>
    <p>{"The SSA's "}<a href="https://www.ssa.gov/news/en/cola/factsheets/2026.html">{"2026 COLA fact sheet"}</a>{" provides the official figures."}</p>
    <p>{"For 2027, the SSA has announced a "}<strong>{"3.6% cost-of-living adjustment"}</strong>{", beginning with benefits payable in January 2027."}</p>
    <p>{"Read the "}<a href="https://www.ssa.gov/news/en/press/releases/2026-10-14.html">{"official 2027 announcement"}</a>{"."}</p>
    <h2>{"Can You Work While Receiving Social Security?"}</h2>
    <p>{"Yes. You can work while receiving retirement benefits."}</p>
    <p>{"However, if you haven't reached full retirement age, earnings above certain limits may temporarily reduce the benefits paid to you."}</p>
    <p>{"In 2026, the annual earnings limit for someone under full retirement age throughout the year is $24,480."}</p>
    <p>{"The SSA generally withholds $1 in benefits for every $2 earned above that limit."}</p>
    <p>{"Different rules apply during the year you reach full retirement age."}</p>
    <p>{"Once you reach full retirement age, the earnings test no longer applies."}</p>
    <p>{"The "}<a href="https://www.ssa.gov/benefits/retirement/planner/whileworking.html">{"SSA explains the earnings test"}</a>{" and how withheld benefits affect later benefit calculations."}</p>
    <h2>{"What Can Affect Your Actual Monthly Payment?"}</h2>
    <p>{"Your calculator's estimate may differ from the amount you actually receive."}</p>
    <p>{"Important factors include:"}</p>
    <ul><li>{"Your complete covered earnings history."}</li><li>{"Your claiming age."}</li><li>{"Future cost-of-living adjustments."}</li><li>{"Continued employment."}</li><li>{"Medicare premiums."}</li><li>{"Federal income taxes on benefits, where applicable."}</li><li>{"Spousal, survivor, or other benefit adjustments."}</li></ul>
    <p>{"Some people also qualify for benefits based on a spouse's or former spouse's earnings record."}</p>
    <p>{"These benefits follow separate rules and should not be estimated using the worker's retirement formula alone."}</p>
    <h2>{"How to Improve Your Social Security Retirement Estimate"}</h2>
    <p>{"Start by reviewing your official earnings record."}</p>
    <p>{"Make sure your reported earnings are accurate."}</p>
    <p>{"If possible, compare the effects of claiming at ages 62, full retirement age, and 70."}</p>
    <p>{"You should also consider other "}<Link href="/calculators/retirement-calculator/">{"retirement income sources"}</Link>{", including pensions, "}<Link href="/calculators/401k-calculator/">{"retirement accounts"}</Link>{", and "}<Link href="/calculators/compound-interest-calculator/">{"personal savings"}</Link>{"."}</p>
    <p>{"Delaying benefits may increase monthly payments, but claiming later isn't automatically the best decision for everyone."}</p>
    <p>{"Your health, employment plans, household needs, and financial circumstances matter."}</p>
    <p>{"For more reliable planning, compare your results with the "}<a href="https://www.ssa.gov/oact/anypia/">{"SSA's official retirement benefit calculators"}</a>{"."}</p>
    <h2>{"Frequently Asked Questions"}</h2>
    <h3>{"How much Social Security will I receive at age 62?"}</h3>
    <p>{"Your amount depends on your earnings record and full retirement age. For someone born in 1960 or later, claiming at 62 generally provides 70% of their full retirement benefit before other adjustments."}</p>
    <h3>{"What is the maximum Social Security benefit in 2026?"}</h3>
    <p>{"The maximum monthly benefit for a worker retiring at full retirement age in 2026 is $4,152. Higher benefits may be possible for eligible workers who delay claiming. Actual maximums depend on age and earnings history."}</p>
    <h3>{"Can I increase my Social Security benefits by working longer?"}</h3>
    <p>{"Potentially. Working longer may replace lower-earning or zero-earning years in your highest 35 years. Delaying benefits beyond full retirement age can also increase monthly retirement payments until age 70."}</p>
    <h2>{"Final Thoughts"}</h2>
    <p>{"Social Security can provide an important foundation for retirement income, but your benefit depends on your personal earnings history and claiming decisions."}</p>
    <p>{"Use the "}<strong>{"Social Security Benefits Calculator above"}</strong>{" to explore potential monthly payments at different retirement ages."}</p>
    <p>{"For the most accurate personalized estimate, compare your results with your official Social Security Statement."}</p>
    <p>{"Calculator estimates are for educational planning and do not determine your eligibility or official benefit amount."}</p>
  </>;
}
