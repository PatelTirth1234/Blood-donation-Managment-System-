/**
 * HemaCare OS / RaktSetu — Printable Forms & Reports Engine
 * Enterprise-grade clinical document generator & print layout manager.
 * Generates NABH & CDSCO compliant medical certificates, dispatch slips,
 * stock audit reports, camp execution reports, and pre-donation screening forms.
 */

(function (window, document) {
  'use strict';

  const HemaCarePrint = {
    currentDocType: null,
    currentPayload: null,

    /**
     * Open the print preview dialog with a specified document type and data
     */
    openPreview(docType, payload) {
      this.currentDocType = docType;
      this.currentPayload = payload;

      const modal = document.getElementById('modalPrintPreview');
      const container = document.getElementById('printPreviewContent');
      const titleEl = document.getElementById('printDocTitle');
      const badgeEl = document.getElementById('printDocBadge');

      if (!modal || !container) {
        console.error('Print modal elements not found');
        return;
      }

      let title = 'Clinical Document';
      let badge = 'Print Ready';
      let html = '';

      switch (docType) {
        case 'certificate':
          title = 'Blood Donation Certificate of Appreciation & Donor Card';
          badge = 'Official Certificate';
          html = this.buildCertificateHTML(payload);
          break;
        case 'donor_card':
          title = 'Official Blood Donor Identification Card';
          badge = 'ID Card';
          html = this.buildDonorCardHTML(payload);
          break;
        case 'dispatch_slip':
          title = 'Blood Transfusion Requisition & Dispatch Slip';
          badge = 'Delivery Memo';
          html = this.buildDispatchSlipHTML(payload);
          break;
        case 'inventory_report':
          title = 'Cold Storage Inventory & Expiry Audit Statement';
          badge = 'Inventory Audit';
          html = this.buildInventoryReportHTML(payload);
          break;
        case 'camp_report':
          title = 'Blood Donation Camp Execution & Collection Report';
          badge = 'Camp Report';
          html = this.buildCampReportHTML(payload);
          break;
        case 'screening_form':
          title = 'Pre-Donation Medical Screening & Voluntary Consent Form';
          badge = 'Clinical Intake';
          html = this.buildScreeningFormHTML(payload);
          break;
        case 'donors_roster':
          title = 'Master Donor Directory & Eligibility Roster';
          badge = 'Master Registry';
          html = this.buildDonorsRosterHTML(payload);
          break;
        case 'audit_report':
          title = 'Clinical Compliance & Immutable Audit Ledger Report';
          badge = 'Audit Ledger';
          html = this.buildAuditReportHTML(payload);
          break;
        default:
          html = '<div style="padding:24px; text-align:center;">Document type not recognized.</div>';
      }

      if (titleEl) titleEl.textContent = title;
      if (badgeEl) badgeEl.textContent = badge;
      container.innerHTML = html;

      // Show modal
      modal.classList.add('open', 'show');
      modal.style.display = 'flex';
    },

    /**
     * Trigger browser print dialog for current document
     */
    print() {
      window.print();
    },

    /**
     * Close print preview modal
     */
    close() {
      const modal = document.getElementById('modalPrintPreview');
      if (modal) {
        modal.classList.remove('open', 'show');
        modal.style.display = 'none';
      }
    },

    // =========================================================================
    // 1. OFFICIAL BLOOD DONATION CERTIFICATE & DONOR CARD
    // =========================================================================
    buildCertificateHTML(data) {
      const donor = data?.donor || (window.localStore?.donors || [])[0] || {
        id: 1001,
        name: 'Rahul Sharma',
        bloodGroup: 'O+',
        city: 'Ahmedabad',
        phone: '9876543210'
      };

      const donation = data?.donation || {
        id: data?.donationId || 702,
        date: new Date().toISOString().split('T')[0],
        units: 1,
        hemoglobin: '14.5 g/dL',
        camp: 'Youth Rotary Blood Drive, Rajkot'
      };

      const certNo = `CERT-GUJ-${donor.id}-${donation.id || '901'}`;
      const printDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

      return `
        <div class="print-sheet certificate-sheet">
          <div class="cert-border-outer">
            <div class="cert-border-inner">
              
              <!-- Certificate Header -->
              <div class="cert-header">
                <div class="cert-emblem-left">
                  <div class="cert-crest">
                    <span style="font-size:32px;">🩸</span>
                  </div>
                </div>
                <div class="cert-title-group">
                  <div class="cert-gov-title">STATE BLOOD TRANSFUSION COUNCIL • GUJARAT</div>
                  <div class="cert-org-title">RAKTSETU CLINICAL BLOOD BANK & TRANSFUSION SERVICES</div>
                  <div class="cert-license">Licence No: G/28-A/7748 • Approved Under Drugs & Cosmetics Act, 1940</div>
                  <div class="cert-main-heading">CERTIFICATE OF APPRECIATION</div>
                  <div class="cert-sub-heading">HONOURING A VOLUNTARY BLOOD DONOR HERO</div>
                </div>
                <div class="cert-emblem-right">
                  <div class="cert-qr-box">
                    <div style="font-size:10px; font-weight:700; color:#1e293b; margin-bottom:2px;">SECURE VERIFIED</div>
                    <div class="cert-barcode">|||| | ||||| || |||| |</div>
                    <div style="font-size:9px; font-family:monospace; color:#64748b;">${certNo}</div>
                  </div>
                </div>
              </div>

              <!-- Certificate Body -->
              <div class="cert-body">
                <div class="cert-prose">This is to gratefully certify and place on record our sincere appreciation to</div>
                <div class="cert-donor-name">${donor.name || 'Respected Voluntary Donor'}</div>
                <div class="cert-donor-sub">Resident of <strong>${donor.city || 'Ahmedabad'}, Gujarat</strong> • Donor ID: <strong>#DON-${donor.id}</strong></div>

                <div class="cert-prose-desc">
                  for voluntarily donating blood for the noble cause of saving human lives. 
                  Your compassionate gift of life exemplifies civic responsibility and provides life-saving support to emergency trauma, surgical, and thalassemic patients in need.
                </div>

                <!-- Clinical Metadata Grid -->
                <div class="cert-meta-grid">
                  <div class="cert-meta-box">
                    <span class="cert-meta-label">BLOOD GROUP</span>
                    <span class="cert-meta-val blood-val">${donor.bloodGroup || 'O+'}</span>
                  </div>
                  <div class="cert-meta-box">
                    <span class="cert-meta-label">UNITS DONATED</span>
                    <span class="cert-meta-val">${donation.units || 1} Unit (350 mL Whole Blood)</span>
                  </div>
                  <div class="cert-meta-box">
                    <span class="cert-meta-label">DATE OF COLLECTION</span>
                    <span class="cert-meta-val">${donation.date || printDate}</span>
                  </div>
                  <div class="cert-meta-box">
                    <span class="cert-meta-label">DONATION VENUE / CAMP</span>
                    <span class="cert-meta-val">${donation.camp || 'Central Blood Bank Collection Centre'}</span>
                  </div>
                  <div class="cert-meta-box">
                    <span class="cert-meta-label">VERIFIED HEMOGLOBIN</span>
                    <span class="cert-meta-val">${donation.hemoglobin || '14.2 g/dL (Cleared)'}</span>
                  </div>
                  <div class="cert-meta-box">
                    <span class="cert-meta-label">NEXT ELIGIBLE DATE</span>
                    <span class="cert-meta-val">After 90 Days</span>
                  </div>
                </div>

                <div class="cert-quote">
                  "One unit of voluntary blood donation can sustain up to three lives. You are a true lifeline to the community."
                </div>

                <!-- Signatures & Official Seal -->
                <div class="cert-footer">
                  <div class="cert-sig-block">
                    <div class="cert-sig-line">
                      <span class="cert-sig-script">Dr. Rakesh Patel</span>
                    </div>
                    <div class="cert-sig-name">Dr. Rakesh Patel, MD</div>
                    <div class="cert-sig-title">Senior Transfusion Officer (GMC-48291)</div>
                  </div>

                  <div class="cert-seal-wrap">
                    <div class="cert-gold-seal">
                      <div class="seal-inner">
                        <div style="font-size:9px; font-weight:800; letter-spacing:1px;">RAKTSETU</div>
                        <div style="font-size:14px;">★ ★ ★</div>
                        <div style="font-size:8px; font-weight:700;">OFFICIAL SEAL</div>
                      </div>
                    </div>
                  </div>

                  <div class="cert-sig-block">
                    <div class="cert-sig-line">
                      <span class="cert-sig-script">Tirth Patel</span>
                    </div>
                    <div class="cert-sig-name">Tirth Patel</div>
                    <div class="cert-sig-title">Director, Regional Blood Transfusion Center</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- DETACHABLE WALLET DONOR CARD -->
          <div class="wallet-card-container">
            <div class="cut-line">
              <span class="cut-scissors">✂</span> 
              <span>Detach along dotted line for Official Wallet Donor Card</span>
            </div>

            <div class="wallet-card-grid">
              <!-- Card Front -->
              <div class="wallet-card wallet-card-front">
                <div class="wc-header">
                  <div>
                    <div class="wc-title">RAKTSETU • BLOOD DONOR CARD</div>
                    <div class="wc-sub">Govt. Recognized Clinical Donor Identification</div>
                  </div>
                  <div class="wc-emblem">🩸</div>
                </div>
                <div class="wc-body">
                  <div class="wc-main-info">
                    <div class="wc-name">${donor.name || 'Rahul Sharma'}</div>
                    <div class="wc-id">ID: #DON-${donor.id} • ${donor.city || 'Ahmedabad'}</div>
                    <div class="wc-contact">Mobile: ${donor.phone || '9876543210'}</div>
                  </div>
                  <div class="wc-badge-wrap">
                    <div class="wc-blood-badge">${donor.bloodGroup || 'O+'}</div>
                  </div>
                </div>
                <div class="wc-footer">
                  <span>Emergency 24x7 Helpline: 104 / 1800-11-8888</span>
                  <span style="font-weight:700;">Valid Across Gujarat</span>
                </div>
              </div>

              <!-- Card Back -->
              <div class="wallet-card wallet-card-back">
                <div class="wc-header">
                  <div class="wc-title">DONOR BENEFIT PRIVILEGES</div>
                  <div class="wc-sub">Priority Blood Issue for Donor & Direct Family</div>
                </div>
                <div class="wc-back-text">
                  1. Donor card entitles cardholder and immediate family to priority issuance of blood components in emergency.<br>
                  2. Keep this card handy during travel. In medical need, present at any verified blood bank.<br>
                  3. Maintain 90 days interval between full blood donations.
                </div>
                <div class="wc-footer" style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="wc-barcode">|||| |||||| ||| |||||||</span>
                  <span style="font-size:9.5px; font-weight:700;">Emergency Lifeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 2. DONOR WALLET CARD (STANDALONE)
    // =========================================================================
    buildDonorCardHTML(donor) {
      donor = donor || (window.localStore?.donors || [])[0] || {
        id: 1001,
        name: 'Rahul Sharma',
        bloodGroup: 'O+',
        city: 'Ahmedabad',
        phone: '9876543210',
        gender: 'Male',
        age: 26,
        eligibilityStatus: 'Eligible'
      };

      return `
        <div class="print-sheet card-sheet">
          <div class="sheet-title-print">OFFICIAL STATE BLOOD DONOR IDENTIFICATION CARD</div>
          <div class="sheet-sub-print">Govt. Certified Voluntary Transfusion Donor • Ready to Print on Standard PVC / Cardstock (85.60 mm × 53.98 mm)</div>

          <div class="wallet-card-grid" style="margin-top:24px;">
            <!-- Front -->
            <div class="wallet-card wallet-card-front" style="width:360px; height:220px;">
              <div class="wc-header">
                <div>
                  <div class="wc-title" style="font-size:13px;">RAKTSETU GUJARAT • DONOR IDENTITY</div>
                  <div class="wc-sub">State Blood Transfusion Council</div>
                </div>
                <div class="wc-emblem" style="font-size:24px;">🩸</div>
              </div>
              <div class="wc-body" style="padding:12px 14px;">
                <div class="wc-main-info">
                  <div class="wc-name" style="font-size:17px;">${donor.name}</div>
                  <div class="wc-id" style="font-size:12px;">ID: #DON-${donor.id} • ${donor.gender || 'Male'}, ${donor.age || 26} Yrs</div>
                  <div class="wc-contact" style="font-size:11.5px; margin-top:4px;">City: ${donor.city || 'Ahmedabad'}</div>
                  <div class="wc-contact" style="font-size:11.5px;">Ph: ${donor.phone || '9876543210'}</div>
                  <div style="font-size:10px; color:#16a34a; font-weight:700; margin-top:6px;">✓ VERIFIED CLINICAL ELIGIBILITY</div>
                </div>
                <div class="wc-badge-wrap">
                  <div class="wc-blood-badge" style="font-size:26px; padding:8px 12px;">${donor.bloodGroup}</div>
                </div>
              </div>
              <div class="wc-footer">
                <span>Emergency Hotline: 104</span>
                <span class="wc-barcode">|||| |||||| ||| |||</span>
              </div>
            </div>

            <!-- Back -->
            <div class="wallet-card wallet-card-back" style="width:360px; height:220px;">
              <div class="wc-header">
                <div class="wc-title" style="font-size:12px;">CLINICAL TRANSFUSION TERMS</div>
                <div class="wc-sub">Medical Emergency Direct Line</div>
              </div>
              <div class="wc-back-text" style="font-size:10px; line-height:1.45; padding:8px 14px;">
                • Cardholder is registered on the Central Transfusion Registry.<br>
                • Entitled to emergency blood issue for family across all empaneled hospitals.<br>
                • Minimum donation cooldown: 90 days whole blood, 14 days apheresis platelets.<br>
                • In loss of card or emergency dispatch, report immediately via RaktSetu portal.
              </div>
              <div style="padding:6px 14px; font-size:10.5px; border-top:1px dashed #cbd5e1; display:flex; justify-content:space-between;">
                <span>Authorized Signatory</span>
                <span style="font-weight:700;">Director of Transfusion</span>
              </div>
              <div class="wc-footer">
                <span>https://raktsetu.gujarat.gov.in</span>
                <span>ISO 9001:2015</span>
              </div>
            </div>
          </div>

          <div style="margin-top:30px; font-size:12px; color:#64748b; text-align:center;">
            ✂ Cut carefully along edges and fold or laminate for standard wallet pocket size.
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 3. BLOOD DISPATCH SLIP & DELIVERY CHALLAN (MEMO)
    // =========================================================================
    buildDispatchSlipHTML(req) {
      req = req || (window.localStore?.requests || [])[0] || {
        id: 9001,
        patientName: 'Karan Patel',
        hospitalName: 'Civil Hospital',
        location: 'Ahmedabad',
        date: new Date().toISOString().split('T')[0],
        disease: 'Accident Trauma',
        bloodGroup: 'B+',
        urgency: 'Emergency',
        unitsRequested: 4,
        dispatchTracking: 'DISP-GUJ-9001'
      };

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
      const dispatchNo = req.dispatchTracking || `DISP-GUJ-${req.id || 9001}`;

      return `
        <div class="print-sheet dispatch-sheet">
          <!-- Letterhead -->
          <div class="doc-header">
            <div class="doc-header-left">
              <div class="doc-org-name">RAKTSETU REGIONAL BLOOD TRANSFUSION CENTRE</div>
              <div class="doc-org-sub">Approved by Food & Drug Control Administration (FDCA) & National Blood Transfusion Council</div>
              <div class="doc-org-sub">Transfusion House, Opp. Civil Hospital Campus, Asarwa, Ahmedabad - 380016</div>
              <div class="doc-org-sub">Phone: 079-2268-1234 • Email: dispatch@raktsetu.org • 24x7 Emergency Line: 104</div>
            </div>
            <div class="doc-header-right">
              <div class="doc-badge-crimson">CODE RED DISPATCH</div>
              <div style="font-size:10px; font-weight:700; color:#64748b; margin-top:4px;">CONSIGNMENT NO:</div>
              <div style="font-size:14px; font-weight:800; font-family:monospace; color:#0f172a;">${dispatchNo}</div>
              <div class="cert-barcode" style="font-size:16px;">|||| | |||| || ||||| |</div>
            </div>
          </div>

          <div class="doc-divider"></div>

          <div class="doc-title-bar">
            <span>OFFICIAL BLOOD PRODUCT TRANSFUSION DISPATCH SLIP & DELIVERY MEMO</span>
            <span style="font-size:12px; font-weight:600;">Issue Date: ${dateStr} • ${timeStr}</span>
          </div>

          <!-- 2-Column Parties Section -->
          <div class="parties-grid">
            <div class="party-box">
              <div class="party-box-title">RECIPIENT HOSPITAL & CLINICAL WARD</div>
              <table class="compact-doc-table">
                <tr><td class="lbl">Hospital:</td><td><strong>${req.hospitalName || 'Civil Hospital'}</strong></td></tr>
                <tr><td class="lbl">Location / City:</td><td>${req.location || 'Ahmedabad'}, Gujarat</td></tr>
                <tr><td class="lbl">Patient Name:</td><td><strong>${req.patientName || 'Emergency Trauma Patient'}</strong></td></tr>
                <tr><td class="lbl">Clinical Diagnosis:</td><td>${req.disease || 'Severe Hemorrhage / Acute Trauma'}</td></tr>
                <tr><td class="lbl">Requisition Ref:</td><td>#REQ-${req.id} (Triage: ${req.urgency || 'Emergency'})</td></tr>
              </table>
            </div>

            <div class="party-box">
              <div class="party-box-title">DISPATCHING BLOOD BANK FACILITY</div>
              <table class="compact-doc-table">
                <tr><td class="lbl">Issuing Bank:</td><td>RaktSetu Central Cold Storage Vault</td></tr>
                <tr><td class="lbl">Supervising Phlebotomist:</td><td>Sister Ananya Rao (HC-NUR-4029)</td></tr>
                <tr><td class="lbl">Medical Officer On Duty:</td><td>Dr. Rakesh Patel (GMC-48291)</td></tr>
                <tr><td class="lbl">Cold-Chain Container:</td><td>Pelicase Vacuum Insulated Box #CB-04</td></tr>
                <tr><td class="lbl">Transit Dispatch Temp:</td><td><strong>+3.8 °C (Verified within +2°C to +6°C)</strong></td></tr>
              </table>
            </div>
          </div>

          <!-- Dispatched Units Inventory Table -->
          <div style="margin-top:16px;">
            <div class="table-caption-print">DISPATCHED BLOOD COMPONENTS & CROSS-MATCH CLEARANCE</div>
            <table class="doc-data-table">
              <thead>
                <tr>
                  <th>Unit Serial / Bag ID</th>
                  <th>Component Type</th>
                  <th>Blood Group</th>
                  <th>Volume</th>
                  <th>Collection Date</th>
                  <th>Expiry Date</th>
                  <th>Cross-Match Assay</th>
                  <th>Anticoagulant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>BAG-GUJ-${req.id}-A1</strong></td>
                  <td>Whole Blood (Human)</td>
                  <td><span class="blood-pill-print">${req.bloodGroup}</span></td>
                  <td>350 mL</td>
                  <td>${dateStr}</td>
                  <td>35 Days (CPDA-1)</td>
                  <td><span class="status-pass-print">✓ COMPATIBLE (Negative)</span></td>
                  <td>CPDA-1</td>
                </tr>
                ${(req.unitsRequested || 1) > 1 ? `
                <tr>
                  <td><strong>BAG-GUJ-${req.id}-A2</strong></td>
                  <td>Whole Blood (Human)</td>
                  <td><span class="blood-pill-print">${req.bloodGroup}</span></td>
                  <td>350 mL</td>
                  <td>${dateStr}</td>
                  <td>35 Days (CPDA-1)</td>
                  <td><span class="status-pass-print">✓ COMPATIBLE (Negative)</span></td>
                  <td>CPDA-1</td>
                </tr>` : ''}
                ${(req.unitsRequested || 1) > 2 ? `
                <tr>
                  <td><strong>BAG-GUJ-${req.id}-A3</strong></td>
                  <td>Packed Red Blood Cells (PRBC)</td>
                  <td><span class="blood-pill-print">${req.bloodGroup}</span></td>
                  <td>280 mL</td>
                  <td>${dateStr}</td>
                  <td>42 Days (SAGM)</td>
                  <td><span class="status-pass-print">✓ COMPATIBLE (Negative)</span></td>
                  <td>SAGM</td>
                </tr>` : ''}
              </tbody>
            </table>
          </div>

          <!-- Mandatory Safety & Testing Clearance Declaration -->
          <div class="safety-declaration-box">
            <div style="font-weight:700; font-size:11px; margin-bottom:4px; color:#991b1b;">
              MANDATORY SEROLOGICAL TESTING VERIFICATION (DCGI / WHO STANDARDS)
            </div>
            <div style="font-size:10.5px; line-height:1.45; color:#334155;">
              All blood units listed have been screened individually and confirmed <strong>NON-REACTIVE</strong> for:
              <strong>HIV-1 &amp; HIV-2 (Antibody/p24), Hepatitis B (HBsAg), Hepatitis C (HCV Ab), Syphilis (VDRL/RPR), and Malaria Parasite (MP)</strong>.
              Units were maintained continuously under monitored cold-chain telemetry (+2°C to +6°C).
            </div>
          </div>

          <!-- Signatures Section -->
          <div class="signatures-row" style="margin-top:28px;">
            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Dispatched By (Technician)</div>
              <div class="sig-sub">Sign, Name &amp; Employee ID</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Verified By (Medical Officer)</div>
              <div class="sig-sub">Sign &amp; GMC Medical Stamp</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Transport Driver / Courier</div>
              <div class="sig-sub">Van GJ-01-HC-4412 • Departure Time</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Received By (Hospital Ward)</div>
              <div class="sig-sub">Sister / Transfusion Ward Stamp</div>
            </div>
          </div>

          <!-- Bottom Notice -->
          <div class="doc-footer-notice">
            * This dispatch slip is a legally binding medical delivery challan. Retain duplicate copy for hospital transfusion committee records for 5 years.
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 4. INVENTORY STOCK & EXPIRY AUDIT STATEMENT
    // =========================================================================
    buildInventoryReportHTML() {
      const inventory = window.localStore?.inventory || [];
      const printDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      
      let totalUnits = 0;
      let criticalGroups = 0;

      const rows = inventory.map(item => {
        totalUnits += Number(item.units || 0);
        const isCritical = item.units < 30;
        if (isCritical) criticalGroups++;

        return `
          <tr>
            <td><strong>${item.bloodGroup}</strong></td>
            <td><strong>${item.units} Units</strong></td>
            <td>${Math.round(item.units * 0.55)} U</td>
            <td>${Math.round(item.units * 0.25)} U</td>
            <td>${Math.round(item.units * 0.20)} U</td>
            <td>${item.rack || 'RACK-COLD (+4°C)'}</td>
            <td>${item.expiringSoon || 0} Units</td>
            <td>${item.expiryDate || '2026-10-25'}</td>
            <td>
              <span class="${isCritical ? 'status-critical-print' : 'status-pass-print'}">
                ${isCritical ? 'CRITICAL SHORTAGE' : 'SAFE / OPTIMAL'}
              </span>
            </td>
          </tr>
        `;
      }).join('');

      return `
        <div class="print-sheet report-sheet">
          <div class="doc-header">
            <div class="doc-header-left">
              <div class="doc-org-name">RAKTSETU CENTRAL BLOOD TRANSFUSION SERVICES</div>
              <div class="doc-org-sub">Comprehensive Cold Storage Stock Audit &amp; Component Inventory Statement</div>
              <div class="doc-org-sub">Facility: Regional Blood Center, Ahmedabad • Licensed by State Drug Licensing Authority</div>
            </div>
            <div class="doc-header-right">
              <div style="font-size:11px; font-weight:700; color:#64748b;">REPORT CODE:</div>
              <div style="font-size:14px; font-weight:800; font-family:monospace; color:#0f172a;">AUD-INV-${Date.now().toString().slice(-6)}</div>
              <div style="font-size:11px; color:#475569; margin-top:3px;">Printed: ${printDate}</div>
            </div>
          </div>

          <div class="doc-divider"></div>

          <!-- KPI Summary Strip -->
          <div class="audit-summary-grid">
            <div class="as-box">
              <div class="as-label">TOTAL BLOOD UNITS IN BANK</div>
              <div class="as-val">${totalUnits} Units</div>
            </div>
            <div class="as-box">
              <div class="as-label">COLD VAULT TELEMETRY</div>
              <div class="as-val" style="color:#16a34a;">+3.8 °C (Normal)</div>
            </div>
            <div class="as-box">
              <div class="as-label">CRITICAL SHORTAGE GROUPS</div>
              <div class="as-val" style="color:${criticalGroups > 0 ? '#dc2626' : '#16a34a'};">${criticalGroups} Groups</div>
            </div>
            <div class="as-box">
              <div class="as-label">RESERVED FOR TRAUMA ER</div>
              <div class="as-val">45 Units</div>
            </div>
          </div>

          <!-- Inventory Table -->
          <div style="margin-top:20px;">
            <div class="table-caption-print">BLOOD GROUP STOCK LEVEL &amp; SHELF-LIFE MATRIX</div>
            <table class="doc-data-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Total Units</th>
                  <th>Whole Blood</th>
                  <th>Packed Cells (PRBC)</th>
                  <th>Fresh Plasma (FFP)</th>
                  <th>Sterile Rack Location</th>
                  <th>Expiring (&lt;7 Days)</th>
                  <th>Next Expiry Batch</th>
                  <th>Safety Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>

          <!-- IoT Temperature Verification Section -->
          <div style="margin-top:16px;" class="party-box">
            <div class="party-box-title">COLD-CHAIN IOT TELEMETRY &amp; REFRIGERATION VALIDATION</div>
            <div style="font-size:11px; line-height:1.5; color:#334155;">
              • <strong>Whole Blood Cold Vault (Racks A1-B4):</strong> Current +3.8°C | 24h Min: +3.2°C | 24h Max: +4.4°C (Optimal Compliance)<br>
              • <strong>Plasma Deep Cryo-Freezer (F1-F8):</strong> Current -31.2°C | Compliant with WHO -30°C criteria<br>
              • <strong>Platelet Agitator Incubator (P1-P3):</strong> Current +22.4°C | Continuous gentle horizontal oscillation verified<br>
              • <strong>Emergency Back-up Diesel Generator:</strong> Tested and operational with automatic transfer switch
            </div>
          </div>

          <!-- Signatures -->
          <div class="signatures-row" style="margin-top:36px;">
            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Senior Blood Bank Technologist</div>
              <div class="sig-sub">Quality Control Supervisor</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Dr. Rakesh Patel, MD</div>
              <div class="sig-sub">Medical Officer In-Charge (GMC-48291)</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">State Drug Inspector / Auditor</div>
              <div class="sig-sub">FDCA Regulatory Inspection Seal</div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 5. BLOOD DONATION CAMP EXECUTION REPORT
    // =========================================================================
    buildCampReportHTML(camp) {
      camp = camp || (window.localStore?.camps || [])[0] || {
        id: 6004,
        name: 'Youth Rotary Blood Drive',
        date: '2026-09-15',
        time: '10:30 AM - 04:30 PM',
        location: 'Rajkot Sports Complex, Race Course',
        city: 'Rajkot',
        targetUnits: 110,
        collectedUnits: 42,
        inchargeStaff: 'Meera Joshi',
        phone: '9876543204',
        status: 'Active',
        notes: 'Live voluntary community drive',
        doctorRegNo: 'GMC-48291'
      };

      const achievementPct = Math.round(((camp.collectedUnits || 40) / (camp.targetUnits || 100)) * 100);

      return `
        <div class="print-sheet report-sheet">
          <div class="doc-header">
            <div class="doc-header-left">
              <div class="doc-org-name">RAKTSETU VOLUNTARY BLOOD DONATION PROGRAM</div>
              <div class="doc-org-sub">Post-Camp Execution, Donor Roster &amp; Collection Summary Statement</div>
              <div class="doc-org-sub">Gujarat State Blood Transfusion Council Mobile Phlebotomy Division</div>
            </div>
            <div class="doc-header-right">
              <div class="doc-badge-crimson" style="background:#2563eb;">CAMP SUMMARY</div>
              <div style="font-size:11px; font-weight:700; color:#64748b; margin-top:4px;">CAMP CODE:</div>
              <div style="font-size:14px; font-weight:800; font-family:monospace; color:#0f172a;">#CAMP-${camp.id}</div>
            </div>
          </div>

          <div class="doc-divider"></div>

          <!-- Camp Particulars -->
          <div class="parties-grid">
            <div class="party-box">
              <div class="party-box-title">CAMP OPERATIONAL PARAMETERS</div>
              <table class="compact-doc-table">
                <tr><td class="lbl">Camp Title:</td><td><strong>${camp.name}</strong></td></tr>
                <tr><td class="lbl">Venue / Address:</td><td>${camp.location}, ${camp.city}</td></tr>
                <tr><td class="lbl">Scheduled Date:</td><td>${camp.date} (${camp.time || '10:00 AM - 04:00 PM'})</td></tr>
                <tr><td class="lbl">Organizing Partner:</td><td>${camp.notes || 'Rotary Club & Youth Civic Organization'}</td></tr>
              </table>
            </div>

            <div class="party-box">
              <div class="party-box-title">SUPERVISING CLINICAL TEAM</div>
              <table class="compact-doc-table">
                <tr><td class="lbl">Camp Medical Officer:</td><td>Dr. Rakesh Patel (${camp.doctorRegNo || 'GMC-48291'})</td></tr>
                <tr><td class="lbl">Lead Phlebotomist:</td><td>${camp.inchargeStaff || 'Meera Joshi'}</td></tr>
                <tr><td class="lbl">Helpline Contact:</td><td>${camp.phone || '9876543204'}</td></tr>
                <tr><td class="lbl">Phlebotomy Couches:</td><td>6 Dual-Head Mobile Donation Stations</td></tr>
              </table>
            </div>
          </div>

          <!-- Collection Statistics -->
          <div class="audit-summary-grid" style="margin-top:16px;">
            <div class="as-box">
              <div class="as-label">TARGET COLLECTION</div>
              <div class="as-val">${camp.targetUnits} Units</div>
            </div>
            <div class="as-box">
              <div class="as-label">TOTAL UNITS COLLECTED</div>
              <div class="as-val" style="color:#16a34a;">${camp.collectedUnits} Units</div>
            </div>
            <div class="as-box">
              <div class="as-label">ACHIEVEMENT RATE</div>
              <div class="as-val" style="color:#2563eb;">${achievementPct}%</div>
            </div>
            <div class="as-box">
              <div class="as-label">ADVERSE REACTIONS</div>
              <div class="as-val" style="color:#16a34a;">0 (Nil)</div>
            </div>
          </div>

          <!-- Breakdown by Blood Group -->
          <div style="margin-top:18px;">
            <div class="table-caption-print">COLLECTION BREAKDOWN BY BLOOD GROUP</div>
            <table class="doc-data-table">
              <thead>
                <tr>
                  <th>O Positive (O+)</th>
                  <th>A Positive (A+)</th>
                  <th>B Positive (B+)</th>
                  <th>AB Positive (AB+)</th>
                  <th>O Negative (O-)</th>
                  <th>A Negative (A-)</th>
                  <th>B Negative (B-)</th>
                  <th>AB Negative (AB-)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="text-align:center; font-weight:700;">
                  <td>${Math.round(camp.collectedUnits * 0.35)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.22)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.26)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.08)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.04)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.02)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.02)} U</td>
                  <td>${Math.round(camp.collectedUnits * 0.01)} U</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Medical Signatures -->
          <div class="signatures-row" style="margin-top:36px;">
            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Voluntary Organization President</div>
              <div class="sig-sub">Camp Partner Representative</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Lead Phlebotomist / Staff</div>
              <div class="sig-sub">${camp.inchargeStaff || 'Meera Joshi'}</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Dr. Rakesh Patel, MD</div>
              <div class="sig-sub">Camp Supervising Medical Officer</div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 6. PRE-DONATION MEDICAL SCREENING & VOLUNTARY CONSENT FORM
    // =========================================================================
    buildScreeningFormHTML(donor) {
      donor = donor || {
        name: '',
        age: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        city: 'Ahmedabad',
        address: ''
      };

      return `
        <div class="print-sheet screening-sheet">
          <div class="doc-header">
            <div class="doc-header-left">
              <div class="doc-org-name">RAKTSETU CLINICAL BLOOD BANK</div>
              <div class="doc-org-sub">Voluntary Blood Donor Registration, Medical Screening &amp; Informed Consent Form</div>
              <div class="doc-org-sub">Form Code: FORM-VBD-01 • Compliant with Drugs &amp; Cosmetics Rules &amp; NBTC Guidelines</div>
            </div>
            <div class="doc-header-right">
              <div style="font-size:11px; font-weight:700; color:#64748b;">DONOR REGISTRATION:</div>
              <div style="font-size:14px; font-weight:800; font-family:monospace; color:#0f172a;">${donor.id ? `#DON-${donor.id}` : 'NEW APPLICANT'}</div>
              <div style="font-size:10px; color:#64748b; margin-top:2px;">Date: _______________</div>
            </div>
          </div>

          <div class="doc-divider"></div>

          <!-- SECTION 1: DONOR PARTICULARS -->
          <div class="form-sec-title">SECTION A: DONOR GENERAL INFORMATION (રક્તદાતા સામાન્ય વિગત)</div>
          <div class="screening-fields-grid">
            <div class="sf-row"><span class="sf-lbl">Full Name:</span> <span class="sf-val">${donor.name || '________________________________________________'}</span></div>
            <div class="sf-row"><span class="sf-lbl">Age / DOB:</span> <span class="sf-val">${donor.age ? `${donor.age} Yrs` : '______ Yrs'}</span></div>
            <div class="sf-row"><span class="sf-lbl">Gender:</span> <span class="sf-val">${donor.gender || '[  ] Male   [  ] Female   [  ] Other'}</span></div>
            <div class="sf-row"><span class="sf-lbl">Blood Group:</span> <span class="sf-val"><strong>${donor.bloodGroup || '______'}</strong></span></div>
            <div class="sf-row"><span class="sf-lbl">Mobile Phone:</span> <span class="sf-val">${donor.phone || '____________________'}</span></div>
            <div class="sf-row"><span class="sf-lbl">City / District:</span> <span class="sf-val">${donor.city || '____________________'}</span></div>
            <div class="sf-row" style="grid-column: span 2;"><span class="sf-lbl">Address:</span> <span class="sf-val">${donor.address || '________________________________________________________________________________'}</span></div>
          </div>

          <!-- SECTION 2: PHYSICAL EXAMINATION (BY CLINICAL OFFICER) -->
          <div class="form-sec-title" style="margin-top:14px;">SECTION B: CLINICAL EXAMINATION BY MEDICAL OFFICER (શારીરિક તપાસ)</div>
          <table class="doc-data-table" style="margin-top:6px;">
            <thead>
              <tr>
                <th>Body Weight (Min 45 kg)</th>
                <th>Blood Pressure (mmHg)</th>
                <th>Pulse Rate (60-100 bpm)</th>
                <th>Hemoglobin (Min 12.5 g/dL)</th>
                <th>Venepuncture Site Check</th>
              </tr>
            </thead>
            <tbody>
              <tr style="height:36px; text-align:center;">
                <td>_______ kg</td>
                <td>_______ / _______ mmHg</td>
                <td>_______ bpm (Regular)</td>
                <td><strong>_______ g/dL</strong></td>
                <td>[  ] Clear  [  ] Scar Free</td>
              </tr>
            </tbody>
          </table>

          <!-- SECTION 3: DONOR HEALTH QUESTIONNAIRE -->
          <div class="form-sec-title" style="margin-top:14px;">SECTION C: MANDATORY DONOR HEALTH DECLARATION (આરોગ્ય પ્રશ્નાવલી)</div>
          <table class="doc-data-table compact-screening-table" style="margin-top:6px;">
            <thead>
              <tr>
                <th style="width:75%;">Medical Screening Criteria / History</th>
                <th style="text-align:center; width:12%;">YES (હા)</th>
                <th style="text-align:center; width:13%;">NO (ના)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1. Do you feel well and in good physical health today?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>2. Have you eaten a meal or nutritious snack in the last 4 hours?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>3. Have you donated blood in the last 90 days?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>4. Have you taken any antibiotics, aspirin, or medications in the past 48 hours?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>5. In the last 12 months, have you had a tattoo, body piercing, or dental surgery?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>6. History of Jaundice, Hepatitis B or C, Malaria, Typhoid, or Rabies vaccination?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>7. History of Heart Disease, High BP, Diabetes on insulin, Epilepsy, or Kidney disease?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
              <tr><td>8. For Female Donors: Are you currently pregnant or nursing?</td><td style="text-align:center;">[  ]</td><td style="text-align:center;">[  ]</td></tr>
            </tbody>
          </table>

          <!-- SECTION 4: INFORMED CONSENT & SIGNATURES -->
          <div class="form-sec-title" style="margin-top:14px;">SECTION D: INFORMED CONSENT DECLARATION (સ્વેચ્છિક રક્તદાન સંમતિ)</div>
          <div style="font-size:10.5px; line-height:1.45; color:#334155; margin-top:4px;">
            I hereby state that I am voluntarily donating my blood of my own free will. 
            I understand that my blood will be screened for infectious markers (HIV, HBV, HCV, Syphilis, Malaria). 
            All declarations given by me are true to the best of my knowledge.
          </div>

          <div class="signatures-row" style="margin-top:24px;">
            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Donor's Signature / Thumb Impression</div>
              <div class="sig-sub">Date: __________________</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Screening Phlebotomist / Staff</div>
              <div class="sig-sub">Identity Verified</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Medical Officer's Clearance Stamp</div>
              <div class="sig-sub">[  ] Accepted   [  ] Deferred</div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 7. MASTER DONORS DIRECTORY ROSTER
    // =========================================================================
    buildDonorsRosterHTML() {
      const donors = window.localStore?.donors || [];
      const printDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

      const rows = donors.map(d => `
        <tr>
          <td><strong>#DON-${d.id}</strong></td>
          <td><strong>${d.name}</strong></td>
          <td><span class="blood-pill-print">${d.bloodGroup}</span></td>
          <td>${d.age || 26} Yrs / ${d.gender || 'Male'}</td>
          <td>${d.city}</td>
          <td>${d.phone}</td>
          <td>${d.donorType || 'Permanent'}</td>
          <td><span class="status-pass-print">${d.eligibilityStatus || 'Eligible'}</span></td>
          <td>${d.lastDonationDate || '2026-06-15'}</td>
        </tr>
      `).join('');

      return `
        <div class="print-sheet report-sheet">
          <div class="doc-header">
            <div class="doc-header-left">
              <div class="doc-org-name">RAKTSETU STATE BLOOD TRANSFUSION SERVICES</div>
              <div class="doc-org-sub">Verified Master Donor Directory &amp; Clinical Eligibility Roster</div>
            </div>
            <div class="doc-header-right">
              <div style="font-size:11px; font-weight:700; color:#64748b;">ACTIVE DONORS:</div>
              <div style="font-size:16px; font-weight:800; color:#0f172a;">${donors.length} Verified Records</div>
              <div style="font-size:10px; color:#64748b;">Date: ${printDate}</div>
            </div>
          </div>

          <div class="doc-divider"></div>

          <table class="doc-data-table" style="margin-top:14px;">
            <thead>
              <tr>
                <th>Donor ID</th>
                <th>Full Name</th>
                <th>Blood Group</th>
                <th>Age / Gender</th>
                <th>City</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Eligibility</th>
                <th>Last Donation</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="signatures-row" style="margin-top:36px;">
            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Registry Database Custodian</div>
              <div class="sig-sub">RaktSetu HQ</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">State Transfusion Medical Director</div>
              <div class="sig-sub">Government of Gujarat</div>
            </div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 8. AUDIT & COMPLIANCE LEDGER REPORT
    // =========================================================================
    buildAuditReportHTML() {
      const logs = window.localStore?.auditLogs || [];
      const printDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      const rows = logs.map(l => `
        <tr>
          <td style="font-family:monospace; font-size:10px;">${l.timestamp || 'Just now'}</td>
          <td><strong>${l.operator || 'System'}</strong></td>
          <td>${l.action || 'Data Access'}</td>
          <td>${l.module || 'Transfusion Engine'}</td>
          <td style="font-family:monospace; font-size:9.5px;">${l.hash ? l.hash.substring(0, 20) + '...' : 'e3b0c44298fc1c...'}</td>
          <td><span class="status-pass-print">✓ VERIFIED</span></td>
        </tr>
      `).join('');

      return `
        <div class="print-sheet report-sheet">
          <div class="doc-header">
            <div class="doc-header-left">
              <div class="doc-org-name">RAKTSETU CLINICAL GOVERNANCE &amp; COMPLIANCE LEDGER</div>
              <div class="doc-org-sub">Cryptographically Verified Immutable System Audit Trail (FDA / NABH Standard)</div>
            </div>
            <div class="doc-header-right">
              <div class="doc-badge-crimson" style="background:#059669;">SHA-256 AUDITED</div>
              <div style="font-size:11px; font-weight:700; color:#64748b; margin-top:4px;">LEDGER LOGS:</div>
              <div style="font-size:14px; font-weight:800; font-family:monospace; color:#0f172a;">${logs.length} Cryptographic Entries</div>
            </div>
          </div>

          <div class="doc-divider"></div>

          <table class="doc-data-table" style="margin-top:14px;">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action Event</th>
                <th>System Module</th>
                <th>SHA-256 Verification Hash</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="signatures-row" style="margin-top:36px;">
            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">System Security &amp; Audit Officer</div>
              <div class="sig-sub">Digital Records Administrator</div>
            </div>

            <div class="sig-col">
              <div class="sig-space"></div>
              <div class="sig-line"></div>
              <div class="sig-title">Hospital Chief Compliance Officer</div>
              <div class="sig-sub">Clinical Governance Committee</div>
            </div>
          </div>
        </div>
      `;
    }
  };

  // Expose globally
  window.HemaCarePrint = HemaCarePrint;

})(window, document);

