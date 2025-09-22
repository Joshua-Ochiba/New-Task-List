import React from 'react'
import './TaskList.css'
import { Badge, Ellipsis } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export default function TaskList({ todos, selectedTodoId, onTodoSelect, loading }) {
  if (loading) {
    return (
      <div className='p-4 task space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='animate-pulse space-y-2 p-4'>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />

            <div className='flex gap-2'>
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

        ))}
      </div>
    )
  }

  /*
  if (!todos || todos.length === 0) {
    return (
      <div className='p-4 text-center text-gray-500'>
        No tasks found. Create a new task!
      </div>
    )
  }*/

  const formatDate = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }

    catch {
      return "Unknown Date"
    }
  }

  const truncateContent = (content, maxLength = 80) => {
    if (!content) return '';

    //Remove HTML tags if any
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    return plainText.length > maxLength ? plainText.slice(0, maxLength) + '...' : plainText;


  }

  return <div>
    <div className='task p-5'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-bold'>TITLE</h1>
        <Ellipsis className='size-4' />
      </div>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
        ore modi enim numquam unde ad.</p>
    </div>
  </div>
}

{/*
  <div className='task p-5'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-bold'>TITLE</h1>
        <Ellipsis className='size-4' />
      </div>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
        ore modi enim numquam unde ad.</p>
    </div>

        {todos.map((todo) => (
      <button key={tot._id}
        onClick={() => onTodoSelect(todo._id)}
        className={cn("w-full lp-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100",
          selectedTodoId === todo._id && "bg-blue-50 border-blue-200")}>

        <div className='task space-y-2'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium text-base text-gray-900 line-clamp-1'>
              {todo.title || "Untitled Task"}
            </h3>
            <Ellipsis className='size-4' />
          </div>

          {todo.content && (
            <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
              {truncateContent(todo.content)}
            </p>
          )}

          <div className='flex flex-wrap gap-2 items-center justify-between'>
            <div className='flex gap-1 flex-wrap'>
              {todo.tags?.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className='text-xs px-2 py-1 bg-primary/25 
                text-primary hover:bg-primary/50'>
                  {tag}
                </Badge>
              ))}

              {todo.tags && todo.tags.length > 3 && (
                <Badge variant="secondary" className='text-xs px-2 py-1 border-primary textprimary'>
                  +{todo.tags.length - 3} more
                </Badge>
              )}
            </div>

            <span className='text-xs text-gray-500'>
              {formatDate(todo.updatedAt)}
            </span>
          </div>
        </div>
      </button>
    ))}
   */}

