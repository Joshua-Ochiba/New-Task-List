import React from 'react'

const TodoViewcopy = () => {
  return (
        <div className='flex h-screen bg-white'>
      {/*List Tasks*/}
      <div className='w-full md:w-80 flex flex-col border-r border-gray-200'>
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

              <Button size='sm' variant='ghost' onClick={() => navigate('/settings')}>
                <SettingsIcon className='size-4' />
              </Button>
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

        {/*Task List*/}
        <div className='p-4 flex-1 overflow-y-auto bg-white'>
          <TaskList todos={displayTodos || []} selectedTodoId={selectedTodoId}
            onTodoSelect={handleSelectTodo}
            loading={!displayTodos} />
        </div>
      </div>

      {/*Task Details*/}
      {!isMobile && (
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
      )}
    </div>
  )
}

export default TodoViewcopy