function extractFileName(url : string) {
    const decodedUrl = decodeURIComponent(url);
    
    const parts = decodedUrl.split('/');
  
    const filePart = parts[parts.length - 1].split('?')[0];
  
    return filePart;
  }