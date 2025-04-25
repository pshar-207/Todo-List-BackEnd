const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DATABASE,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Save User to MongoDB
app.post(`/${process.env.API}/api/createUser`, async (req, res) => {
  try {
    const { displayName, email, photo } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ displayName, email, photo, theme: "DefaultTheme" });
      await user.save();
    } else {
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new task
app.post(`/${process.env.API}/api/createTasks`, async (req, res) => {
  try {
    const { userId, title, tasks } = req.body;
    const newTask = new Task({ user: userId, title, tasks });

    await newTask.save();
    res
      .status(200)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get tasks for a specific user
app.get(`/${process.env.API}/api/getAllTasks`, async (req, res) => {
  try {
    const { userId } = req.query;
    const tasks = await Task.find({ user: userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update an existing task (e.g., mark complete, edit title/task)
app.put(`/${process.env.API}/api/updateTask/:id`, async (req, res) => {
  try {
    const { title, tasks } = req.body;
    const updatedTaskList = await Task.findByIdAndUpdate(
      req.params.id,
      { title, tasks },
      { new: true }
    );
    res.status(200).json({
      message: "Task updated successfully",
      taskList: updatedTaskList,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a task group
app.delete(`/${process.env.API}/api/deleteTaskGroup/:_id`, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params._id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a task
app.delete(
  `/${process.env.API}/api/deleteTask/:taskName/:taskListId`,
  async (req, res) => {
    try {
      const { taskName, taskListId } = req.params;

      const updatedTaskList = await Task.findOneAndUpdate(
        { _id: taskListId, "tasks.task": taskName },
        { $pull: { tasks: { task: taskName } } },
        { new: true }
      );

      if (!updatedTaskList) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({
        message: "Task deleted successfully",
        updatedTaskList,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Update theme
app.put(`/${process.env.API}/api/updateTheme`, async (req, res) => {
  try {
    const { userId, theme } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { theme },
      { new: true }
    );

    res.status(200).json({ message: "Theme updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
