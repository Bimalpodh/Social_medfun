import Header from "../Headers/Header";
import Sidebar from "../sidebar/Sidebar";
import StoryCreateModal from "../story/StoryCreateModal";
import { useSelector, useDispatch } from "react-redux";
import { setStoryCreateModal } from "../../store/slices/uiSlice";

export default function Layout({ children }) {
  const { isStoryCreateModalOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header stays z-50 to stay on top */}
      <Header />

      {/* Main Container - added pt-16 to push everything below fixed header */}
      <div className=" mx-auto flex pt-16">
        
        {/* Sidebar now starts exactly at the bottom of the header */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 min-w-0 bg-slate-950 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="p-3 sm:p-6 lg:p-10 relative z-10">
            {children}
          </div>
        </main>
        
      </div>

      {/* Global Story Transmission Modal */}
      <StoryCreateModal 
        isOpen={isStoryCreateModalOpen} 
        onClose={() => dispatch(setStoryCreateModal(false))} 
      />
    </div>
  );
}