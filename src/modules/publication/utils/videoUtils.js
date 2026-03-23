export const extractYouTubeId = (url) => {
  const regExp =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const extractVimeoId = (url) => {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const generateEmbedUrl = (url) => {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;

  const vimeoId = extractVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return '';
};