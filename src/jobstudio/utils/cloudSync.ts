// Mirrors the app's per-user browser storage (keys starting with "jobstudio_") to Lovable Cloud,
// so a signed-in user's data comes back on any device. App logic keeps using localStorage unchanged.
import { supabase } from '@/integrations/supabase/client';

const PREFIX = 'jobstudio_';
const SESSION_KEYS = new Set(['jobstudio_logged_in', 'jobstudio_user_name', 'jobstudio_user_email', 'jobstudio_applied_jobs']);

let currentUserId: string | null = null;
let suppress = false;
let installed = false;
const pending = new Map<string, string | null>();
let timer: ReturnType<typeof setTimeout> | null = null;

const shouldSync = (key: string) => key.startsWith(PREFIX) && !SESSION_KEYS.has(key);

const flush = async () => {
  timer = null;
  const userId = currentUserId;
  if (!userId || pending.size === 0) return;
  const batch = [...pending.entries()];
  pending.clear();
  const upserts = batch.filter(([, v]) => v !== null).map(([key, value]) => ({ user_id: userId, key, value, updated_at: new Date().toISOString() }));
  const deletes = batch.filter(([, v]) => v === null).map(([key]) => key);
  if (upserts.length) {
    const { error } = await supabase.from('user_data').upsert(upserts);
    if (error) console.error('Cloud save failed', error.message);
  }
  if (deletes.length) {
    const { error } = await supabase.from('user_data').delete().eq('user_id', userId).in('key', deletes);
    if (error) console.error('Cloud delete failed', error.message);
  }
};

const queue = (key: string, value: string | null) => {
  if (suppress || !currentUserId || !shouldSync(key)) return;
  pending.set(key, value);
  if (!timer) timer = setTimeout(flush, 600);
};

export const installCloudSync = () => {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  const proto = Storage.prototype;
  const origSet = proto.setItem;
  const origRemove = proto.removeItem;
  proto.setItem = function (key: string, value: string) {
    origSet.call(this, key, value);
    if (this === window.localStorage) queue(key, String(value));
  };
  proto.removeItem = function (key: string) {
    origRemove.call(this, key);
    if (this === window.localStorage) queue(key, null);
  };
  window.addEventListener('beforeunload', () => { void flush(); });
};

/** Loads the user's saved data into browser storage, then starts syncing changes for that user. */
export const startCloudSession = async (userId: string) => {
  currentUserId = userId;
  const { data, error } = await supabase.from('user_data').select('key, value').eq('user_id', userId);
  if (error) {
    console.error('Cloud load failed', error.message);
    return;
  }
  suppress = true;
  try {
    for (const row of data || []) {
      if (row.value !== null) localStorage.setItem(row.key, row.value);
    }
  } finally {
    suppress = false;
  }
};

export const endCloudSession = async () => {
  await flush();
  currentUserId = null;
};

/** Flushes any queued browser storage mutations immediately to Lovable Cloud. */
export const triggerCloudSync = async () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  await flush();
};

/** Reports whether any localStorage changes are currently queued for sync. */
export const hasPendingCloudSync = () => pending.size > 0;

