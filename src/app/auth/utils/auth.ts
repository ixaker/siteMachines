import axios from 'axios';

export const checkAutorization = async () => {
  if (typeof localStorage === 'undefined') {
    console.error('localStorage is not defined');
    return false;
  }
  const token = localStorage.getItem('token');

  if (token) {
    const formData = new FormData();
    formData.append('token', token);

    try {
      const response = await axios.post('https://machines.qpart.com.ua/auth.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 && response.data.status === 'success') {
        return true;
      } else {
        console.error('Authorization failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error during authorization:', error);
      return false;
    }
  }
  return false;
};
