// File: src/apis/index.ts

export const triggerAuthToken = async (
  sessionToken: string,
  channel: string,
  userId: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const response = await fetch('https://your-backend-api.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        channel,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error in triggerAuthToken:', error);
    return { success: false, error };
  }
};