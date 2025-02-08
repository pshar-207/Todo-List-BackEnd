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
app.post("/api/users", async (req, res) => {
  try {
    const { displayName, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ displayName, email });
      await user.save();
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new task
app.post("/api/tasks", async (req, res) => {
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
app.get("/api/tasks", async (req, res) => {
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
app.put("/api/tasks/:id", async (req, res) => {
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

// Delete a task or task group
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
