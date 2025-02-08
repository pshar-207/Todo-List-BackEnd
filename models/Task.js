const mongoose = require("mongoose");

const taskItemSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    tasks: [taskItemSchema],
  },
  {
    collection: "userTodo",
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
