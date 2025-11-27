const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
  const payload = isLogin ? { email, password } : { name, email, password, role };

  try {
    const response = await axios.post(url, payload);

    if (isLogin) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 🔥 FIX: redirect to your HTML dashboard page
      window.location.href = "/dashboard.html";
    } else {
      setIsLogin(true);
      setError('Registration successful! Please login.');
    }

  } catch (err) {
    setError(err.response?.data?.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
