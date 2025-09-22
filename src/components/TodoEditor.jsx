import { useMutation, useQuery } from 'convex/react';
import React, { use, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

const TodoEditor = () => {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  const isNewTask = !todoId;
  const task = useQuery(api.tasks.getTasks, user && todoId ? { userId: user.id } : "skip");
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const toggleArchiveTask = useMutation(api.tasks.toggleArchiveTask);

  const currentTask = task?.find((n) => n._id === todoId);

  useEffect(() => {
    if (currentTask && !isModified) {
      setTitle(currentTask.title || "");
      setContent(currentTask.content || "");
      setTags(currentTask.tags?.join(", ") || "");
    }
  }, [currentTask, isModified]);

  useEffect(() => {
    const handleBeforUnload = (e) => {
      if (isModified) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      };
    };

    window.addEventListener("beforeunload", handleBeforUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforUnload);
    }
  }, [isModified])

  const handleSave = useCallback(
    async (silent = false) => {
      if (!user || !title.trim()) {
        if (!title.trim()) {
          toast.error("Please enter a title");
        }

        return;
      }

      setIsSaving(true);

      try {
        const tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (isNewTask) {
          await createTask({
            title: title.trim(),
            content: content.trim(),
            tags: tagArray,
            userId: user.id,
          });
        } else {
          await updateTask({
            id: noteId,
            title: title.trim(),
            content: content.trim(),
            tags: tagArray,
          });
        }

        setIsModified(false);

        if (!silent) {
          toast.success("Note saved successfully");
          navigate("/");
        }

      } catch (error) {
        console.error("Failed to save note:", error);
        toast.error("Failed to save note");
      } finally {
        setIsSaving(false);
      }
    },
    [
      content,
      createTask,
      isNewTask,
      navigate,
      todoId,
      tags,
      title,
      updateTask,
      user,
    ]
  );

  return (
    <div>TodoEditor</div>
  )
}

export default TodoEditor