export const uploadFile = async (file, chatId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chat_id', chatId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('old_token')}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}; 