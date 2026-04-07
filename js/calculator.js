/* ===== BOND & TRANSFER COST CALCULATOR ===== */

// --- South African Transfer Duty (SARS 2024/2025 rates) ---
// These rates are updated annually by SARS
function calcTransferDuty(price) {
  if (price <= 1100000) return 0;
  if (price <= 1512500) return (price - 1100000) * 0.03;
  if (price <= 2117500) return 12375 + (price - 1512500) * 0.06;
  if (price <= 2722500) return 48675 + (price - 2117500) * 0.08;
  if (price <= 12100000) return 97075 + (price - 2722500) * 0.11;
  return 1128625 + (price - 12100000) * 0.13;
}

// --- Conveyancing / Transfer Attorney Fees (guideline tariff) ---
function calcTransferAttorneyFees(price) {
  // Based on published SA guideline tariff (approximate)
  if (price <= 0) return 0;
  if (price <= 100000) return 5500;
  if (price <= 500000) return 8500;
  if (price <= 1000000) return 13000;
  if (price <= 1500000) return 17000;
  if (price <= 2000000) return 21500;
  if (price <= 3000000) return 27500;
  if (price <= 4000000) return 33000;
  if (price <= 5000000) return 38000;
  if (price <= 7500000) return 48000;
  if (price <= 10000000) return 58000;
  return 68000 + Math.floor((price - 10000000) / 1000000) * 5000;
}

// --- Bond Registration Attorney Fees (guideline tariff) ---
function calcBondAttorneyFees(bondAmount) {
  if (bondAmount <= 0) return 0;
  if (bondAmount <= 250000) return 6500;
  if (bondAmount <= 500000) return 9000;
  if (bondAmount <= 1000000) return 13500;
  if (bondAmount <= 1500000) return 17500;
  if (bondAmount <= 2000000) return 22000;
  if (bondAmount <= 3000000) return 28000;
  if (bondAmount <= 4000000) return 34000;
  if (bondAmount <= 5000000) return 40000;
  if (bondAmount <= 7500000) return 50000;
  if (bondAmount <= 10000000) return 60000;
  return 70000 + Math.floor((bondAmount - 10000000) / 1000000) * 5000;
}

// --- Deeds Office Fees (approximate) ---
function calcDeedsOfficeFee(price) {
  if (price <= 0) return 0;
  if (price <= 150000) return 250;
  if (price <= 300000) return 500;
  if (price <= 600000) return 750;
  if (price <= 1500000) return 1250;
  if (price <= 3000000) return 2000;
  if (price <= 5000000) return 3000;
  return 4000;
}

// --- Bond Repayment Calculation ---
function calcMonthlyRepayment(principal, annualRate, years) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
}

// --- Format Rand ---
function formatRand(amount) {
  return 'R ' + Math.round(amount).toLocaleString('en-ZA');
}

// --- Deposit from percentage ---
function calcDepositFromPercent() {
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  const pct = parseFloat(document.getElementById('calcDepositPercent').value) || 0;
  document.getElementById('calcDeposit').value = Math.round(price * pct / 100);
  calculateAll();
}

// --- Tab switching ---
function switchCalcTab(tab, btn) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

