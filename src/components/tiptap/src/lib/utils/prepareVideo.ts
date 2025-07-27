const isEmbedVideo = (src: string) => {
  return [
    "youtube.com",
    "youtu.be",
    "vimeo.com",
    "dailymotion.com",
    "dai.ly",
    "tiktok.com",
    "loom.com",
  ].some((domain) => src.includes(domain));
};

const convertToEmbedUrl = (url: string) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }

  if (url.includes("dailymotion.com") || url.includes("dai.ly")) {
    const videoId = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([\w-]+)/)?.[1];
    return videoId ? `https://www.dailymotion.com/embed/video/${videoId}` : url;
  }

  if (url.includes("tiktok.com")) {
    return `https://www.tiktok.com/embed${new URL(url).pathname}`;
  }

  if (url.includes("loom.com")) {
    return url.replace("/share/", "/embed/");
  }

  return url;
};

export { convertToEmbedUrl, isEmbedVideo };
