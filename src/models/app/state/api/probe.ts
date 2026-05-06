import axios from 'axios';

const PROBE_URL = 'https://clients3.google.com/generate_204';

export const probeInternet = async (timeoutMs: number): Promise<boolean> => {
  try {
    const response = await axios.head(PROBE_URL, { timeout: timeoutMs });
    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  }
};
