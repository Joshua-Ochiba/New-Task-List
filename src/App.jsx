import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Toaster } from "sonner";

import Homepage from "./components/Homepage";
import Layout from "./components/Layout";
import TodoView from "./components/TodoView";
import TodoEditor from "./components/TodoEditor";
import ArchiveView from "./components/ArchiveView";
import SearchView from "./components/SearchView";
import TagsView from "./components/TagsView";
import SettingsView from "./components/SettingsView";
import { ThemeProvider } from "./context/ThemeContext";


export default function App() {
  return <ThemeProvider>
    <Router>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<TodoView />} />
            <Route path="/todo/:todoId" element={<TodoEditor />} />
            <Route path="/new" element={<TodoEditor />} />
            <Route path="/archived" element={<ArchiveView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/tags/:tag" element={<TagsView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </SignedIn>

      <SignedOut>
        <Homepage />
      </SignedOut>

      <Toaster richColors />
    </Router>
  </ThemeProvider>
}