// --- Main calculation ---
function calculateAll() {
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  const deposit = parseFloat(document.getElementById('calcDeposit').value) || 0;
  const rate = parseFloat(document.getElementById('calcRate').value) || 11.75;
  const term = parseInt(document.getElementById('calcTerm').value) || 20;

  if (price <= 0) {
    const msg = '<p style="color:var(--gray-400);text-align:center;padding:20px;">Enter a purchase price above to see results</p>';
    document.getElementById('bondResults').innerHTML = msg;
    document.getElementById('transferResults').innerHTML = msg;
    document.getElementById('bothResults').innerHTML = msg;
    return;
  }

  const bondAmount = Math.max(0, price - deposit);
  const monthlyRepayment = calcMonthlyRepayment(bondAmount, rate, term);
  const totalRepayment = monthlyRepayment * term * 12;
  const totalInterest = totalRepayment - bondAmount;

  // Transfer costs
  const transferDuty = calcTransferDuty(price);
  const transferFees = calcTransferAttorneyFees(price);
  const transferDeeds = calcDeedsOfficeFee(price);
  const transferPostage = 1500; // approximate postage/petties
  const transferVAT = transferFees * 0.15;
  const totalTransfer = transferDuty + transferFees + transferVAT + transferDeeds + transferPostage;

  // Bond registration costs
  const bondFees = calcBondAttorneyFees(bondAmount);
  const bondDeeds = calcDeedsOfficeFee(bondAmount);
  const bondVAT = bondFees * 0.15;
  const bondPostage = 1200;
  const totalBondReg = bondAmount > 0 ? (bondFees + bondVAT + bondDeeds + bondPostage) : 0;

  const initiation = bondAmount > 0 ? 6038 : 0; // Bank initiation fee (approximate)
  const totalOnceCosts = totalTransfer + totalBondReg + initiation + deposit;

  // --- Bond Results ---
  document.getElementById('bondResults').innerHTML = `
    <div class="calc-result-row"><span class="label">Purchase Price</span><span class="value">${formatRand(price)}</span></div>
    <div class="calc-result-row"><span class="label">Deposit</span><span class="value">${formatRand(deposit)}</span></div>
    <div class="calc-result-row"><span class="label">Bond Amount</span><span class="value">${formatRand(bondAmount)}</span></div>
    <div class="calc-result-row"><span class="label">Interest Rate</span><span class="value">${rate}% p.a.</span></div>
    <div class="calc-result-row"><span class="label">Loan Term</span><span class="value">${term} years (${term * 12} months)</span></div>
    <div class="calc-result-row highlight"><span class="label">Monthly Repayment</span><span class="value" style="font-size:1.3rem;color:var(--red);">${formatRand(monthlyRepayment)}</span></div>
    <div class="calc-result-row"><span class="label">Total Repayment over ${term} years</span><span class="value">${formatRand(totalRepayment)}</span></div>
    <div class="calc-result-row"><span class="label">Total Interest Paid</span><span class="value">${formatRand(totalInterest)}</span></div>
  `;

  // --- Transfer Results ---
  document.getElementById('transferResults').innerHTML = `
    <h4 style="margin-bottom:12px;font-size:0.95rem;">Transfer Costs</h4>
    <div class="calc-result-row"><span class="label">Transfer Duty (SARS)</span><span class="value">${formatRand(transferDuty)}</span></div>
    <div class="calc-result-row"><span class="label">Conveyancing / Attorney Fees</span><span class="value">${formatRand(transferFees)}</span></div>
    <div class="calc-result-row"><span class="label">VAT on Attorney Fees (15%)</span><span class="value">${formatRand(transferVAT)}</span></div>
    <div class="calc-result-row"><span class="label">Deeds Office Fee</span><span class="value">${formatRand(transferDeeds)}</span></div>
    <div class="calc-result-row"><span class="label">Postage & Petties</span><span class="value">${formatRand(transferPostage)}</span></div>
    <div class="calc-result-row total"><span class="label">Total Transfer Costs</span><span class="value">${formatRand(totalTransfer)}</span></div>

    ${bondAmount > 0 ? `
    <h4 style="margin:24px 0 12px;font-size:0.95rem;">Bond Registration Costs</h4>
    <div class="calc-result-row"><span class="label">Bond Attorney Fees</span><span class="value">${formatRand(bondFees)}</span></div>
    <div class="calc-result-row"><span class="label">VAT on Attorney Fees (15%)</span><span class="value">${formatRand(bondVAT)}</span></div>
    <div class="calc-result-row"><span class="label">Deeds Office Fee</span><span class="value">${formatRand(bondDeeds)}</span></div>
    <div class="calc-result-row"><span class="label">Postage & Petties</span><span class="value">${formatRand(bondPostage)}</span></div>
    <div class="calc-result-row total"><span class="label">Total Bond Registration</span><span class="value">${formatRand(totalBondReg)}</span></div>

    <div class="calc-result-row"><span class="label">Bank Initiation Fee (approx.)</span><span class="value">${formatRand(initiation)}</span></div>
    ` : ''}
  `;

  // --- Full Summary ---
  document.getElementById('bothResults').innerHTML = `
    <h4 style="margin-bottom:12px;font-size:0.95rem;">Monthly Costs</h4>
    <div class="calc-result-row highlight"><span class="label">Estimated Monthly Bond Repayment</span><span class="value" style="font-size:1.2rem;color:var(--red);">${formatRand(monthlyRepayment)}</span></div>

    <h4 style="margin:24px 0 12px;font-size:0.95rem;">Once-Off Costs Summary</h4>
    <div class="calc-result-row"><span class="label">Deposit</span><span class="value">${formatRand(deposit)}</span></div>
    <div class="calc-result-row"><span class="label">Transfer Duty</span><span class="value">${formatRand(transferDuty)}</span></div>
    <div class="calc-result-row"><span class="label">Transfer Attorney Fees (incl. VAT)</span><span class="value">${formatRand(transferFees + transferVAT + transferDeeds + transferPostage)}</span></div>
    ${bondAmount > 0 ? `
    <div class="calc-result-row"><span class="label">Bond Registration (incl. VAT)</span><span class="value">${formatRand(totalBondReg)}</span></div>
    <div class="calc-result-row"><span class="label">Bank Initiation Fee</span><span class="value">${formatRand(initiation)}</span></div>
    ` : ''}
    <div class="calc-result-row total"><span class="label">Total Cash Required Upfront</span><span class="value">${formatRand(totalOnceCosts)}</span></div>

    <h4 style="margin:24px 0 12px;font-size:0.95rem;">Over the Full Loan Term (${term} years)</h4>
    <div class="calc-result-row"><span class="label">Total Amount Repaid to Bank</span><span class="value">${formatRand(totalRepayment)}</span></div>
    <div class="calc-result-row"><span class="label">of which Interest</span><span class="value">${formatRand(totalInterest)}</span></div>
  `;
}

// Auto-sync deposit percentage when deposit amount changes
document.getElementById('calcDeposit')?.addEventListener('input', function() {
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  const deposit = parseFloat(this.value) || 0;
  if (price > 0) {
    document.getElementById('calcDepositPercent').value = Math.round(deposit / price * 100 * 10) / 10;
  }
});
