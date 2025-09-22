import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

//Get All Todos
export const getTasks = query({
  args: {
    userId: v.string(),
    isArchived: v.optional(v.boolean()),
    tagFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("todos").withIndex("by_user",
      (q) => q.eq("userId", args.userId));

    if (args.isArchived != undefined) {
      query = ctx.db.query("todos").withIndex("by_user_archived", (q) => q.eq("userId", args.
        userId).eq("isArchived", args.isArchived))
    }

    let tasks = await query.order("desc").collect();

    //Filter by tag if tag provided
    if (args.tagFilter) {
      tasks = tasks.filter((task) => task.tags.some((tag) => tag.toLowerCase().includes(args.
        tagFilter.toLowerCase())));
    }

    return tasks;
  }
});

//search tasks
export const searchTasks = query({
  args: {
    userId: v.string(),
    searchTerm: v.string(),
  },
  
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return await ctx.db
        .query("todos")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    }

    const searchResults = await ctx.db
      .query("todos")
      .withSearchIndex("search_tasks", (q) =>
        q.search("content", args.searchTerm)
          .eq("userId", args.userId)
          .eq("isArchived", false))
      .collect();

    const allTasks = await ctx.db.query("todos").withIndex("by_user", (q) => q.eq("userId",
      args.userId)).collect();

    const titleAndTagResults = allTasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(args.searchTerm.toLowerCase());
      const tagMatch = task.tags.some((tag) => tag.toLowerCase().includes(args.searchTerm.toLowerCase()));


      return (titleMatch || tagMatch) && !task.isArchived;
    });

    const combinedResults = [...searchResults];
    titleAndTagResults.forEach((task) => {
      if (!combinedResults.some((existing) => existing._id === task._id)) {
        combinedResults.push(task);
      }
    });

    return combinedResults.sort((a, b) => b.updatedAt - a.updatedAt);
  }
})

//get unique user tags
export const getUserTags = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const todos = await ctx.db.query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();

    const tagsSet = new Set();
    todos.forEach(todo => {
      todo.tags.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }
});


//create task
export const createTask = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    tags: v.array(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date();
    return await ctx.db.insert("todos", {
      title: args.title,
      content: args.content,
      tags: args.tags,
      isArchived: false,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });
  }
});


//update task
export const updateTask = mutation({
  args: {
    id: v.id('todos'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});


// Archive/unarchive a task
export const toggleArchiveTask = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    return await ctx.db.patch(args.id, {
      isArchived: !task.isArchived,
      updatedAt: Date.now(),
    });
  },
});

// Delete
export const deleteNote = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});