const Todo = require('../models/Todo');

// Get all todos for the logged-in user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    res.json(todos);
  } catch (err) {
    console.error('Get todos error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new todo
exports.addTodo = async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({
      userId: req.user.userId,
      text,
      completed: false,
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    console.error('Add todo error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Todo.deleteOne({ _id: id, userId: req.user.userId });
    if (deleted.deletedCount === 0)
      return res.status(404).json({ message: 'Todo not found or unauthorized' });

    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Delete todo error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle completion status
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { completed },
      { new: true }
    );

    if (!updatedTodo)
      return res.status(404).json({ message: 'Todo not found or unauthorized' });

    res.json(updatedTodo);
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};