exports.getAllUsers = (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  res.json({ id, name: `Utilisateur ${id}` });
};

exports.createUser = (req, res) => {
  const user = req.body;
  res.status(201).json({
    message: 'Utilisateur créé',
    user
  });
};
