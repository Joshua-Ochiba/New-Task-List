import { useUser } from '@clerk/clerk-react';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowBigLeft, ArrowLeft, ArrowRight, ClosedCaptionIcon, Cross, PanelLeft, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, PanelTopOpen, Plus, Search, Settings, SettingsIcon } from 'lucide-react';
import { Input } from './ui/input';
import TaskList from './TaskList';
import TaskPreview from './TaskPreview';
import './TodoView.css';

export default function TodoView() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTodoId, setSelectedTodId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeColumn, setActiveColumn] = useState(0);
  const columns = ["To Do", "In Progress", "Completed"];

  const scrollRef = React.useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: activeColumn * scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [activeColumn]);

  const todos = useQuery(
    api.tasks.getTasks,
    user ? { userId: user.id, isArchived: false } : "skip"
  );

  const searchResults = useQuery(
    api.tasks.searchTasks,
    user && searchTerm.trim ? {
      userId: user.id, searchTerm:
        searchTerm.trim()
    } : "skip"
  )

  const displayTodos = searchTerm.trim() ? searchResults : todos;

  const selectedTodo = displayTodos?.find((todo) => todo._id === selectedTodoId);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile)
  }, []);

  useEffect(() => {
    if (displayTodos?.length && !selectedTodoId && !isMobile) {
      setSelectedTodId(displayTodos[0]._id);
    }
  }, [displayTodos, selectedTodoId, isMobile]);

  const handleCreateNew = () => {
    navigate("/new");
  }

  const handleSelectTodo = (todoId) => {
    if (isMobile) {
      navigate(`/todo/${todoId}`)
    }
    else {
      setSelectedTodId(todoId)
    }
  }

  const handleSearchFocus = () => {
    if (isMobile) {
      navigate("/search");

    }
  };

  return (

    <div className='flex h-screen bg-white'>
      {/*List Tasks*/}
      <div className='w-full flex flex-col  border-gray-200'>
        {/*Header*/}
        <div className='p-4 border-b border-gray-200 bg-white'>
          <div className="flex flex-col items-start justify-between mb-4">
            <h1 className='text-2xl font-bold mb-2 text-gray-900'>All Tasks</h1>

            <div className='flex items-center justify-between gap-2 w-full'>
              <Button size='sm' ononClick={handleCreateNew}
                className='bg-primary hover:bg-primary/75 gap2'>
                <Plus className='size-4' />
                Add New Tasks
              </Button>

              <div className='flex items-center gap-2'>
                <Button size='sm' variant='ghost' onClick={() => navigate('/settings')}>
                  <SettingsIcon className='size-4' />
                </Button>

                <Button size='sm' className='cursor-pointer bg-primary' onClick={() => setShowDetails(!showDetails)}>
                  <PanelRightOpen className='size-4' />
                  {showDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>

            </div>
          </div>

          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-4.5 transform -translate-y-1/2
            size-4 text-gray-400'/>
            <Input placeholder='Search'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={handleSearchFocus}
              className='pl-10 border-gray-300 text-sm focus:border-blue-500' />
          </div>
        </div>

        <div className='w-full md:w-80 flex flex-col'>

        </div>
        {/* Mobile Column Navigation */}
        <div className="flex gap-3 items-center md:hidden px-4 py-2">
          <Button
            size="sm"

            disabled={activeColumn === 0}
            onClick={() => setActiveColumn((prev) => Math.max(prev - 1, 0))}
          >
            <ArrowLeft />
          </Button>

          <span className="text-sm font-medium">{columns[activeColumn]}</span>

          <Button
            size="sm"

            disabled={activeColumn === columns.length - 1}
            onClick={() =>
              setActiveColumn((prev) => Math.min(prev + 1, columns.length - 1))
            }
          >
            <ArrowRight />
          </Button>
        </div>

        {/*Task List*/}
        <div
          ref={scrollRef}
          className="flex flex-row md:flex-row overflow-x-auto md:overflow-x-hidden h-full"
        >


          {/* To Do */}
          <div className='p-4 flex-shrink-0 w-full md:flex-1 min-w-full md:min-w-0'>
            <div className='flex items-center mb-4'>

              <div className='todo-circle-orange'></div>
              <h2 className='text-sm font-bold text-gray-700'>To Do</h2>
            </div>
            <TaskList
              todos={displayTodos || []}
              selectedTodoId={selectedTodoId}
              onTodoSelect={handleSelectTodo}
              loading={!displayTodos} />
          </div>

          {/* In Progress */}
          <div className="p-4 flex-shrink-0 w-full md:flex-1 min-w-full md:min-w-0">

            <div className='flex items-center mb-4'>
              <div className='todo-circle-blue'></div>
              <h2 className='text-sm font-bold text-gray-700'>In Progress</h2>
            </div>

            <div className='flex gap-3 flex-col'>
              <TaskList
                todos={displayTodos || []}
                selectedTodoId={selectedTodoId}
                onTodoSelect={handleSelectTodo}
                loading={!displayTodos} />
              <TaskList
                todos={displayTodos || []}
                selectedTodoId={selectedTodoId}
                onTodoSelect={handleSelectTodo}
                loading={!displayTodos} />
            </div>
          </div>

          {/* Completed */}
          <div className="p-4 flex-shrink-0 w-full md:flex-1 min-w-full md:min-w-0">
            <div className='flex items-center mb-4'>
              <div className='todo-circle-green'></div>
              <h2 className='text-sm font-bold text-gray-700'>Completed</h2>
            </div>
            <div className='flex gap-3 flex-col'>
              <TaskList
                todos={displayTodos || []}
                selectedTodoId={selectedTodoId}
                onTodoSelect={handleSelectTodo}
                loading={!displayTodos} />
              <TaskList
                todos={displayTodos || []}
                selectedTodoId={selectedTodoId}
                onTodoSelect={handleSelectTodo}
                loading={!displayTodos} />
              <TaskList
                todos={displayTodos || []}
                selectedTodoId={selectedTodoId}
                onTodoSelect={handleSelectTodo}
                loading={!displayTodos} />
              <TaskList
                todos={displayTodos || []}
                selectedTodoId={selectedTodoId}
                onTodoSelect={handleSelectTodo}
                loading={!displayTodos} />
            </div>

          </div>
        </div>


      </div>




      {/* Task Details Panel */}
      <div
        className={`transform transition-transform duration-300 ease-in-out 
    ${showDetails ? "translate-x-0" : "translate-x-full"} 
    fixed top-0 right-0 h-full w-full sm:w-1/3 bg-white shadow-lg z-50`}
      >

        {/* Header with Close Button */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold">Task Details</h2>
          <Button size="sm" variant="ghost" onClick={() => setShowDetails(false)}>
            <PanelRightClose className="size-4" />
          </Button>
        </div>

        {selectedTodo ? (
          <TaskPreview
            todo={selectedTodo}
            onEdit={() => navigate(`/todo/${selectedTodo._id}`)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            {displayTodos?.length === 0
              ? "No tasks found. Create a new task!"
              : "Select a task to view details"}
          </div>
        )}
      </div>

    </div>


  )
}

//"No tasks found. Create a new task!" : "Select a task to view details"}
{/*
  {/*Task Details*
      !isMobile && (
        <div className='flex-1 min-w-0 bg-white'>
          {selectedTodo ? (
            <TaskPreview
              todo={selectedTodo}
              onEdit={() => navigate(`/todo/${selectedTodo._id}`)}
            />
          ) :
            (<div className='h-full flex items-center justify-center text-gray-500'>
              {displayTodos?.length === 0 ? "No tasks found. Create a new task!" : "Select a task to view details"}
            </div>
            )}
        </div>
      )
  */}
