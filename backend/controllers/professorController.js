const loginProfessor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if professor exists
    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(404).json({ message: 'Professor not found.' });
    }

    // Verify password
    const isMatch = await professor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate the token with role
    const token = generateToken({
      email: professor.email,
      role: professor.role || 'professor', // Assign a default role if not defined
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
