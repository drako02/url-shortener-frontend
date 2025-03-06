export const parseDisplayName = (displayName: string | null) => {
    if (!displayName) return { firstName: '', lastName: '' };
    
    const nameParts = displayName.split(' ');
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || ''
    };
  };