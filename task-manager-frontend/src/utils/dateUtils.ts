export const formatRelativeTime = (date: string): string => {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return `il y a ${diff} secondes`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} heures`;
    if (diff < 2592000) return `il y a ${Math.floor(diff / 86400)} jours`;
    return `il y a ${Math.floor(diff / 2592000)} mois`;
  };
  