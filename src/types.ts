/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AttendeeSession {
  isLoggedIn: boolean;
  unlockedAt: string | null;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  speaker: string;
  description: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Strategy' | 'Sales Automation' | 'Customer Success' | 'Integration' | 'Analytics' | 'Strategi' | 'Otomatisasi Penjualan' | 'Customer Success' | 'Integrasi' | 'Analitis';
  type: 'Ebook' | 'Template' | 'Cheat Sheet' | 'Guide' | 'Spreadsheet';
  description: string;
  fileSize: string;
  downloadsCount: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Sandbox Access' | 'Login Issue' | 'Resource Retrieval' | 'Interactive Tools' | 'Other' | 'Akses Sandbox' | 'Masalah Masuk / Kode Akses' | 'Unduh Materi' | 'Alat & Kalkulator CRM';
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  replies: Array<{
    sender: 'user' | 'agent';
    message: string;
    timestamp: string;
  }>;
}

export interface PipelineDeal {
  id: string;
  dealName: string;
  stage: 'negotiation' | 'qualification' | 'proposal' | 'decision';
  value: number;
  probability: number; // 0 - 100
}
