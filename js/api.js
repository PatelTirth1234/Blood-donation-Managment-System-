/**
 * HemaCare OS — API Service Layer
 * Enterprise REST Client with timeout, 3x exponential retry, AbortController, and live sync indicators.
 */

(function(window) {
  'use strict';

  // Automatically determine base URL based on host environment
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http')) {
      return `${window.location.origin}/api`;
    }
    return 'http://localhost:5000/api';
  };

  const API_CONFIG = {
    BASE_URL: getApiBaseUrl(),
    TIMEOUT_MS: 3000,
    MAX_RETRIES: 3
  };

  class HemaCareAPIService {
    constructor() {
      this.isOnline = false;
      this.lastSync = null;
      this.dbInfo = null;
    }

    /**
     * Executes HTTP requests with automatic timeout and exponential backoff retry logic
     * @param {string} endpoint - API route relative to BASE_URL
     * @param {Object} options - Fetch options
     * @param {number} retries - Remaining retry attempts
     */
    async request(endpoint, options = {}, retries = API_CONFIG.MAX_RETRIES) {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const config = {
        ...options,
        headers: { ...defaultHeaders, ...(options.headers || {}) },
        signal: controller.signal
      };

      try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.isOnline = true;
        this.lastSync = new Date();
        this.updateSyncBadge(true);
        return data;
      } catch (err) {
        clearTimeout(timeoutId);

        if (retries > 1 && err.name !== 'AbortError') {
          const delay = 400 * (API_CONFIG.MAX_RETRIES - retries + 1);
          await new Promise(r => setTimeout(r, delay));
          return this.request(endpoint, options, retries - 1);
        }

        this.isOnline = false;
        this.updateSyncBadge(false);
        console.warn(`[HemaCare OS API] Endpoint '${endpoint}' unreachable, switching to local state cache.`);
        return null;
      }
    }

    /**
     * Updates top-bar PostgreSQL health badge
     * @param {boolean} isLive - Connection status
     */
    updateSyncBadge(isLive) {
      const dot = document.getElementById('apiStatusDot');
      const syncTime = document.getElementById('apiSyncTime');
      if (dot && syncTime) {
        if (isLive) {
          dot.className = 'pulse-dot-green';
          syncTime.textContent = 'PostgreSQL Connected';
        } else {
          dot.className = 'pulse-dot-amber';
          syncTime.textContent = 'Failsafe Offline Cache';
        }
      }
    }

    // ========================================================================
    // REST GATEWAY ENDPOINTS
    // ========================================================================

    async checkHealth() {
      const res = await this.request('/health');
      if (res && res.status === 'online') {
        this.dbInfo = res;
      }
      return res;
    }

    async getDashboardStats() { return this.request('/dashboard/stats'); }
    async getDonors(filters = {}) {
      const queryParts = [];
      if (filters.city && filters.city !== 'ALL') queryParts.push(`city=${encodeURIComponent(filters.city)}`);
      if (filters.bloodGroup && filters.bloodGroup !== 'ALL') queryParts.push(`bloodGroup=${encodeURIComponent(filters.bloodGroup)}`);
      if (filters.clearance && filters.clearance !== 'ALL') queryParts.push(`clearance=${encodeURIComponent(filters.clearance)}`);
      if (filters.search && filters.search.trim()) queryParts.push(`search=${encodeURIComponent(filters.search.trim())}`);

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      return this.request(`/donors${queryString}`);
    }
    async getDonorCities() { return this.request('/donors/cities'); }
    async getDonorById(id) { return this.request(`/donors/${id}`); }
    async createDonor(payload) { return this.request('/donors', { method: 'POST', body: JSON.stringify(payload) }); }
    async updateDonor(id, payload) { return this.request(`/donors/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
    async deleteDonor(id) { return this.request(`/donors/${id}`, { method: 'DELETE' }); }
    
    // Smart Matching Engine (Issue 1)
    async getSmartMatches() { return this.request('/matches'); }
    async linkSmartMatch(requestId, donorId) { 
      return this.request('/matches/link', { 
        method: 'POST', 
        body: JSON.stringify({ requestId, donorId }) 
      }); 
    }

    // Log Donation (Issue 2)
    async createDonation(payload) { return this.request('/donations', { method: 'POST', body: JSON.stringify(payload) }); }

    // Hospital Requests & Dispatches (Issue 3)
    async getRequests() { return this.request('/requests'); }
    async createRequest(payload) { return this.request('/requests', { method: 'POST', body: JSON.stringify(payload) }); }

    // Inventory & Auxiliaries
    async getInventory() { return this.request('/inventory'); }
    async getStaff() { return this.request('/staff'); }
    async getHospitals() { return this.request('/hospitals'); }
    async getRecipients() { return this.request('/recipients'); }
    
    // Blood Donation Camp Operations
    async getCamps() { return this.request('/camps'); }
    async createCamp(payload) { return this.request('/camps', { method: 'POST', body: JSON.stringify(payload) }); }
    async updateCamp(id, payload) { return this.request(`/camps/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
    async approveCamp(id, payload = {}) { return this.request(`/camps/${id}/approve`, { method: 'POST', body: JSON.stringify(payload) }); }
    async deleteCamp(id) { return this.request(`/camps/${id}`, { method: 'DELETE' }); }

    // Authentication & User Session Endpoints
    async login(credentials) {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    }

    async register(userData) {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    }

    async forgotPassword(email) {
      return this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    }

    async getCurrentUser() {
      return this.request('/auth/me');
    }

    async logout() {
      return this.request('/auth/logout', {
        method: 'POST'
      });
    }

    // Donor & Medical Reports Endpoints
    async getMyDonorProfile() {
      return this.request('/donors/me');
    }

    async getMedicalReports(donorId = null) {
      const q = donorId ? `?donor_id=${encodeURIComponent(donorId)}` : '';
      return this.request(`/reports${q}`);
    }

    async createMedicalReport(payload) {
      return this.request('/reports', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    async updateDonorEligibility(donorId, payload) {
      return this.request(`/donors/${donorId}/eligibility`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    }

    // Staff Donor Classification & Permanent Donors
    async updateDonorClassification(donorId, payload) {
      return this.request(`/donors/${donorId}/classification`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    }

    async getPermanentDonors() {
      return this.request('/donors/permanent');
    }

    // Camps & Registrations
    async registerForCamp(campId, payload = {}) {
      return this.request(`/camps/${campId}/register`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    async getCampRegistrations(campId) {
      return this.request(`/camps/${campId}/registrations`);
    }

    async getNearbyCamps(lat = 23.0225, lng = 72.5714, radius = 50) {
      return this.request(`/camps/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    }

    // Emergency Logistics Waterfall Dispatch
    async dispatchEmergencyWaterfall(payload) {
      return this.request('/requests/emergency-dispatch', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    async respondToRequest(requestId, payload = {}) {
      return this.request(`/requests/${requestId}/respond`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    // Hospital Coordinator Endpoints
    async getHospitalRequests(hospitalId = null) {
      const q = hospitalId ? `?hospitalId=${encodeURIComponent(hospitalId)}` : '';
      return this.request(`/hospital/requests${q}`);
    }

    async createHospitalRequest(payload) {
      return this.request('/hospital/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    async acceptHospitalDispatch(requestId, payload = {}) {
      return this.request(`/hospital/requests/${requestId}/accept`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    // Camp Organizer Endpoints
    async getActiveCamp(campId = null) {
      const q = campId ? `?campId=${encodeURIComponent(campId)}` : '';
      return this.request(`/camps/active${q}`);
    }

    async registerOngoingCampDonor(payload) {
      return this.request('/camps/active/donors', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    async logActiveCampIntake(payload) {
      return this.request('/camps/active/intake', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    // Notifications Engine
    async getNotifications(role = '', userId = '') {
      const q = [];
      if (role) q.push(`role=${encodeURIComponent(role)}`);
      if (userId) q.push(`user_id=${encodeURIComponent(userId)}`);
      const qs = q.length > 0 ? `?${q.join('&')}` : '';
      return this.request(`/notifications${qs}`);
    }

    async markNotificationRead(id) {
      return this.request(`/notifications/${id}/read`, {
        method: 'PUT'
      });
    }

    async clearNotifications(role = '', userId = '') {
      const q = [];
      if (role) q.push(`role=${encodeURIComponent(role)}`);
      if (userId) q.push(`user_id=${encodeURIComponent(userId)}`);
      const qs = q.length > 0 ? `?${q.join('&')}` : '';
      return this.request(`/notifications/clear${qs}`, {
        method: 'DELETE'
      });
    }

    async getAuditLogs() { return this.request('/audit'); }
  }

  // Export to global window
  window.RaktSetuAPIService = HemaCareAPIService;
  window.HemaCareAPIService = HemaCareAPIService;
  window.API_CONFIG = API_CONFIG;

})(window);

