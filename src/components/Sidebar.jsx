import { SignOutButton, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets } from '@/assets/assets';
import { cn } from '@/lib/utils';
import { ArchiveIcon, ListTodo, ListTodoIcon, LogOut, MenuIcon, Notebook, NotebookIcon, Search, SearchIcon, SettingsIcon, TagIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import './Sidebar.css'

export default function Sidebar() {
  const [isSlid, setIsSlid] = useState(false);
  const toggleSideBar = () => {
    setIsSlid((prev) => !prev);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const tags = useQuery(
    api.tasks.getUserTags,
    user ? { userId: user.id } : "skip"
  );

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;

    return false;

  }

  return (
    <div className={`sidebar ${isSlid ? "slid" : ""} bg-gray-900 border-r border-gray-800 
    flex flex-col h-screen relative`}>
      {/*Header*/}
      <div className='p-6 border-b border-gray-700'>
        <div className="header flex  gap-3 justify-between">
          <div className='flex items-center gap-1'>
            <div className='size-8 bg-primary2 rounded-lg flex items-center justify-center'>
              <img src={assets.logo} onClick={toggleSideBar} className='size-7 text-white slid-gone' alt='easyclass' />
            </div>
            <span className='slid-gone text-xl font-semibold text-white'>
              ToDo
            </span>
          </div>

          <MenuIcon className='menu-icn size-7 slid-menu cursor-pointer "bg-primary text-white hover:bg-primary-75"' onClick={toggleSideBar} />
        </div>
      </div>

      {/*Navigation */}
      <nav className="flex-1 p-4 overflow-auto pb-20">
        <div className="space-y-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/")
                ? "bg-primary text-white hover:bg-primary-75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/")}
            title="All Tasks (Ctrl + 1)"
          >
            <ListTodo /> <span className='slid-gone'>All Tasks</span>
            <span className="slid-gone ml-auto text-xs opacity-75">Ctrl+1</span>
          </Button>

          

          <Button
            variant={isActive("/search") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/search")
                ? "bg-primary text-white hover:bg-primary-75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/search")}
            title="Search Tasks (Ctrl + 3)"
          >
            <SearchIcon /><span className='slid-gone'>Search Tasks</span>
            <span className="slid-gone ml-auto text-xs opacity-75">Ctrl+3</span>
          </Button>

          <Button
            variant={isActive("/settings") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/settings")
                ? "bg-primary text-white hover:bg-primary-75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/settings")}
            title="Settings (Ctrl + 4)"
          >
            <SettingsIcon /> <span className='slid-gone'>Settings</span>
            <span className="slid-gone ml-auto text-xs opacity-75">Ctrl+4</span>
          </Button>
        </div>

        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="mt-8">
            <h3 className='text-sm font-medium text-gray-500 px-3 mb-3 uppercase 
            tracking-wide'>
              Tags
            </h3>

            <div className='space-y-1'>
              {tags.map((tag) => (
                <Button key={tag} variant="ghost" className={cn("w-full justify-start gap-1text-xs h-9",
                  location.pathname === `/tags/${tag}` ? "bg-primary/50 text-white hover:bg-primary-75" : "text-gray-400 hover:bg-gray-800")}
                  onClick={() => navigate(`/tags/${tag}`)}>
                  <TagIcon className='size-4' />
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>




      <div className="absolute bottom-0 z-10 w-full border-t border-gray-800 py-2 px-4 bg-gray-900">
        <SignOutButton>
          <Button className="cursor-pointer bg-primary" size="sm">
            <LogOut /> <span className='slid-gone'>Log out</span>
          </Button>
        </SignOutButton>
      </div>
    </div>
  )
}

{/*
  <Button
            variant={isActive("/archived") ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              isActive("/archived")
                ? "bg-primary text-white hover:bg-primary-75"
                : "text-gray-400 hover:bg-gray-800"
            )}
            onClick={() => navigate("/archived")}
            title="Archived Tasks (Ctrl + 2)"
          >
            <ArchiveIcon /> <span className='slid-gone'>Archived Tasks</span>
            <span className="slid-gone ml-auto text-xs opacity-75">Ctrl+2</span>
          </Button>
  
  */}