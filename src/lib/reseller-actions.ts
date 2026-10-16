'use server';

import type { ResellerLeadPayload } from '@/schemas/reseller/reseller-lead.schema';

type ResellerLeadResult = { ok: true } | { ok: false; reason: 'invalid' | 'rate_limited' | 'error' };

export async function submitResellerLead(payload: ResellerLeadPayload): Promise<ResellerLeadResult> {
  try {
    const response = await fetch(`${process.env.API_URL}/leads/reseller`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.status === 429) {
      return { ok: false, reason: 'rate_limited' };
    }

    if (response.status === 400) {
      return { ok: false, reason: 'invalid' };
    }

    return response.ok ? { ok: true } : { ok: false, reason: 'error' };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
